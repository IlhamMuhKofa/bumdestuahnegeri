import { NextResponse } from "next/server";
import { canAccessWhatsAppApi } from "@/lib/whatsapp-auth";

export async function POST(req: Request) {
  if (!(await canAccessWhatsAppApi(req))) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const response = await fetch(
      `${process.env.WHATSAPP_WORKER_URL}/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Worker WhatsApp tidak dapat dihubungi.",
      },
      {
        status: 500,
      }
    );
  }
}