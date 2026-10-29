
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CikisButonu() {
  const router = useRouter();
  const [yukleniyor, setYukleniyor] = useState(false);

  async function cikisYap() {
    setYukleniyor(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Çıkış işlemi başarısız.");
      }

      router.replace("/login");
      router.refresh();
    } catch {
      alert("Çıkış yapılamadı. Tekrar deneyin.");
      setYukleniyor(false);
    }
  }

  return (
    <button
      type="button"
      onClick={cikisYap}
      disabled={yukleniyor}
      className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
    >
      {yukleniyor ? "Çıkış yapılıyor..." : "Çıkış Yap"}
    </button>
  );
}
