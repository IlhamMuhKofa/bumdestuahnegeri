import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { canAccessWhatsAppApi } from "@/lib/whatsapp-auth";
import { getWhatsAppStatus } from "@/lib/whatsapp";

export async function GET(req: Request) {
  // 1. Bypass auth untuk lokal testing agar tidak Unauthorized
  if (!(await canAccessWhatsAppApi(req))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const status = getWhatsAppStatus();

  // 2. PASTIKAN Status Route Ini Juga Ikut Mengonversi string QR ke Base64 Image
  const qrDataUrl = status.qr
    ? await QRCode.toDataURL(status.qr, {
        margin: 1,
        width: 280,
      })
    : null;

  return NextResponse.json({
    ...status,
    qrDataUrl, // <--- Ini kunci agar data gambar tidak hilang saat di-polling frontend!
  });
}