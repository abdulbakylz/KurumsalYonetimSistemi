
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Departman = {
  departmanId: number;
  departmanAdi: string;
  personelSayisi: number;
};

export default function DepartmanYonetimi({
  departmanlar,
}: {
  departmanlar: Departman[];
}) {
  const router = useRouter();
  const [arama, setArama] = useState("");
  const [acik, setAcik] = useState(false);
  const [duzenlenen, setDuzenlenen] = useState<Departman | null>(null);
  const [silinecek, setSilinecek] = useState<Departman | null>(null);
  const [ad, setAd] = useState("");
  const [hata, setHata] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);

  const filtrelenmis = departmanlar.filter((d) =>
    d.departmanAdi
      .toLocaleLowerCase("tr-TR")
      .includes(arama.toLocaleLowerCase("tr-TR").trim())
  );

  function formAc(departman?: Departman) {
    setDuzenlenen(departman ?? null);
    setAd(departman?.departmanAdi ?? "");
    setHata("");
    setAcik(true);
  }

  async function kaydet(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ad.trim()) return;

    setYukleniyor(true);
    setHata("");

    try {
      const url = duzenlenen
        ? `/api/departmanlar/${duzenlenen.departmanId}`
        : "/api/departmanlar";

      const response = await fetch(url, {
        method: duzenlenen ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ departmanAdi: ad.trim() }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setAcik(false);
      router.refresh();
    } catch (error) {
      setHata(
        error instanceof Error ? error.message : "İşlem başarısız."
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
        `/api/departmanlar/${silinecek.departmanId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const mesaj = await response.text();
        throw new Error(mesaj || "Departman silinemedi.");
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Departman Yönetimi</h1>
          <p className="mt-2 text-sm text-slate-500">
            Departmanları ve personel dağılımını yönetin.
          </p>
        </div>
        <button
          onClick={() => formAc()}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          + Yeni Departman
        </button>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Toplam Departman</p>
          <p className="text-3xl font-bold">{departmanlar.length}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Toplam Personel</p>
          <p className="text-3xl font-bold">
            {departmanlar.reduce((toplam, d) => toplam + d.personelSayisi, 0)}
          </p>
        </div>
        <input
          type="search"
          placeholder="Departman ara..."
          value={arama}
          onChange={(e) => setArama(e.target.value)}
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtrelenmis.map((departman) => (
          <div
            key={departman.departmanId}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-5 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                🏢
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                ID: {departman.departmanId}
              </span>
            </div>

            <h2 className="text-xl font-bold">{departman.departmanAdi}</h2>
            <p className="mt-2 text-sm text-slate-500">
              {departman.personelSayisi} kayıtlı personel
            </p>

            <div className="mt-6 flex gap-3 border-t border-slate-100 pt-5">
              <button
                onClick={() => formAc(departman)}
                className="flex-1 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
              >
                Düzenle
              </button>
              <button
                onClick={() => {
                  setHata("");
                  setSilinecek(departman);
                }}
                className="flex-1 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtrelenmis.length === 0 && (
        <p className="rounded-xl bg-white p-8 text-center text-slate-500">
          Departman bulunamadı.
        </p>
      )}

      {acik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-xl font-bold">
              {duzenlenen ? "Departman Düzenle" : "Yeni Departman"}
            </h2>

            <form onSubmit={kaydet} className="space-y-5">
              <label className="block text-sm font-medium">
                Departman Adı
                <input
                  autoFocus
                  required
                  maxLength={100}
                  value={ad}
                  onChange={(e) => setAd(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
                  placeholder="Örneğin: Pazarlama"
                />
              </label>

              {hata && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {hata}
                </p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  disabled={yukleniyor}
                  onClick={() => setAcik(false)}
                  className="rounded-lg border px-5 py-3"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={yukleniyor}
                  className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
                >
                  {yukleniyor ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {silinecek && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold">Departmanı Sil</h2>
            <p className="mt-3 text-sm text-slate-600">
              <strong>{silinecek.departmanAdi}</strong> departmanını silmek
              istediğinize emin misiniz?
            </p>

            {silinecek.personelSayisi > 0 && (
              <p className="mt-3 text-sm text-amber-700">
                Bu departmanda personel bulunuyor. Silme işlemi engellenecektir.
              </p>
            )}

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
                disabled={yukleniyor || silinecek.personelSayisi > 0}
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
