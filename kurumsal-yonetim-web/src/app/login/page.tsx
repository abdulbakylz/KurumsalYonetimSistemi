
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);

  async function girisYap(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setHata("");
    setYukleniyor(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, sifre }),
      });

      if (!response.ok) {
        setHata("E-posta veya şifre hatalı.");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setHata("Sunucuya bağlanılamadı.");
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mb-3 text-3xl font-bold tracking-tight text-white">
            Kurumsal<span className="text-blue-500">360</span>
          </div>
          <p className="text-sm text-slate-400">
            Kurumsal Yönetim Sistemi
          </p>
        </div>

        <h1 className="mb-6 text-xl font-semibold text-white">
          Hesabınıza giriş yapın
        </h1>

        <form onSubmit={girisYap} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm text-slate-300"
            >
              E-posta adresi
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@firma.com"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="sifre"
              className="mb-2 block text-sm text-slate-300"
            >
              Şifre
            </label>
            <input
              id="sifre"
              type="password"
              required
              autoComplete="current-password"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              placeholder="Şifrenizi girin"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          {hata && (
            <p role="alert" className="text-sm text-red-400">
              {hata}
            </p>
          )}

          <button
            type="submit"
            disabled={yukleniyor}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
          >
            {yukleniyor ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-500">
          © 2026 Kurumsal360
        </p>
      </div>
    </main>
  );
}
