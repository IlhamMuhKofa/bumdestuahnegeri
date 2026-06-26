import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ===== GET BY ID =====
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await prisma.artikel.findUnique({
    where: { id_artikel: Number(params.id) },
  });

  return NextResponse.json(data);
}

// ===== UPDATE =====
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const updated = await prisma.artikel.update({
    where: { id_artikel: Number(params.id) },
    data: {
      judul: body.judul,
      deskripsi_konten: body.deskripsi_konten,
      gambar_konten: body.gambar_konten,
    },
  });

  return NextResponse.json(updated);
}