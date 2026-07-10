import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ===== GET BY ID =====
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const data = await prisma.artikel.findUnique({
    where: {
      id_artikel: Number(id),
    },
  });

  return NextResponse.json(data);
}

// ===== UPDATE =====
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const body = await req.json();

  const updated = await prisma.artikel.update({
    where: {
      id_artikel: Number(id),
    },
    data: {
      judul: body.judul,
      deskripsi_konten: body.deskripsi_konten,
      gambar_konten: body.gambar_konten,
    },
  });

  return NextResponse.json(updated);
}