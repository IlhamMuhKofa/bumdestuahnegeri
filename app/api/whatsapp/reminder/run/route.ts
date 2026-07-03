import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessWhatsAppApi } from "@/lib/whatsapp-auth";
import { processDueWhatsAppReminders } from "@/lib/whatsapp-reminder";

async function runReminder(req: Request) {
  if (!(await canAccessWhatsAppApi(req))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const result = await processDueWhatsAppReminders(prisma, 50, {
    forceHMinusOne: true,
  });

  return NextResponse.json({
    success: true,
    ...result,
  });
}

export async function GET(req: Request) {
  return runReminder(req);
}

export async function POST(req: Request) {
  return runReminder(req);
}
