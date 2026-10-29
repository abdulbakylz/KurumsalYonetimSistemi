# Kurumsal360 — Kurumsal Yönetim ve Takip Sistemi

**Kurumsal360**, ASP.NET Core Web API, Next.js, TypeScript ve Microsoft SQL Server kullanılarak geliştirilen full-stack bir kurumsal yönetim uygulamasıdır.

İşletmelerin personel, departman, ürün, stok ve malzeme teslim süreçlerini tek bir yönetim panelinden takip edebilmesini amaçlar.

## Proje Hakkında

Kurumsal360, işletmelerin günlük operasyonlarını dijitalleştirmek amacıyla geliştirilmiştir.

Sistem üzerinden personel ve departman kayıtları yönetilebilir, ürün stokları takip edilebilir ve çalışanlara yapılan malzeme teslimleri kayıt altına alınabilir.

Uygulama, REST API mimarisiyle frontend ve backend katmanlarını birbirinden ayırır. Yönetim işlemleri rol tabanlı yetkilendirme ile korunur.

## Özellikler

### Kimlik Doğrulama ve Yetkilendirme
- Kullanıcı kayıt ve giriş sistemi
- JWT tabanlı kimlik doğrulama
- ASP.NET Core Identity PasswordHasher ile parola hashleme
- Admin ve Personel kullanıcı rolleri
- Admin yetkisi gerektiren yönetim API'leri
- HttpOnly cookie ile oturum yönetimi
- Oturum doğrulama ve çıkış işlemleri
- Yetkisiz kullanıcıların yönetim sayfalarına erişiminin engellenmesi

### Personel Yönetimi
- Personel listeleme, ekleme, güncelleme ve silme
- Personel arama
- Departman atama
- Departman bilgilerinin veritabanından dinamik olarak getirilmesi

### Departman Yönetimi
- Departman ekleme, düzenleme ve silme
- Departmanlara bağlı personel sayısını görüntüleme
- İlişkili personel bulunan departmanların silinmesini engelleme

### Ürün ve Stok Yönetimi
- Ürün ekleme, düzenleme ve silme
- Ürün adı ve kategoriye göre arama
- Stok miktarı ve birim fiyat takibi
- Toplam stok değerini hesaplama
- Kritik stok uyarıları

### Malzeme Teslim Yönetimi
- Personele ürün teslim etme
- Teslim işlemlerini veritabanına kaydetme
- Teslim sırasında stok miktarını otomatik azaltma
- Yetersiz stok durumunda teslimi engelleme
- Teslim geçmişini görüntüleme

### Yönetim Paneli
- Toplam personel ve departman sayıları
- Ürün ve teslim istatistikleri
- Toplam stok miktarı ve değeri
- Kritik stok bildirimleri
- Son malzeme teslimleri

## Kullanılan Teknolojiler

| Katman | Teknoloji |
|---|---|
| Frontend | Next.js 16, React, TypeScript |
| Tasarım | Tailwind CSS |
| Backend | ASP.NET Core Web API, C#, .NET 9 |
| ORM | Entity Framework Core |
| Veritabanı | Microsoft SQL Server |
| Kimlik doğrulama | JWT Bearer Authentication |
| Parola güvenliği | ASP.NET Core Identity PasswordHasher |
| Versiyon kontrol | Git, GitHub |

## Proje Yapısı

```text
KurumsalYonetimSistemi/
├── KurumsalYonetim.API/
│   ├── Controllers/
│   ├── Data/
│   ├── Dtos/
│   ├── Models/
│   ├── Services/
│   └── Program.cs
│
├── kurumsal-yonetim-web/
│   ├── public