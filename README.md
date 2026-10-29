# Kurumsal360 — Kurumsal Yönetim ve Takip Sistemi

ASP.NET Core Web API, Next.js ve SQL Server teknolojileri kullanılarak geliştirilmiş, personel, departman, ürün, stok ve malzeme teslim süreçlerini tek panel üzerinden yönetmeyi amaçlayan full-stack web uygulaması.

## Proje Hakkında

Kurumsal360, işletmelerin günlük operasyonlarını dijital ortamda takip edebilmesi amacıyla geliştirilmiştir.

Sistem sayesinde personel ve departman kayıtları yönetilebilir, ürün stokları takip edilebilir ve personele yapılan malzeme teslimleri kayıt altına alınabilir.

Yönetim paneli, veritabanından alınan güncel bilgileri kullanıcıya sunar.

## Özellikler

### Personel Yönetimi
- Personel listeleme, ekleme, güncelleme ve silme
- Personel arama
- Departman atama
- Departmanların veritabanından dinamik olarak getirilmesi

### Departman Yönetimi
- Departman ekleme, düzenleme ve silme
- Departmanlara bağlı personel sayısını görüntüleme
- İlişkili personel bulunan departmanların silinmesini engelleme

### Ürün ve Stok Yönetimi
- Ürün ekleme, düzenleme ve silme
- Ürün adı ve kategoriye göre arama
- Stok miktarı ve birim fiyat takibi
- Toplam stok değeri hesaplama
- Kritik stok uyarıları

### Malzeme Teslim Yönetimi
- Personele ürün teslim etme
- Teslim işlemlerini veritabanına kaydetme
- Teslim sırasında stok miktarını otomatik azaltma
- Yetersiz stok durumunda teslimi engelleme
- Teslim geçmişini görüntüleme

### Yönetim Paneli
- Toplam personel sayısı
- Toplam departman sayısı
- Ürün ve teslim istatistikleri
- Toplam stok miktarı ve değeri
- Kritik stok bildirimleri
- Son malzeme teslimleri

## Kullanılan Teknolojiler

| Katman | Teknoloji |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Tasarım | Tailwind CSS |
| Backend | ASP.NET Core Web API (.NET 9) |
| ORM | Entity Framework Core |
| Veritabanı | Microsoft SQL Server |
| Versiyon Kontrol | Git ve GitHub |

## Proje Yapısı

```text
KurumsalYonetimSistemi/
│
├── KurumsalYonetim.API/
│   ├── Controllers/
│   ├── Data/
│   ├── Dtos/
│   ├── Models/
│   └── Program.cs
│
├── kurumsal-yonetim-web/
│   ├── public/
│   └── src/
│       ├── app/
│       │   ├── api/
│       │   ├── personeller/
│       │   ├── departmanlar/
│       │   ├── urunler/
│       │   └── teslimler/
│       └── components/
│
└── README.md
```

## Yerel Ortamda Çalıştırma

### Gereksinimler

- .NET 9 SDK
- Node.js ve npm
- Microsoft SQL Server
- SQL Server ile uyumlu bir veritabanı yönetim aracı

### Backend

```bash
cd KurumsalYonetim.API
dotnet restore
dotnet run
```

Backend geliştirme ortamında `http://localhost:5037` adresinde çalışacak şekilde yapılandırılabilir.

### Frontend

```bash
cd kurumsal-yonetim-web
npm install
npm run dev
```

Frontend varsayılan olarak `http://localhost:3000` adresinde çalışır.

### Veritabanı

Uygulama `KurumsalYonetimDB` adlı SQL Server veritabanını kullanır.

Backend için `appsettings.json` dosyasında yerel SQL Server bağlantı ayarları tanımlanmalıdır.

**Not:** Veritabanı oluşturma betikleri henüz depoya eklenmemiştir. Bu nedenle uygulamanın sıfırdan kurulumu için veritabanı şemasının ayrıca hazırlanması gerekmektedir.

## API Endpointleri

| Metot | Endpoint | Açıklama |
|---|---|---|
| GET | `/api/personeller` | Personelleri listele |
| POST | `/api/personeller` | Personel ekle |
| PUT | `/api/personeller/{id}` | Personel güncelle |
| DELETE | `/api/personeller/{id}` | Personel sil |
| GET | `/api/departmanlar` | Departmanları listele |
| POST | `/api/departmanlar` | Departman ekle |
| PUT | `/api/departmanlar/{id}` | Departman güncelle |
| DELETE | `/api/departmanlar/{id}` | Departman sil |
| GET | `/api/urunler` | Ürünleri listele |
| POST | `/api/urunler` | Ürün ekle |
| PUT | `/api/urunler/{id}` | Ürün güncelle |
| DELETE | `/api/urunler/{id}` | Ürün sil |
| GET | `/api/malzemeTeslimleri` | Teslim kayıtlarını listele |
| POST | `/api/malzemeTeslimleri` | Yeni teslim oluştur |

## Planlanan Geliştirmeler

- Kullanıcı girişi ve kimlik doğrulama
- Rol tabanlı yetkilendirme
- Veritabanı kurulum betikleri
- Raporlama ve dışa aktarma özellikleri
- Otomatik testler
- Canlı ortama dağıtım

## Proje Durumu

**Aktif geliştirme aşamasında.**

Temel yönetim modülleri yerel geliştirme ortamında çalışmaktadır. Kullanıcı yetkilendirmesi ve canlı ortam güvenlik yapılandırması henüz tamamlanmamıştır.

## Geliştirici

**Abdül Baki Yıldız**

Bilgisayar Programcılığı mezunu, Bilişim Sistemleri ve Teknolojileri öğrencisi.

GitHub: https://github.com/abdulbakylz

---

Bu proje, full-stack web geliştirme, REST API tasarımı, ilişkisel veritabanı yönetimi ve kurumsal iş süreçlerinin dijitalleştirilmesi alanlarında uygulamalı deneyim kazanmak amacıyla geliştirilmiştir.
