"use server";

import { prisma } from "@/lib/prisma";
import { createNotifikasi } from "@/lib/notifikasi";
import { revalidatePath } from "next/cache";
import { syncPostgresSequence } from "@/lib/prisma-sequence";

type TransferPayload = {
  idJadwal: number;
  buktiBayar: string;
  catatan?: string;
};

export async function submitTransferPayment(
  payload: TransferPayload
) {
  // cek jadwal
  const jadwal =
    await prisma.jadwal_angsuran.findUnique({
      where: {
        id_jadwal: payload.idJadwal,
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

  // cek apakah sudah ada pembayaran
  const existingPayment =
    await prisma.pembayaran.findFirst({
      where: {
        id_jadwal:
          payload.idJadwal,

        status: {
          in: [
            "MENUNGGU",
            "BERHASIL",
          ],
        },
      },
    });

  if (existingPayment) {
    throw new Error(
      "Tagihan sudah dibayar atau sedang diverifikasi"
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id_jadwal" FROM "jadwal_angsuran" WHERE "id_jadwal" = ${payload.idJadwal} FOR UPDATE`;
    await syncPostgresSequence(tx, "pembayaran");

    await tx.pembayaran.create({
      data: {
        id_jadwal:
          jadwal.id_jadwal,

        jumlah:
          jadwal.jumlah_tagihan,

        metode_bayar:
          "TRANSFER",

        status:
          "MENUNGGU",

        bukti_bayar:
          payload.buktiBayar,

        catatan:
          payload.catatan,
      },
    });

    await tx.jadwal_angsuran.update({
      where: {
        id_jadwal:
          payload.idJadwal,
      },

      data: {
        status:
          "MENUNGGU",
      },
    });
  }, {
    isolationLevel: "Serializable",
    maxWait: 10000,
    timeout: 20000,
  });

  await createNotifikasi({
    role_tujuan: "admin",
    isi: `Nasabah mengunggah bukti pembayaran cicilan ke-${jadwal.cicilan_ke}`,
    jenis: "BUKTI_CICILAN",
    url: `/admin/cicilan/konten/${jadwal.peminjaman.id_anggota}/${jadwal.id_peminjaman}`,
  });

  revalidatePath(
    "/nasabah/cicilan"
  );

  return {
    success: true,
  };
}

export async function submitCashPayment(
  idJadwal: number
) {
  // cek jadwal
  const jadwal =
    await prisma.jadwal_angsuran.findUnique({
      where: {
        id_jadwal:
          idJadwal,
      },
    });

  if (!jadwal) {
    throw new Error(
      "Jadwal tidak ditemukan"
    );
  }

  // cek pembayaran existing
  const existingPayment =
    await prisma.pembayaran.findFirst({
      where: {
        id_jadwal:
          idJadwal,

        status: {
          in: [
            "MENUNGGU",
            "BERHASIL",
          ],
        },
      },
    });

  if (existingPayment) {
    throw new Error(
      "Tagihan sudah dibayar atau sedang diverifikasi"
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id_jadwal" FROM "jadwal_angsuran" WHERE "id_jadwal" = ${idJadwal} FOR UPDATE`;
    await syncPostgresSequence(tx, "pembayaran");

    await tx.pembayaran.create({
      data: {
        id_jadwal:
          jadwal.id_jadwal,

        jumlah:
          jadwal.jumlah_tagihan,

        metode_bayar:
          "CASH",

        status:
          "MENUNGGU",

        catatan:
          "Pembayaran di kantor",
      },
    });

    await tx.jadwal_angsuran.update({
      where: {
        id_jadwal:
          idJadwal,
      },

      data: {
        status:
          "MENUNGGU",
      },
    });
  }, {
    isolationLevel: "Serializable",
    maxWait: 10000,
    timeout: 20000,
  });

  revalidatePath(
    "/nasabah/cicilan"
  );

  return {
    success: true,
  };
}
