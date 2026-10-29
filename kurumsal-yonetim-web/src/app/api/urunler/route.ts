
import { NextResponse } from "next/server";

const API = "http://localhost:5037/api/urunler";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(API, {
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
      { message: "Ürün API bağlantısı kurulamadı." },
      { status: 502 }
    );
  }
}
