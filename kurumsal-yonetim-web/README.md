# Kurumsal360 — Web Arayüzü

Kurumsal360 Kurumsal Yönetim Sistemi'nin Next.js ve TypeScript ile geliştirilmiş web arayüzüdür.

Bu uygulama, ASP.NET Core Web API ile haberleşerek kurumsal yönetim işlemlerini kullanıcı dostu bir panel üzerinden gerçekleştirmeyi sağlar.

## Özellikler

- Yönetim paneli ve temel işletme istatistikleri
- Personel yönetimi
- Departman yönetimi
- Ürün ve stok takibi
- Malzeme teslim kayıtları
- Kullanıcı giriş ve çıkış işlemleri
- JWT tabanlı oturum doğrulama
- Admin yetkisi gerektiren korumalı yönetim sayfaları
- Responsive arayüz

## Teknolojiler

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Next.js App Router

## Kurulum

Gereksinimler: Node.js ve npm.

```bash
npm install
npm run dev
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışır.

Frontend'in yönetim verilerini gösterebilmesi için Kurumsal360 backend API'sinin ve SQL Server veritabanının da yapılandırılmış ve çalışır durumda olması gerekir.

## Proje Yapısı

```text
src/
├── app/
│   ├── (yonetim)/
│   │   ├── personeller/
│   │   ├── departmanlar/
│   │   ├── urunler/
│   │   └── teslimler/
│   ├── api/
│   │   └── auth/
│   ├── login/
│   └── page.tsx
└── components/
```

## Güvenlik

Oturum bilgileri HttpOnly cookie üzerinden yönetilir. Yönetim sayfaları ve ilgili backend API uçları yetkilendirme kontrolleriyle korunur.

Bu proje geliştirme ve portföy amaçlıdır; üretim ortamına alınmadan önce ek güvenlik kontrolleri gereklidir.

## Ana Proje

Backend, veritabanı ve tüm sistemin açıklaması için:

https://github.com/abdulbakylz/KurumsalYonetimSistemi

## Geliştirici

**Abdül Baki Yıldız**

GitHub: https://github.com/abdulbakylz