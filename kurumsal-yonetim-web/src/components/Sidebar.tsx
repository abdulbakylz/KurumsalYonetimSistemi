
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menu = [
  { href: "/", label: "Genel Bakış", icon: "▦" },
  { href: "/personeller", label: "Personeller", icon: "♙" },
  { href: "/departmanlar", label: "Departmanlar", icon: "▤" },
  { href: "/urunler", label: "Ürünler ve Stok", icon: "◈" },
  { href: "/teslimler", label: "Malzeme Teslimleri", icon: "⇄" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-30 rounded-lg bg-slate-950 px-3 py-2 text-white md:hidden"
        aria-label="Menüyü aç"
      >
        ☰
      </button>

      {open && (
        <button
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Menüyü kapat"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-800 bg-slate-950 text-white transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-slate-800 px-6 py-7">
          <div className="text-xl font-bold">
            KURUMSAL<span className="text-blue-400">360</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Yönetim ve Takip Sistemi
          </p>
        </div>

        <nav className="space-y-1 p-4">
          <p className="px-3 pb-3 pt-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Yönetim Menüsü
          </p>

          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                pathname === item.href
                  ? "bg-blue-600 font-semibold text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="w-6 text-center text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-slate-800 p-5">
          <p className="text-sm font-semibold">Yönetici Paneli</p>
          <p className="text-xs text-slate-400">
            Kurumsal Yönetim Sistemi
          </p>
        </div>
      </aside>
    </>
  );
}
