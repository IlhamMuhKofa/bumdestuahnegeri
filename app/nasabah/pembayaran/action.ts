"use server";

import { prisma } from "@/lib/prisma";
import { catatRiwayatTransaksi } from "@/lib/transaksi";
import { createNotifikasi } from "@/lib/notifikasi";

export async function verifyPayment(
  idPembayaran: number
) {
  const pembayaran =
    await prisma.pembayaran.findUnique({
      where: {
        id_pembayaran:
          idPembayaran,
      },

      include: {
        jadwal_angsuran: {
          include: {
            peminjaman: true,
          },
        },
      },
    });

  if (!pembayaran) {
    throw new Error(
      "Pembayaran tidak ditemukan"
    );
  }

  // 1. update pembayaran
  await prisma.pembayaran.update({
    where: {
      id_pembayaran:
        idPembayaran,
    },

    data: {
      status:
        "BERHASIL",
    },
  });

  // 2. update jadwal
  await prisma.jadwal_angsuran.update({
    where: {
      id_jadwal:
        pembayaran.id_jadwal,
    },

    data: {
      status:
        "LUNAS",
    },
  });

  // 3. insert riwayat transaksi
  await catatRiwayatTransaksi(prisma, {
    idAnggota: pembayaran.jadwal_angsuran.peminjaman.id_anggota,
    kategori: "PINJAMAN",
    nominal: pembayaran.jumlah,
    metodeBayar: pembayaran.metode_bayar,
    nomor: pembayaran.jadwal_angsuran.cicilan_ke,
    buktiBayar: pembayaran.bukti_bayar,
    refTabel: "pembayaran",
    refId: pembayaran.id_pembayaran,
  });

  await createNotifikasi({
    id_anggota: pembayaran.jadwal_angsuran.peminjaman.id_anggota,
    role_tujuan: "nasabah",
    isi: `Pembayaran cicilan ke-${pembayaran.jadwal_angsuran.cicilan_ke} telah diverifikasi`,
    jenis: "VERIFIKASI_CICILAN",
    url: `/nasabah/cicilan/${pembayaran.jadwal_angsuran.id_peminjaman}`,
  });

  return {
    success: true,
  };
}
