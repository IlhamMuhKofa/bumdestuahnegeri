"use server";

import { prisma } from "@/lib/prisma";
import { catatRiwayatTransaksi } from "@/lib/transaksi";

import {
  revalidatePath,
} from "next/cache";

// ================= VERIFY PAYMENT =================
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
        jadwal: {
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

  // update pembayaran
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

  // update jadwal
  await prisma.jadwalAngsuran.update({
    where: {
      id_jadwal:
        pembayaran.id_jadwal,
    },

    data: {
      status:
        "LUNAS",
    },
  });

  // insert riwayat
  await catatRiwayatTransaksi(prisma, {
    idAnggota: pembayaran.jadwal.peminjaman.id_anggota,
    kategori: "PINJAMAN",
    nominal: pembayaran.jumlah,
    metodeBayar: pembayaran.metode_bayar,
    nomor: pembayaran.jadwal.cicilan_ke,
    buktiBayar: pembayaran.bukti_bayar,
    refTabel: "pembayaran",
    refId: pembayaran.id_pembayaran,
  });

  revalidatePath(
    "/admin/pembayaran"
  );

  revalidatePath(
    "/admin/riwayat"
  );

  revalidatePath(
    "/nasabah/riwayat"
  );

  return {
    success: true,
  };
}

// ================= MANUAL PAYMENT =================
type ManualPayload = {
  idJadwal: number;
  catatan?: string;
  buktiBayar: string;
};

export async function createManualPayment(
  payload: ManualPayload
) {

  const jadwal =
    await prisma.jadwalAngsuran.findUnique({
      where: {
        id_jadwal:
          payload.idJadwal,
      },

      include: {
        peminjaman: true,
      },
    });

  if (!jadwal) {
    throw new Error(
      "Jadwal tidak ditemukan"
    );
  }

  if (!payload.buktiBayar) {
    throw new Error("Bukti pembayaran cash wajib diupload");
  }

  // create pembayaran
  const pembayaran = await prisma.pembayaran.create({
    data: {
      id_jadwal:
        jadwal.id_jadwal,

      jumlah:
        jadwal.jumlah_tagihan,

      metode_bayar:
        "CASH",

      status:
        "BERHASIL",

      catatan:
        payload.catatan ||
        "Pembayaran langsung di kantor",

      bukti_bayar:
        payload.buktiBayar,
    },
  });

  // update jadwal
  await prisma.jadwalAngsuran.update({
    where: {
      id_jadwal:
        jadwal.id_jadwal,
    },

    data: {
      status:
        "LUNAS",
    },
  });

  // insert riwayat transaksi
  await catatRiwayatTransaksi(prisma, {
    idAnggota: jadwal.peminjaman.id_anggota,
    kategori: "PINJAMAN",
    nominal: jadwal.jumlah_tagihan,
    metodeBayar: "CASH",
    nomor: jadwal.cicilan_ke,
    buktiBayar: payload.buktiBayar,
    refTabel: "pembayaran",
    refId: pembayaran.id_pembayaran,
  });

  revalidatePath(
    "/admin/pembayaran"
  );

  revalidatePath(
    "/admin/riwayat"
  );

  revalidatePath(
    "/nasabah/riwayat"
  );

  return {
    success: true,
  };
}
