
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = "http://localhost:5037/api/auth/me";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("kurumsal360_token")?.value;

  if (!token) {
    return NextResponse.json(
      { mesaj: "Oturum bulunamadı." },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          mesaj:
            response.status === 403
              ? "Yönetim paneline erişim yetkiniz yok."
              : "Oturum geçersiz veya süresi dolmuş.",
        },
        {
          status: response.status === 403 ? 403 : 401,
        }
      );
    }

    const kullanici = await response.json();

    return NextResponse.json(kullanici);
  } catch {
    return NextResponse.json(
      { mesaj: "Kimlik doğrulama servisine ulaşılamadı." },
      { status: 502 }
    );
  }
}
