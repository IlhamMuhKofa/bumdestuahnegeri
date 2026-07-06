import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createNotifikasi } from "@/lib/notifikasi";

// =======================
// ✅ GET DATA PESERTA
// =======================
export async function GET() {
  const data = await prisma.event_peserta.findMany({
    include: {
      event: true,     // 🔥 ambil data event (judul, dll)
      anggota: true,   // 🔥 ambil data user (optional)
    },
    orderBy: {
      tanggal_daftar: "desc",
    },
  });

  return NextResponse.json(data);
}


// =======================
// ✅ POST DAFTAR EVENT
// =======================
export async function POST(req: Request) {
  const body = await req.json();

  const { id_event, id_anggota, nama, email } = body;

  // 🔥 CEK SUDAH DAFTAR
  const existing = await prisma.event_peserta.findFirst({
    where: {
      id_event: Number(id_event),
      id_anggota: Number(id_anggota),
    },
  });

  if (existing) {
    return NextResponse.json(
      { success: false, message: "Kamu sudah terdaftar di event ini!" },
      { status: 400 }
    );
  }

  // 🔥 SIMPAN
  const data = await prisma.event_peserta.create({
    data: {
      id_event: Number(id_event),
      id_anggota: Number(id_anggota),
      nama,
      email,
    },
  });

  await createNotifikasi({
    role_tujuan: "admin",
    isi: `${nama} mendaftar event`,
    jenis: "PENDAFTARAN_EVENT",
    url: "/admin/event",
  });

  return NextResponse.json({
    success: true,
    message: "Berhasil daftar!",
    data,
  });
}
