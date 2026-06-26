import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createNotifikasi } from "@/lib/notifikasi";

// GET (tidak perlu diubah)
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await prisma.peminjaman.findUnique({
      where: {
        id_peminjaman: Number(params.id),
      },
      include: {
        anggota: true,
        detail: true,
      },
    });

    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

// PATCH (ini yang kamu tambahkan)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const updated = await prisma.peminjaman.update({
      where: {
        id_peminjaman: Number(params.id), // ✅ pakai ini
      },
      data: {
        status: body.status, // update status
      },
    });

    if (body.status === "APPROVED" || body.status === "REJECTED") {
      await createNotifikasi({
        id_anggota: updated.id_anggota,
        role_tujuan: "nasabah",
        isi:
          body.status === "APPROVED"
            ? "Pengajuan pinjaman Anda disetujui"
            : "Pengajuan pinjaman Anda ditolak",
        jenis:
          body.status === "APPROVED"
            ? "PINJAMAN_DISETUJUI"
            : "PINJAMAN_DITOLAK",
        url: "/nasabah/pinjaman",
      });
    }

    return NextResponse.json({ success: true, data: updated });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal update data" }, { status: 500 });
  }
}
