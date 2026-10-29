
import { NextResponse } from "next/server";

const API_URL = "http://localhost:5037/api/departmanlar";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    return new NextResponse(await response.text(), {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { message: "Departman eklenemedi. API bağlantısını kontrol edin." },
      { status: 502 }
    );
  }
}

export async function GET() {
  try {
    const response = await fetch(
      "http://localhost:5037/api/departmanlar",
      { cache: "no-store" }
    );

    return new Response(await response.text(), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    return Response.json(
      { message: "Departman servisine bağlanılamadı." },
      { status: 502 }
    );
  }
}

