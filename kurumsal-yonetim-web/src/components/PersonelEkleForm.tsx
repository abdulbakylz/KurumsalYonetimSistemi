
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  onClose: () => void;
};

type Departman = {
  departmanId: number;
  departmanAdi: string;
};

export default function PersonelEkleForm({ onClose }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [hata, setHata] = useState("");
  const [departmanlar, setDepartmanlar] = useState<Departman[]>([]);
  const [departmanYukleniyor, setDepartmanYukleniyor] = useState(true);

  const [form, setForm] = useState({
    ad: "",
    soyad: "",
    email: "",
    maas: "",
    departmanId: "",
  });

  useEffect(() => {
    async function departmanlariGetir() {
      try {
        const response = await fetch("/api/departmanlar", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Departmanlar alınamadı.");
        }

        const data: Departman[] = await response.json();
        setDepartmanlar(data);
      } catch {
        setHata("Departmanlar yüklenemedi.");
      } finally {
        setDepartmanYukleniyor(false);
      }
    }

    departmanlariGetir();
  }, []);

  async function kaydet(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setHata("");

    if (!form.departmanId) {
      setHata("Lütfen bir departman seçin.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/personeller", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ad: form.ad.trim(),
          soyad: form.soyad.trim(),
          email: form.email.trim(),
          maas: Number(form.maas),
          departmanId: Number(form.departmanId),
        }),
      });

      if (!response.ok) {
        const mesaj = await response.text();
        throw new Error(mesaj || "Personel eklenemedi.");
      }

      onClose();
      router.refresh();
    } catch (error) {
      setHata(
        error instanceof Error ? error.message : "Bir hata oluştu."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 text-slate-900 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Yeni Personel Ekle</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="text-slate-500 hover:text-slate-900"
          >
            ✕
          </button>
        </div>

        <form onSubmit={kaydet} className="space-y-4">
          {[
            { name: "ad", label: "Ad", type: "text" },
            { name: "soyad", label: "Soyad", type: "text" },
            { name: "email", label: "E-posta", type: "email" },
            { name: "maas", label: "Maaş", type: "number" },
          ].map((alan) => (
            <label key={alan.name} className="block text-sm font-medium">
              {alan.label}
              <input
                type={alan.type}
                required
                min={alan.name === "maas" ? 0 : undefined}
                step={alan.name === "maas" ? "0.01" : undefined}
                value={form[alan.name as keyof typeof form]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [alan.name]: e.target.value,
                  })
                }
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-blue-500"
              />
            </label>
          ))}

          <label className="block text-sm font-medium">
            Departman
            <select
              required
              value={form.departmanId}
              disabled={departmanYukleniyor}
              onChange={(e) =>
                setForm({
                  ...form,
                  departmanId: e.target.value,
                })
              }
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900"
            >
              <option value="">
                {departmanYukleniyor
                  ? "Departmanlar yükleniyor..."
                  : "Departman seçin"}
              </option>

              {departmanlar.map((departman) => (
                <option
                  key={departman.departmanId}
                  value={departman.departmanId}
                >
                  {departman.departmanAdi}
                </option>
              ))}
            </select>
          </label>

          {!departmanYukleniyor && departmanlar.length === 0 && (
            <p className="text-sm text-amber-700">
              Kullanılabilir departman bulunamadı.
              Önce departman ekleyin.
            </p>
          )}

          {hata && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {hata}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-slate-300 px-5 py-3"
            >
              İptal
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                departmanYukleniyor ||
                departmanlar.length === 0
              }
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Kaydediliyor..." : "Personeli Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
