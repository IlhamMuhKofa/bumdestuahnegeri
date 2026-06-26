import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ===== GET ALL =====
export async function GET() {
  const data = await prisma.artikel.findMany({
    orderBy: {
      tanggal_publish: "desc",
    },
  });

  return NextResponse.json(data);
}

// ===== CREATE =====
export async function POST(req: Request) {
  const body = await req.json();

  const newArtikel = await prisma.artikel.create({
    data: {
      judul: body.judul,
      deskripsi_konten: body.deskripsi_konten,
      gambar_konten: body.gambar_konten,
      status: "published",
      tanggal_publish: new Date(),
    },
  });

  return NextResponse.json(newArtikel);
}

// ===== DELETE =====
export async function DELETE(req: Request) {
  const { id } = await req.json();

await prisma.artikel.delete({
  where: { id_artikel: Number(id) },
});

  return NextResponse.json({ success: true });
}

// ===== SET FEATURED =====
export async function PATCH(req: Request) {
  const { id } = await req.json();

  // reset semua featured
  await prisma.artikel.updateMany({
    where: { status: "featured" },
    data: { status: "published" },
  });

  // set yang dipilih jadi featured
await prisma.artikel.update({
  where: { id_artikel: Number(id) },
  data: { status: "featured" },
});

  return NextResponse.json({ success: true });
}