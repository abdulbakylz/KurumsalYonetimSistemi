
import { NextResponse } from "next/server";

const API_URL = "http://localhost:5037/api/departmanlar";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const response = await fetch(
      `${API_URL}/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    return new NextResponse(await response.text(), {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { message: "Departman güncellenemedi." },
      { status: 502 }
    );
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const { id } = await context.params;

    const response = await fetch(
      `${API_URL}/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    );

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    return new NextResponse(await response.text(), {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { message: "Departman silinemedi." },
      { status: 502 }
    );
  }
}
