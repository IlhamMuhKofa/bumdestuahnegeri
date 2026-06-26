import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const updated = await prisma.anggota.update({
    where: { id: Number((session.user as any).id) },
    data: {
      nama: body.nama ?? null,
      alamat: body.alamat ?? null,
      no_hp: body.no_hp ?? null,
      pekerjaan: body.pekerjaan ?? null,
      jenis_kelamin: body.jenis_kelamin ?? null,
      tanggal_lahir: body.tanggal_lahir ? new Date(body.tanggal_lahir) : null,
      nik: body.nik ?? null,
      // jenis_agunan: body.jenis_agunan ?? null,
      // isProfileComplete bisa kamu set di server berdasarkan aturan (nanti kita rapikan)
    },
  });

  return NextResponse.json({ user: updated });
}