
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API = "http://localhost:5037/api/urunler";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("kurumsal360_token")?.value;

  if (!token) {
    return NextResponse.json(
      { mesaj: "Oturum açmanız gerekiyor." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const response = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    return new NextResponse(await response.text(), {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "text/plain",
      },
    });
  } catch {
    return NextResponse.json(
      { mesaj: "Ürün API bağlantısı kurulamadı." },
      { status: 502 }
    );
  }
}
