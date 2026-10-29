
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = "http://localhost:5037/api/personeller";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: Request,
  context: Context
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("kurumsal360_token")?.value;

  if (!token) {
    return NextResponse.json(
      { mesaj: "Oturum açmanız gerekiyor." },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;
    const body = await request.json();

    const response = await fetch(
      `${API_URL}/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );

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
      { mesaj: "Personel güncellenemedi." },
      { status: 502 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: Context
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("kurumsal360_token")?.value;

  if (!token) {
    return NextResponse.json(
      { mesaj: "Oturum açmanız gerekiyor." },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;

    const response = await fetch(
      `${API_URL}/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

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
      { mesaj: "Personel silinemedi." },
      { status: 502 }
    );
  }
}
