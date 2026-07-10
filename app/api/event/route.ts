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
      prisma.event.findMany({
        orderBy: [
          {
            status: "asc",
          },
          {
            tanggal: "asc",
          },
        ],
        skip,
        take: PAGE_SIZE,
      }),
      prisma.event.count(),
    ]);

    return NextResponse.json({
      data,
      total,
      totalPages: Math.max(Math.ceil(total / PAGE_SIZE), 1),
      page,
    });
  }

  const data = await prisma.event.findMany({
    orderBy: {
      tanggal: "asc", // event terdekat dulu
    },
  });

  return NextResponse.json(data);
}

// ===== CREATE =====
export async function POST(req: Request) {
  const body = await req.json();

  const newEvent = await prisma.event.create({
    data: {
      judul: body.judul,
      deskripsi_event: body.deskripsi_event,
      gambar_event: body.gambar_event,
      tanggal: new Date(body.tanggal),
      lokasi: body.lokasi,
      status: "published",
    },
  });

  return NextResponse.json(newEvent);

}

// ===== SET FEATURED =====
export async function PATCH(req: Request) {
  const { id } = await req.json();

  await prisma.event.updateMany({
    where: { status: "featured" },
    data: { status: "published" },
  });

  await prisma.event.update({
    where: { id_event: Number(id) },
    data: { status: "featured" },
  });

  return NextResponse.json({ success: true });
}

// ===== DELETE ===== //
export async function DELETE(req: Request) {
  const { id } = await req.json();

  await prisma.event.delete({
    where: {
      id_event: Number(id),
    },
  });

  return NextResponse.json({ success: true });
}
