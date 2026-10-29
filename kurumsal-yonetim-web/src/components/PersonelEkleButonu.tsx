
"use client";

import { useState } from "react";
import PersonelEkleForm from "./PersonelEkleForm";

export default function PersonelEkleButonu() {
  const [acik, setAcik] = useState(false);

  return (
    <>
      <button
        onClick={() => setAcik(true)}
        className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
      >
        + Yeni Personel Ekle
      </button>

      {acik && (
        <PersonelEkleForm onClose={() => setAcik(false)} />
      )}
    </>
  );
}
