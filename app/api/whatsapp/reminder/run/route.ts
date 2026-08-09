import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessWhatsAppApi } from "@/lib/whatsapp-auth";
import { processDueWhatsAppReminders } from "@/lib/whatsapp-reminder";

// Handler cron/worker untuk mengirim reminder yang sudah masuk jadwal H-2.
async function runReminder(req: Request) {
  if (!(await canAccessWhatsAppApi(req))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const result = await processDueWhatsAppReminders(prisma, 50);

  return NextResponse.json({
    success: true,
    ...result,
  });
}

export async function GET(req: Request) {
  return runReminder(req);
}

// Endpoint POST dipakai cron eksternal untuk memicu pengiriman otomatis pada jadwal H-2.
export async function POST(req: Request) {
  return runReminder(req);
}
