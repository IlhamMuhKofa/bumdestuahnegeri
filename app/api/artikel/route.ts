import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ===== GET ALL =====
const PAGE_SIZE = 7;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pageParam = searchParams.get("page");

  if (pageParam) {
    const page = Math.max(Number(pageParam || 1), 1);
    const skip = (page - 1) * PAGE_SIZE;

    const [data, total] = await Promise.all([
      prisma.artikel.findMany({
        orderBy: [
          {
            status: "asc",
          },
          {
            tanggal_publish: "desc",
          },
        ],
        skip,
        take: PAGE_SIZE,
      }),
      prisma.artikel.count(),
    ]);

    return NextResponse.json({
      data,
      total,
      totalPages: Math.max(Math.ceil(total / PAGE_SIZE), 1),
      page,
    });
  }

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

  return NextResponse.json({
  success: true,
  message: "Artikel berhasil dihapus.",
});
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

  return NextResponse.json({
  success: true,
  message: "Artikel berhasil dijadikan unggulan.",
});
}
