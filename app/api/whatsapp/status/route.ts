import { NextResponse } from "next/server";
import { canAccessWhatsAppApi } from "@/lib/whatsapp-auth";

export async function GET(req: Request) {
  if (!(await canAccessWhatsAppApi(req))) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(
      `${process.env.WHATSAPP_WORKER_URL}/status`,
      {
        cache: "no-store",
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
        connected: false,
        connection: "close",
        qr: null,
        qrDataUrl: null,
        phoneNumber: null,
      },
      {
        status: 500,
      }
    );
  }
}