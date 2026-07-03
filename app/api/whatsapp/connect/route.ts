import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { canAccessWhatsAppApi } from "@/lib/whatsapp-auth";
import { connectWhatsApp, getWhatsAppStatus } from "@/lib/whatsapp";

// Kita buat fungsi pembantu (handler) utama
async function handleConnect(req: Request) {
  if (!(await canAccessWhatsAppApi(req))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 1. Trigger koneksi Baileys
  await connectWhatsApp();

  // 2. AMBIL STATE TERBARU LANGSUNG DARI RUNTIME GLOBAL (Jangan andalkan return value lama)
  const currentStatus = getWhatsAppStatus();

  // 3. Konversi string QR ke gambar Base64 jika ada
  const qrDataUrl = currentStatus.qr
    ? await QRCode.toDataURL(currentStatus.qr, {
        margin: 1,
        width: 280,
      })
    : null;

  return NextResponse.json({
    success: true,
    ...currentStatus,
    qrDataUrl,
  });
}

// Loloskan baik frontend menembak lewat GET maupun POST agar anti-gagal!
export async function POST(req: Request) {
  return handleConnect(req);
}

export async function GET(req: Request) {
  return handleConnect(req);
}