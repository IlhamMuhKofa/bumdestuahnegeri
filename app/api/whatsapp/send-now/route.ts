import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessWhatsAppApi } from "@/lib/whatsapp-auth";
import { sendWhatsAppTextMessage } from "@/lib/whatsapp";
import { sendWhatsAppReminderNow } from "@/lib/whatsapp-reminder";

type SendNowPayload =
  | {
      mode: "reminder";
      reminderId: number;
    }
  | {
      mode: "custom";
      noHp: string;
      message: string;
    };

function errorResponse(error: unknown, status = 400) {
  const message =
    error instanceof Error ? error.message : "Gagal mengirim WhatsApp.";

  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status }
  );
}

export async function POST(req: Request) {
  if (!(await canAccessWhatsAppApi(req))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let payload: SendNowPayload;

  try {
    payload = (await req.json()) as SendNowPayload;
  } catch {
    return errorResponse(new Error("Payload request tidak valid."));
  }

  try {
    if (payload.mode === "reminder") {
      if (!Number.isInteger(payload.reminderId)) {
        throw new Error("Pilih jadwal reminder yang valid.");
      }

      const result = await sendWhatsAppReminderNow(prisma, payload.reminderId);
      return NextResponse.json(result);
    }

    if (payload.mode === "custom") {
      await sendWhatsAppTextMessage({
        noHp: payload.noHp,
        message: payload.message,
      });

      return NextResponse.json({
        success: true,
      });
    }

    return errorResponse(new Error("Mode pengiriman tidak dikenali."));
  } catch (error) {
    return errorResponse(error, 502);
  }
}
