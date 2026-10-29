
import TeslimYonetimi from "../../components/TeslimYonetimi";

export const dynamic = "force-dynamic";

export default async function TeslimlerPage() {
  try {
    const [teslimResponse, personelResponse, urunResponse] =
      await Promise.all([
        fetch("http://localhost:5037/api/malzemeTeslimleri", {
          cache: "no-store",
        }),
        fetch("http://localhost:5037/api/personeller", {
          cache: "no-store",
        }),
        fetch("http://localhost:5037/api/urunler", {
          cache: "no-store",
        }),
      ]);

    if (!teslimResponse.ok || !personelResponse.ok || !urunResponse.ok) {
      throw new Error("API yanıtı başarısız.");
    }

    const [teslimler, personeller, urunler] = await Promise.all([
      teslimResponse.json(),
      personelResponse.json(),
      urunResponse.json(),
    ]);

    return (
      <main className="min-h-screen bg-slate-50 p-6 pt-20 text-slate-900 md:p-10">
        <div className="mx-auto max-w-7xl">
          <TeslimYonetimi
            teslimler={teslimler}
            personeller={personeller}
            urunler={urunler}
          />
        </div>
      </main>
    );
  } catch {
    return (
      <main className="p-10 text-red-600">
        Teslim bilgileri alınamadı. Backend bağlantısını kontrol edin.
      </main>
    );
  }
}
