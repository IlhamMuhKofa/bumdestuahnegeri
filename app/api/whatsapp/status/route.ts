import { NextResponse } from "next/server";
import { canAccessWhatsAppApi } from "@/lib/whatsapp-auth";
import { getMetaWhatsAppStatus } from "@/lib/whatsapp";

// Endpoint status Meta Cloud API untuk memastikan UI/backend memakai koneksi resmi tanpa QR.
export async function GET(req: Request) {
  if (!(await canAccessWhatsAppApi(req))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(getMetaWhatsAppStatus());
}
