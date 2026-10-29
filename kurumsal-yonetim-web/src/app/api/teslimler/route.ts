
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(
      "http://localhost:5037/api/malzemeTeslimleri",
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
    });
  } catch {
    return NextResponse.json(
      { message: "Teslim servisine bağlanılamadı." },
      { status: 502 }
    );
  }
}
