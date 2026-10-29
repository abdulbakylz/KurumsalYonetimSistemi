
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(
      "http://localhost:5037/api/personeller",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      { message: "Backend API bağlantısı kurulamadı." },
      { status: 502 }
    );
  }
}
