
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Teslim = {
  teslimId: number;
  personelId: number | null;
  personelAdi: string;
  urunId: number | null;
  urunAdi: string;
  adet: number;
  teslimTarihi: string | null;
};

type Personel = {
  personelId: number;
  ad: string;
  soyad: string;
};

type Urun = {
  urunId: number;
  urunAdi: string;
  stokAdedi: number;
};

export default function TeslimYonetimi({
  teslimler,
  personeller,
  urunler,
}: {
  teslimler: Teslim[];
  personeller: Personel[];
  urunler: Urun[];
}) {
  const router = useRouter();

  const [arama, setArama] = useState("");
  const [formAcik, setFormAcik] = useState(false);
  const [personelId, setPersonelId] = useState("");
  const [urunId, setUrunId] = useState("");
  const [adet, setAdet] = useState("1");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");
  const [mesaj, setMesaj] = useState("");

  const seciliUrun = urunler.find(
    (urun) => urun.urunId === Number(urunId)
  );

  const filtrelenmis = useMemo(() => {
    const kelime = arama.toLocaleLowerCase("tr-TR").trim();

    return teslimler.filter((teslim) =>
      `${teslim.personelAdi} ${teslim.urunAdi}`
        .toLocaleLowerCase("tr-TR")
        .includes(kelime)
    );
  }, [arama, teslimler]);

  const toplamTeslim = teslimler.length;
  const toplamAdet = teslimler.reduce(
    (toplam, teslim) => toplam + teslim.adet,
    0
  );

  function tarihFormatla(tarih: string | null) {
    if (!tarih) return "—";

    const date = new Date(tarih);
    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function teslimKaydet(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setHata("");
    setMesaj("");

    const miktar = Number(adet);

    if (!personelId || !urunId) {
      setHata("Personel ve ürün seçmelisiniz.");
      return;
    }

    if (!Number.isInteger(miktar) || miktar <= 0) {
      setHata("Geçerli bir teslim adedi girin.");
      return;
    }

    if (!seciliUrun || miktar > seciliUrun.stokAdedi) {
      setHata("Yetersiz stok. Teslim miktarını kontrol edin.");
      return;
    }

    setYukleniyor(true);

    try {
      const response = await fetch("/api/teslimler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personelId: Number(personelId),
          urunId: Number(urunId),
          adet: miktar,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Teslim kaydedilemedi.");
      }

      setFormAcik(false);
      setPersonelId("");
      setUrunId("");
      setAdet("1");
      setMesaj("Malzeme teslimi başarıyla kaydedildi.");
      router.refresh();
    } catch (error) {
      setHata(
        error instanceof Error
          ? error.message
          : "Teslim işlemi başarısız."
      );
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Malzeme Teslim Yönetimi</h1>
          <p className="mt-2 text-sm text-slate-500">
            Personellere yapılan malzeme teslimlerini takip edin.
          </p>
        </div>

        <button
          onClick={() => {
            setHata("");
            setMesaj("");
            setFormAcik(true);
          }}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          + Yeni Teslim
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Toplam Teslim Kaydı", toplamTeslim],
          ["Teslim Edilen Ürün Adedi", toplamAdet],
          ["Stokta Bulunan Ürün Çeşidi", urunler.length],
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

      {mesaj && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
          {mesaj}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold">Teslim Geçmişi</h2>

          <input
            type="search"
            placeholder="Personel veya ürün ara..."
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="p-4">Teslim No</th>
                <th className="p-4">Personel</th>
                <th className="p-4">Ürün</th>
                <th className="p-4">Adet</th>
                <th className="p-4">Teslim Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {filtrelenmis.map((teslim) => (
                <tr
                  key={teslim.teslimId}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="p-4 font-semibold">
                    #{teslim.teslimId}
                  </td>
                  <td className="p-4">{teslim.personelAdi}</td>
                  <td className="p-4">{teslim.urunAdi}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">
                      {teslim.adet} adet
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">
                    {tarihFormatla(teslim.teslimTarihi)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtrelenmis.length === 0 && (
            <p className="p-8 text-center text-slate-500">
              Teslim kaydı bulunamadı.
            </p>
          )}
        </div>
      </div>

      {formAcik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold">Yeni Malzeme Teslimi</h2>
            <p className="mt-2 text-sm text-slate-500">
              Teslim kaydedildiğinde stok otomatik azalır.
            </p>

            <form onSubmit={teslimKaydet} className="mt-6 space-y-4">
              <label className="block text-sm font-medium">
                Personel
                <select
                  required
                  value={personelId}
                  onChange={(e) => setPersonelId(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 p-3"
                >
                  <option value="">Personel seçin</option>
                  {personeller.map((personel) => (
                    <option
                      key={personel.personelId}
                      value={personel.personelId}
                    >
                      {personel.ad} {personel.soyad}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium">
                Ürün
                <select
                  required
                  value={urunId}
                  onChange={(e) => setUrunId(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 p-3"
                >
                  <option value="">Ürün seçin</option>
                  {urunler.map((urun) => (
                    <option
                      key={urun.urunId}
                      value={urun.urunId}
                      disabled={urun.stokAdedi === 0}
                    >
                      {urun.urunAdi} — Stok: {urun.stokAdedi}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium">
                Teslim Adedi
                <input
                  type="number"
                  required
                  min={1}
                  max={seciliUrun?.stokAdedi}
                  step={1}
                  value={adet}
                  onChange={(e) => setAdet(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 p-3"
                />
              </label>

              {seciliUrun && (
                <p className="rounded-lg bg-slate-100 p-3 text-sm">
                  Mevcut stok: <strong>{seciliUrun.stokAdedi}</strong>
                  {" | "}
                  Teslim sonrası:{" "}
                  <strong>
                    {seciliUrun.stokAdedi - (Number(adet) || 0)}
                  </strong>
                </p>
              )}

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
                  {yukleniyor ? "Kaydediliyor..." : "Teslimi Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
