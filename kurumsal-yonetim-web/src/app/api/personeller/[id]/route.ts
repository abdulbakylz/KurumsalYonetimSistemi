
import { NextResponse } from "next/server";

const API_URL = "http://localhost:5037/api/personeller";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: Request,
  context: Context
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const response = await fetch(
      `${API_URL}/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );

    return new NextResponse(await response.text(), {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { message: "Personel güncellenemedi." },
      { status: 502 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: Context
) {
  try {
    const { id } = await context.params;

    const response = await fetch(
      `${API_URL}/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        cache: "no-store",
      }
    );

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    return new NextResponse(await response.text(), {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { message: "Personel silinemedi." },
      { status: 502 }
    );
  }
}
