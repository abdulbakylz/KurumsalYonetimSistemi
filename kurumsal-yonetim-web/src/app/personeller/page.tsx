
import PersonelEkleButonu from "../../components/PersonelEkleButonu";
import PersonelTablosu from "../../components/PersonelTablosu";

type Personel = {
  personelId: number;
  ad: string;
  soyad: string;
  email: string;
  departmanId: number | null;
};

export const dynamic = "force-dynamic";

export default async function PersonellerPage() {
  let personeller: Personel[] = [];
  let hata = "";

  try {
    const response = await fetch(
      "http://localhost:5037/api/personeller",
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`API hatası: ${response.status}`);
    }

    personeller = await response.json();
  } catch {
    hata =
      "Personel bilgileri alınamadı. API bağlantısını kontrol edin.";
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 pt-20 text-slate-900 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Personel Yönetimi
            </h1>
            <p className="mt-2 text-slate-500">
              SQL Server veritabanındaki kayıtlı personeller
            </p>
          </div>

          <PersonelEkleButonu />
        </div>

        {hata ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            {hata}
          </div>
        ) : (
          <PersonelTablosu personeller={personeller} />
        )}
      </div>
    </main>
  );
}
