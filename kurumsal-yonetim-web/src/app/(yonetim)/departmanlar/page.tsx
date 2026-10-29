
import { cookies } from "next/headers";
import DepartmanYonetimi from "../../../components/DepartmanYonetimi";

type Departman = {
  departmanId: number;
  departmanAdi: string;
  personelSayisi: number;
};

export const dynamic = "force-dynamic";

export default async function DepartmanlarPage() {
  let departmanlar: Departman[] = [];
  let hata = "";

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("kurumsal360_token")?.value;

    if (!token) {
      throw new Error("Oturum bulunamadı.");
    }

    const response = await fetch(
      "http://localhost:5037/api/departmanlar",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`API hatası: ${response.status}`);
    }

    departmanlar = await response.json();
  } catch {
    hata =
      "Departman bilgileri alınamadı. Oturumunuzu ve API bağlantısını kontrol edin.";
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 pt-20 text-slate-900 md:p-10">
      <div className="mx-auto max-w-6xl">
        {hata ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            {hata}
          </div>
        ) : (
          <DepartmanYonetimi departmanlar={departmanlar} />
        )}
      </div>
    </main>
  );
}
