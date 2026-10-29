
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = "http://localhost:5037/api/malzemeTeslimleri";

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

    const result = await response.text();

    return new NextResponse(
      response.status === 204 ? null : result,
      {
        status: response.status,
        headers: response.status === 204
          ? undefined
          : {
              "Content-Type":
                response.headers.get("content-type") ||
                "text/plain",
            },
      }
    );
  } catch {
    return NextResponse.json(
      { mesaj: "Teslim servisine bağlanılamadı." },
      { status: 502 }
    );
  }
}
