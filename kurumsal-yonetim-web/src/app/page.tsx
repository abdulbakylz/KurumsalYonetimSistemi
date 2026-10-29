
import Link from "next/link";

export const dynamic = "force-dynamic";

type Personel = {
  personelId: number;
};

type Departman = {
  departmanId: number;
};

type Urun = {
  urunId: number;
  urunAdi: string;
  stokAdedi: number;
  birimFiyat: number;
  kritikStok: boolean;
  stokDegeri: number;
};

type Teslim = {
  teslimId: number;
  personelAdi: string;
  urunAdi: string;
  adet: number;
  teslimTarihi: string | null;
};

const API = "http://localhost:5037/api";

const quickLinks = [
  { href: "/personeller", label: "Personeller", icon: "♙" },
  { href: "/departmanlar", label: "Departmanlar", icon: "▤" },
  { href: "/urunler", label: "Ürünler ve Stok", icon: "◈" },
  { href: "/teslimler", label: "Malzeme Teslimleri", icon: "⇄" },
];

async function veriGetir<T>(adres: string): Promise<T> {
  const response = await fetch(`${API}/${adres}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`${adres} API hatası: ${response.status}`);
  }

  return response.json();
}

function paraFormatla(tutar: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(tutar);
}

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

export default async function Home() {
  let personeller: Personel[] = [];
  let departmanlar: Departman[] = [];
  let urunler: Urun[] = [];
  let teslimler: Teslim[] = [];
  let hata = "";

  try {
    [personeller, departmanlar, urunler, teslimler] =
      await Promise.all([
        veriGetir<Personel[]>("personeller"),
        veriGetir<Departman[]>("departmanlar"),
        veriGetir<Urun[]>("urunler"),
        veriGetir<Teslim[]>("malzemeTeslimleri"),
      ]);
  } catch {
    hata =
      "Veriler alınamadı. Backend servisinin çalıştığından emin olun.";
  }

  const kritikUrunler = urunler.filter(
    (urun) => urun.stokAdedi <= 5
  );

  const toplamStok = urunler.reduce(
    (toplam, urun) => toplam + urun.stokAdedi,
    0
  );

  const toplamStokDegeri = urunler.reduce(
    (toplam, urun) =>
      toplam + urun.stokAdedi * urun.birimFiyat,
    0
  );

  const sonTeslimler = [...teslimler]
    .sort(
      (a, b) =>
        new Date(b.teslimTarihi ?? 0).getTime() -
        new Date(a.teslimTarihi ?? 0).getTime()
    )
    .slice(0, 5);

  const stats = [
    {
      title: "Toplam Personel",
      value: personeller.length,
      icon: "👥",
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Departmanlar",
      value: departmanlar.length,
      icon: "🏢",
      color: "bg-violet-50 text-violet-700",
    },
    {
      title: "Ürün Çeşidi",
      value: urunler.length,
      icon: "📦",
      color: "bg-amber-50 text-amber-700",
    },
    {
      title: "Toplam Teslim",
      value: teslimler.length,
      icon: "⇄",
      color: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-5 pb-10 pt-20 text-slate-900 md:px-9">
  <div className="mx-auto max-w-7xl"></div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Genel Bakış
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Kurumsal yönetim paneline hoş geldiniz.
          İşletmenizin güncel durumunu buradan takip edin.
        </p>
      </header>

      {hata && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {hata}
        </div>
      )}

      {!hata && (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-xl ${stat.color}`}
                >
                  {stat.icon}
                </div>

                <p className="text-sm text-slate-500">
                  {stat.title}
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Toplam Stok Adedi
              </p>
              <p className="mt-3 text-2xl font-bold">
                {toplamStok}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Toplam Stok Değeri
              </p>
              <p className="mt-3 text-2xl font-bold">
                {paraFormatla(toplamStokDegeri)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Kritik Stoktaki Ürün
              </p>
              <p
                className={`mt-3 text-2xl font-bold ${
                  kritikUrunler.length > 0
                    ? "text-red-600"
                    : "text-emerald-600"
                }`}
              >
                {kritikUrunler.length}
              </p>
            </div>
          </div>

          {kritikUrunler.length > 0 && (
            <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="font-bold text-amber-900">
                Kritik Stok Uyarısı
              </h2>
              <p className="mt-2 text-sm text-amber-800">
                {kritikUrunler.length} ürünün stok miktarı
                5 adet veya altında.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {kritikUrunler.map((urun) => (
                  <span
                    key={urun.urunId}
                    className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-amber-900"
                  >
                    {urun.urunAdi}: {urun.stokAdedi} adet
                  </span>
                ))}
              </div>

              <Link
                href="/urunler"
                className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline"
              >
                Stokları görüntüle
              </Link>
            </section>
          )}
        </>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">
            Hızlı İşlemler
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Yönetim modüllerine hızlı erişim
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-slate-200 p-4 text-sm font-medium transition hover:border-blue-400 hover:bg-blue-50"
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">
              Son Malzeme Teslimleri
            </h2>
            <Link
              href="/teslimler"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              Tümünü Gör
            </Link>
          </div>

          {hata ? (
            <p className="mt-6 text-sm text-slate-500">
              Teslim bilgileri yüklenemedi.
            </p>
          ) : sonTeslimler.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">
              Henüz teslim kaydı bulunmuyor.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {sonTeslimler.map((teslim) => (
                <div
                  key={teslim.teslimId}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-3"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {teslim.personelAdi}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {teslim.urunAdi} · {teslim.adet} adet
                    </p>
                  </div>
                  <span className="text-right text-xs text-slate-500">
                    {tarihFormatla(teslim.teslimTarihi)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold">
          Sistem Bilgileri
        </h2>

        <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          {[
            ["Frontend", "Next.js"],
            ["Backend", "ASP.NET Core"],
            ["Veritabanı", "SQL Server"],
            [
              "Veri Bağlantısı",
              hata ? "Bağlantı Hatası" : "Aktif",
            ],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between gap-3 border-b border-slate-100 pb-3"
            >
              <span className="text-slate-500">{label}</span>
              <span className="font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </section>
      
    </main>
  );
}
