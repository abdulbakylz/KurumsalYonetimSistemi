
"use client";
import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

type Personel = {
  personelId: number;
  ad: string;
  soyad: string;
  email: string;
  maas?: number | null;
  departmanId: number | null;
};
type Departman = {
  departmanId: number;
  departmanAdi: string;
};
export default function PersonelTablosu({
  personeller,
}: {
  personeller: Personel[];
}) {
  const router = useRouter();

  const [arama, setArama] = useState("");
  const [duzenlenen, setDuzenlenen] = useState<Personel | null>(null);
  const [silinecek, setSilinecek] = useState<Personel | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");
  const [departmanlar, setDepartmanlar] = useState<Departman[]>([]);
const [departmanYukleniyor, setDepartmanYukleniyor] = useState(true);
const [departmanHatasi, setDepartmanHatasi] = useState("");

  const [form, setForm] = useState({
    ad: "",
    soyad: "",
    email: "",
    maas: "",
    departmanId: "",
  });
  useEffect(() => {
    let aktif = true;
  
    async function departmanlariGetir() {
      try {
        const response = await fetch("/api/departmanlar", {
          cache: "no-store",
        });
  
        if (!response.ok) {
          throw new Error("Departmanlar yüklenemedi.");
        }
  
        const data: Departman[] = await response.json();
  
        if (aktif) {
          setDepartmanlar(data);
          setDepartmanHatasi("");
        }
      } catch {
        if (aktif) {
          setDepartmanHatasi("Departman bilgileri alınamadı.");
        }
      } finally {
        if (aktif) {
          setDepartmanYukleniyor(false);
        }
      }
    }
  
    departmanlariGetir();
  
    return () => {
      aktif = false;
    };
  }, []);

  const filtrelenmis = useMemo(() => {
    const kelime = arama.toLocaleLowerCase("tr-TR").trim();

    return personeller.filter((p) =>
      [p.ad, p.soyad, p.email, p.departmanId ?? ""]
        .join(" ")
        .toLocaleLowerCase("tr-TR")
        .includes(kelime)
    );
  }, [arama, personeller]);

  function duzenlemeyiAc(personel: Personel) {
    setHata("");
    setDuzenlenen(personel);

    setForm({
      ad: personel.ad,
      soyad: personel.soyad,
      email: personel.email,
      maas: String(personel.maas ?? 0),
      departmanId: String(personel.departmanId ?? ""),
    });
  }

  async function guncelle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!duzenlenen) return;

    if (
      !form.departmanId ||
      !departmanlar.some(
        (d) => d.departmanId === Number(form.departmanId)
      )
    ) {
      setHata("Lütfen geçerli bir departman seçin.");
      return;
    }

    setYukleniyor(true);
    setHata("");

    try {
      const response = await fetch(
        `/api/personeller/${duzenlenen.personelId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ad: form.ad,
            soyad: form.soyad,
            email: form.email,
            maas: Number(form.maas),
            departmanId: Number(form.departmanId),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setDuzenlenen(null);
      router.refresh();
    } catch (error) {
      setHata(
        error instanceof Error
          ? error.message
          : "Güncelleme başarısız."
      );
    } finally {
      setYukleniyor(false);
    }
  }

  async function sil() {
    if (!silinecek) return;

    setYukleniyor(true);
    setHata("");

    try {
      const response = await fetch(
        `/api/personeller/${silinecek.personelId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error(
          "Personel silinemedi. İlişkili malzeme teslim kayıtları olabilir."
        );
      }

      setSilinecek(null);
      router.refresh();
    } catch (error) {
      setHata(
        error instanceof Error ? error.message : "Silme başarısız."
      );
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">Personel Listesi</h2>
          <p className="text-sm text-slate-500">
            Toplam {personeller.length} personel kayıtlı
          </p>
        </div>

        <input
          type="search"
          placeholder="Ad, soyad veya e-posta ara..."
          value={arama}
          onChange={(e) => setArama(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 sm:w-80"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Ad Soyad</th>
              <th className="p-4">E-posta</th>
              <th className="p-4">Departman</th>
              <th className="p-4 text-right">İşlemler</th>
            </tr>
          </thead>

          <tbody>
            {filtrelenmis.map((p) => (
              <tr
                key={p.personelId}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="p-4">{p.personelId}</td>
                <td className="p-4 font-semibold">
                  {p.ad} {p.soyad}
                </td>
                <td className="p-4">{p.email}</td>
                <td className="p-4">
  {p.departmanId === null
    ? "Atanmamış"
    : departmanlar.find(
        (d) => d.departmanId === p.departmanId
      )?.departmanAdi ??
      (departmanYukleniyor
        ? "Yükleniyor..."
        : `Departman #${p.departmanId}`)}
</td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => duzenlemeyiAc(p)}
                      className="rounded-lg bg-blue-50 px-3 py-2 font-medium text-blue-700 hover:bg-blue-100"
                    >
                      Düzenle
                    </button>

                    <button
                      onClick={() => {
                        setHata("");
                        setSilinecek(p);
                      }}
                      className="rounded-lg bg-red-50 px-3 py-2 font-medium text-red-700 hover:bg-red-100"
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtrelenmis.length === 0 && (
          <p className="p-6 text-center text-slate-500">
            {arama
              ? "Aramanıza uygun personel bulunamadı."
              : "Kayıtlı personel bulunamadı."}
          </p>
        )}
      </div>

      <p className="text-sm text-slate-500">
        Gösterilen: {filtrelenmis.length} / {personeller.length} personel
      </p>

      {duzenlenen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-xl font-bold">
              Personel Düzenle
            </h2>

            <form onSubmit={guncelle} className="space-y-4">
              {(
                [
                  ["ad", "Ad", "text"],
                  ["soyad", "Soyad", "text"],
                  ["email", "E-posta", "email"],
                  ["maas", "Maaş", "number"],
                ] as const
              ).map(([name, label, type]) => (
                <label key={name} className="block text-sm font-medium">
                  {label}
                  <input
                    type={type}
                    required
                    min={type === "number" ? 0 : undefined}
                    step={type === "number" ? "0.01" : undefined}
                    value={form[name]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [name]: e.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-lg border border-slate-300 p-3"
                  />
                </label>
              ))}

              <label className="block text-sm font-medium">
                Departman
                <label className="block text-sm font-medium">
  Departman
  <select
    required
    value={form.departmanId}
    disabled={departmanYukleniyor || !!departmanHatasi}
    onChange={(e) =>
      setForm({
        ...form,
        departmanId: e.target.value,
      })
    }
    className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900"
  >
    <option value="">
      {departmanYukleniyor
        ? "Departmanlar yükleniyor..."
        : "Departman seçin"}
    </option>

    {departmanlar.map((departman) => (
      <option
        key={departman.departmanId}
        value={departman.departmanId}
      >
        {departman.departmanAdi}
      </option>
    ))}
  </select>
</label>

{departmanHatasi && (
  <p className="text-sm text-red-600">
    {departmanHatasi}
  </p>
)}
              </label>

              {hata && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {hata}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  disabled={yukleniyor}
                  onClick={() => setDuzenlenen(null)}
                  className="rounded-lg border px-5 py-3"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={yukleniyor}
                  className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
                >
                  {yukleniyor ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {silinecek && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold">Personeli Sil</h2>
            <p className="mt-3 text-sm text-slate-600">
              <strong>
                {silinecek.ad} {silinecek.soyad}
              </strong>{" "}
              adlı personeli silmek istediğinize emin misiniz?
            </p>

            {hata && (
              <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {hata}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                disabled={yukleniyor}
                onClick={() => setSilinecek(null)}
                className="rounded-lg border px-5 py-3"
              >
                Vazgeç
              </button>
              <button
                disabled={yukleniyor}
                onClick={sil}
                className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
              >
                {yukleniyor ? "Siliniyor..." : "Evet, Sil"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
