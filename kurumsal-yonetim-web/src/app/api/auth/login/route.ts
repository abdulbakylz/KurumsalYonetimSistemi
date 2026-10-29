
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, sifre } = await request.json();

    if (
      typeof email !== "string" ||
      typeof sifre !== "string" ||
      !email.trim() ||
      !sifre
    ) {
      return NextResponse.json(
        { mesaj: "E-posta ve şifre gereklidir." },
        { status: 400 }
      );
    }

    const apiResponse = await fetch(
      "http://localhost:5037/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, sifre }),
        cache: "no-store",
      }
    );

    if (!apiResponse.ok) {
      return NextResponse.json(
        { mesaj: "E-posta veya şifre hatalı." },
        { status: 401 }
      );
    }

    const data = await apiResponse.json();

    if (typeof data.token !== "string" || !data.token) {
      return NextResponse.json(
        { mesaj: "Sunucudan geçerli oturum bilgisi alınamadı." },
        { status: 502 }
      );
    }

    const response = NextResponse.json({
      mesaj: "Giriş başarılı.",
      kullanici: {
        adSoyad: data.adSoyad,
        email: data.email,
        rol: data.rol,
      },
    });

    response.cookies.set("kurumsal360_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    return response;
  } catch {
    return NextResponse.json(
      { mesaj: "Giriş işlemi gerçekleştirilemedi." },
      { status: 500 }
    );
  }
}
