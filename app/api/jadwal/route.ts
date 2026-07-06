import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.peminjaman.findMany({
      include: {
        anggota: true,
        jadwal: true,
      },
      orderBy: {
        tanggal_pengajuan: "desc",
      },
    });

    const now = new Date();

    const result = data.map((item) => {
      const totalCicilan = item.jangka_waktu;
      const jadwal = item.jadwal as Array<{ status: string; jatuh_tempo: string }>;

      // =========================
      // 🔥 STATUS LOGIC
      // =========================
      let status = "baru";

      if (jadwal.length > 0) {
        const telat = jadwal.some(
          (j) =>
            j.status !== "lunas" &&
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
        (j) => j.status === "lunas"
      ).length;

      return {
        id_peminjaman: item.id_peminjaman,
        nama: item.anggota.nama,
        jumlah: item.total_pinjaman,
        tenor: totalCicilan,
        cicilan_ke: sudahBayar,
        status,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal ambil data" },
      { status: 500 }
    );
  }
}