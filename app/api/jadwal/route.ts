import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const PAGE_SIZE = 7;
  const { searchParams } = new URL(req.url);
  const pageParam = searchParams.get("page");
  const page = Math.max(Number(pageParam || 1), 1);
  const skip = pageParam ? (page - 1) * PAGE_SIZE : undefined;
  const take = pageParam ? PAGE_SIZE : undefined;

  try {
    const [data, total] = await Promise.all([
      prisma.peminjaman.findMany({
      include: {
        anggota: true,
        jadwal: true,
      },
      orderBy: {
        tanggal_pengajuan: "desc",
      },
      skip,
      take,
    }),
      prisma.peminjaman.count(),
    ]);

    const now = new Date();

    const result = data.map((item) => {
      const totalCicilan = item.jangka_waktu;
      const jadwal = item.jadwal;

      // =========================
      // 🔥 STATUS LOGIC
      // =========================
      let status = "baru";

      if (jadwal.length > 0) {
        const telat = jadwal.some(
          (j) =>
            j.status !== "LUNAS" &&
            new Date(j.jatuh_tempo) < now
        );

        if (telat) {
          status = "telat";
        } else {
          status = "aktif";
        }
      }

      // =========================
      // 🔥 HITUNG CICILAN KE
      // =========================
      const sudahBayar = jadwal.filter(
        (j) => j.status === "LUNAS"
      ).length;

      return {
        id_peminjaman: item.id_peminjaman,
        id_anggota: item.id_anggota,
        nama: item.anggota.nama,
        jumlah: item.total_pinjaman,
        tenor: totalCicilan,
        cicilan_ke: sudahBayar,
        status,
      };
    });

    if (pageParam) {
      return NextResponse.json({
        data: result,
        total,
        totalPages: Math.max(Math.ceil(total / PAGE_SIZE), 1),
        page,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal ambil data" },
      { status: 500 }
    );
  }
}
