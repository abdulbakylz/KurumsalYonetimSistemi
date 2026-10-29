
import { cookies } from "next/headers";
import TeslimYonetimi from "../../../components/TeslimYonetimi";

export const dynamic = "force-dynamic";

export default async function TeslimlerPage() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("kurumsal360_token")?.value;

    if (!token) {
      throw new Error("Oturum bulunamadı.");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const [teslimResponse, personelResponse, urunResponse] =
      await Promise.all([
        fetch("http://localhost:5037/api/malzemeTeslimleri", {
          headers,
          cache: "no-store",
        }),
        fetch("http://localhost:5037/api/personeller", {
          headers,
          cache: "no-store",
        }),
        fetch("http://localhost:5037/api/urunler", {
          headers,
          cache: "no-store",
        }),
      ]);

    if (
      !teslimResponse.ok ||
      !personelResponse.ok ||
      !urunResponse.ok
    ) {
      throw new Error(
        `API hatası: Teslim ${teslimResponse.status}, ` +
        `Personel ${personelResponse.status}, ` +
        `Ürün ${urunResponse.status}`
      );
    }

    const [teslimler, personeller, urunler] =
      await Promise.all([
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
  } catch (error) {
    console.error("Teslimler sayfası hatası:", error);

    return (
      <main className="p-10 text-red-600">
        Teslim bilgileri alınamadı. Oturumunuzu ve API
        bağlantısını kontrol edin.
      </main>
    );
  }
}
