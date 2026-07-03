import { NextResponse } from "next/server";
import { canAccessWhatsAppApi } from "@/lib/whatsapp-auth";
import { logoutWhatsApp } from "@/lib/whatsapp";

export async function POST(req: Request) {
  if (!(await canAccessWhatsAppApi(req))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await logoutWhatsApp();

  return NextResponse.json({
    success: true,
  });
}
