
import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/Sidebar";

export const metadata: Metadata = {
  title: "Kurumsal360 | Yönetim Paneli",
  description: "Kurumsal Stok ve Personel Yönetim Sistemi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="bg-slate-50 text-slate-900">  
        <Sidebar />
        <div className="min-h-screen md:ml-64">
          {children}
        </div>
      </body>
    </html>
  );
}
