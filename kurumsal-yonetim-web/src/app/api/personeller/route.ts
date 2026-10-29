
import { cookies } from "next/headers";

import { NextResponse } from "next/server";
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("kurumsal360_token")?.value;

  if (!token) {
    return NextResponse.json(
      { mesaj: "Oturum açmanız gerekiyor." },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(
      "http://localhost:5037/api/personeller",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { mesaj: "Personel bilgileri alınamadı." },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { mesaj: "API bağlantısı kurulamadı." },
      { status: 502 }
    );
  }
}


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

    const response = await fetch(
      "http://localhost:5037/api/personeller",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );

    const result = await response.text();

    return new NextResponse(result, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ||
          "text/plain",
      },
    });
  } catch {
    return NextResponse.json(
      { mesaj: "Personel ekleme işlemi gerçekleştirilemedi." },
      { status: 502 }
    );
  }
}
