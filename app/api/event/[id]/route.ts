import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ===== GET BY ID =====
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await prisma.event.findUnique({
    where: {
      id_event: Number(params.id),
    },
  });

  return NextResponse.json(data);
}

// ===== UPDATE =====
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const updated = await prisma.event.update({
    where: {
      id_event: Number(params.id),
    },
    data: {
      judul: body.judul,
      deskripsi_event: body.deskripsi_event,
      gambar_event: body.gambar_event,
      tanggal: new Date(body.tanggal),
      lokasi: body.lokasi,
    },
  });

  return NextResponse.json(updated);
}

// ===== DELETE =====
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  // 🔥 OPTIONAL: kalau ada relasi peserta
  await prisma.event_peserta.deleteMany({
    where: {
      id_event: Number(params.id),
    },
  });

  await prisma.event.delete({
    where: {
      id_event: Number(params.id),
    },
  });

  return NextResponse.json({ success: true });
}