
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = "http://localhost:5037/api/departmanlar";

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
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { mesaj: "Departmanlar alınamadı." },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { mesaj: "Backend API bağlantısı kurulamadı." },
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

    const response = await fetch(API_URL, {
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
          response.headers.get("content-type") ||
          "text/plain",
      },
    });
  } catch {
    return NextResponse.json(
      { mesaj: "Departman eklenemedi. API bağlantısını kontrol edin." },
      { status: 502 }
    );
  }
}
