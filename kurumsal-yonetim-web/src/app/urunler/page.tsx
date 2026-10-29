
import UrunYonetimi from "../../components/UrunYonetimi";

type Urun = {
  urunId: number;
  urunAdi: string;
  kategori: string;
  stokAdedi: number;
  birimFiyat: number;
  kritikStok: boolean;
  stokDegeri: number;
};

export const dynamic = "force-dynamic";

export default async function UrunlerPage() {
  let urunler: Urun[] = [];
  let hata = "";

  try {
    const response = await fetch(
      "http://localhost:5037/api/urunler",
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`API hatası: ${response.status}`);
    }

    urunler = await response.json();
  } catch {
    hata = "Ürün bilgileri alınamadı. Backend bağlantısını kontrol edin.";
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 pt-20 text-slate-900 md:p-10">
      <div className="mx-auto max-w-7xl">
        {hata ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            {hata}
          </div>
        ) : (
          <UrunYonetimi urunler={urunler} />
        )}
      </div>
    </main>
  );
}
