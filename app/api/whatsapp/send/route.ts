import { NextResponse } from "next/server";
import { canAccessWhatsAppApi } from "@/lib/whatsapp-auth";
import { getWhatsAppStatus, sendWhatsAppMessage } from "@/lib/whatsapp";

export async function POST(req: Request) {
  if (!(await canAccessWhatsAppApi(req))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    noHp?: string;
    pesan?: string;
  };

  if (!body.noHp || !body.pesan?.trim()) {
    return NextResponse.json(
      { message: "Nomor HP dan pesan wajib diisi" },
      { status: 400 }
    );
  }

  const status = getWhatsAppStatus();

  if (!status.connected) {
    return NextResponse.json(
      { message: "WhatsApp belum terhubung" },
      { status: 400 }
    );
  }

  await sendWhatsAppMessage(body.noHp, body.pesan.trim());

  return NextResponse.json({
    success: true,
  });
}
