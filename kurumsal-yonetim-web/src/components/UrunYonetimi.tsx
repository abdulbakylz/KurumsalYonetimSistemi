
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Urun = {
  urunId: number;
  urunAdi: string;
  kategori: string;
  stokAdedi: number;
  birimFiyat: number;
  kritikStok: boolean;
  stokDegeri: number;
};

export default function UrunYonetimi({ urunler }: { urunler: Urun[] }) {
  const router = useRouter();
  const [arama, setArama] = useState("");
  const [formAcik, setFormAcik] = useState(false);
  const [duzenlenen, setDuzenlenen] = useState<Urun | null>(null);
  const [silinecek, setSilinecek] = useState<Urun | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");
  const [form, setForm] = useState({
    urunAdi: "",
    kategori: "",
    stokAdedi: "0",
    birimFiyat: "0",
  });

  const para = (tutar: number) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(tutar);

  const filtrelenmis = useMemo(() => {
    const kelime = arama.toLocaleLowerCase("tr-TR").trim();
    return urunler.filter((u) =>
      `${u.urunAdi} ${u.kategori}`
        .toLocaleLowerCase("tr-TR")
        .includes(kelime)
    );
  }, [arama, urunler]);

  const kritikSayisi = urunler.filter((u) => u.kritikStok).length;
  const toplamStok = urunler.reduce((toplam, u) => toplam + u.stokAdedi, 0);
  const toplamDeger = urunler.reduce(
    (toplam, u) => toplam + u.stokDegeri,
    0
  );

  function formuAc(urun?: Urun) {
    setDuzenlenen(urun ?? null);
    setHata("");
    setForm({
      urunAdi: urun?.urunAdi ?? "",
      kategori: urun?.kategori ?? "",
      stokAdedi: String(urun?.stokAdedi ?? 0),
      birimFiyat: String(urun?.birimFiyat ?? 0),
    });
    setFormAcik(true);
  }

  async function kaydet(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setHata("");
    setYukleniyor(true);

    try {
      const response = await fetch(
        duzenlenen ? `/api/urunler/${duzenlenen.urunId}` : "/api/urunler",
        {
          method: duzenlenen ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            urunAdi: form.urunAdi.trim(),
            kategori: form.kategori.trim(),
            stokAdedi: Number(form.stokAdedi),
            birimFiyat: Number(form.birimFiyat),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setFormAcik(false);
      router.refresh();
    } catch (error) {
      setHata(error instanceof Error ? error.message : "Kaydetme başarısız.");
    } finally {
      setYukleniyor(false);
    }
  }

  async function sil() {
    if (!silinecek) return;
    setHata("");
    setYukleniyor(true);

    try {
      const response = await fetch(`/api/urunler/${silinecek.urunId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setSilinecek(null);
      router.refresh();
    } catch (error) {
      setHata(error instanceof Error ? error.message : "Silme başarısız.");
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ürünler ve Stok</h1>
          <p className="mt-2 text-sm text-slate-500">
            Ürünleri, stok miktarlarını ve envanter değerini yönetin.
          </p>
        </div>
        <button
          onClick={() => formuAc()}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          + Yeni Ürün Ekle
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Ürün Çeşidi", urunler.length],
          ["Toplam Stok", toplamStok],
          ["Kritik Stok", kritikSayisi],
          ["Toplam Stok Değeri", para(toplamDeger)],
        ].map(([baslik, deger]) => (
          <div
            key={baslik}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{baslik}</p>
            <p className="mt-3 text-2xl font-bold">{deger}</p>
          </div>
        ))}
      </div>

      {kritikSayisi > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Stok Uyarısı:</strong> {kritikSayisi} ürünün stok miktarı
          5 adet veya altında.
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold">Ürün Listesi</h2>
          <input
            type="search"
            placeholder="Ürün veya kategori ara..."
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="p-4">Ürün</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Stok</th>
                <th className="p-4">Birim Fiyat</th>
                <th className="p-4">Stok Değeri</th>
                <th className="p-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filtrelenmis.map((u) => (
                <tr key={u.urunId} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="p-4 font-semibold">{u.urunAdi}</td>
                  <td className="p-4">{u.kategori}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        u.kritikStok
                          ? "bg-red-50 text-red-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {u.stokAdedi} adet
                    </span>
                  </td>
                  <td className="p-4">{para(u.birimFiyat)}</td>
                  <td className="p-4">{para(u.stokDegeri)}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => formuAc(u)}
                        className="rounded-lg bg-blue-50 px-3 py-2 font-medium text-blue-700 hover:bg-blue-100"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => {
                          setHata("");
                          setSilinecek(u);
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
            <p className="p-8 text-center text-slate-500">
              Ürün bulunamadı.
            </p>
          )}
        </div>
      </div>

      {formAcik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-xl font-bold">
              {duzenlenen ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
            </h2>

            <form onSubmit={kaydet} className="space-y-4">
              {(
                [
                  ["urunAdi", "Ürün Adı", "text"],
                  ["kategori", "Kategori", "text"],
                  ["stokAdedi", "Stok Adedi", "number"],
                  ["birimFiyat", "Birim Fiyat (₺)", "number"],
                ] as const
              ).map(([alan, baslik, tur]) => (
                <label key={alan} className="block text-sm font-medium">
                  {baslik}
                  <input
                    type={tur}
                    required
                    min={tur === "number" ? 0 : undefined}
                    step={alan === "birimFiyat" ? "0.01" : undefined}
                    value={form[alan]}
                    onChange={(e) =>
                      setForm({ ...form, [alan]: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
                  />
                </label>
              ))}

              {hata && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {hata}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  disabled={yukleniyor}
                  onClick={() => setFormAcik(false)}
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
            <h2 className="text-xl font-bold">Ürünü Sil</h2>
            <p className="mt-3 text-sm text-slate-600">
              <strong>{silinecek.urunAdi}</strong> ürününü silmek istediğinize
              emin misiniz?
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
