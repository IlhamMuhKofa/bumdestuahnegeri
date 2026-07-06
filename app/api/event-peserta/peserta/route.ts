import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id_anggota = searchParams.get("id_anggota");

  const data = await prisma.event_peserta.findMany({
    where: {
      id_anggota: Number(id_anggota),
    },
  });

  return NextResponse.json(data);
}