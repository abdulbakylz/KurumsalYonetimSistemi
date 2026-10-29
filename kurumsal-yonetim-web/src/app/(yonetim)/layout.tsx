
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function YonetimLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("kurumsal360_token")?.value;

  if (!token) {
    redirect("/login");
  }

  let response: Response;

  try {
    response = await fetch("http://localhost:5037/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "Kimlik doğrulama servisine ulaşılamadı. Backend bağlantısını kontrol edin."
    );
  }

  if (response.status === 401) {
    redirect("/login");
  }

  if (response.status === 403) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error("Oturum doğrulanamadı.");
  }

  return <>{children}</>;
}
