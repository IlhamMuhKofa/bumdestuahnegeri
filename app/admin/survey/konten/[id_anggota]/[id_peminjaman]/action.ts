"use server";

import { prisma } from "@/lib/prisma";
import { createNotifikasi } from "@/lib/notifikasi";
import { revalidatePath } from "next/cache";

type Payload = {
  idPeminjaman: number;
  tanggalSurvey: string;
  lokasi?: string;
  catatan?: string;
};

export async function createJadwalSurvey(
  payload: Payload
) {

  const {
    idPeminjaman,
    tanggalSurvey,
    lokasi,
    catatan,
  } = payload;

  const peminjaman = await prisma.$transaction(
    async (tx) => {

      // 🔥 cek existing survey
      const existingSurvey =
        await tx.jadwalSurvey.findFirst({
          where: {
            id_peminjaman:
              idPeminjaman,
          },
        });

      // 🔥 kalau sudah ada -> UPDATE
      if (
        existingSurvey
      ) {

        await tx.jadwalSurvey.update({
          where: {
            id_survey:
              existingSurvey.id_survey,
          },

          data: {
            tanggal_survey:
              new Date(
                tanggalSurvey
              ),

            lokasi,

            catatan,
          },
        });
      }

      // 🔥 kalau belum ada -> CREATE
      else {

        await tx.jadwalSurvey.create({
          data: {
            id_peminjaman:
              idPeminjaman,

            tanggal_survey:
              new Date(
                tanggalSurvey
              ),

            lokasi,

            catatan,

            status:
              "TERJADWAL",
          },
        });
      }

      // 🔥 update status survey
      const updated = await tx.peminjaman.update({
        where: {
          id_peminjaman:
            idPeminjaman,
        },

        data: {
          status_survey:
            "SUDAH",
        },
      });

      return updated;
    }
  );

  await createNotifikasi({
    id_anggota: peminjaman.id_anggota,
    role_tujuan: "nasabah",
    isi: "Jadwal survey pinjaman Anda telah dibuat",
    jenis: "JADWAL_SURVEY",
    url: "/nasabah/cicilan/konten/survey",
  });

  revalidatePath(
    "/admin/survey"
  );

  revalidatePath(
    `/admin/survey/${idPeminjaman}`
  );

  revalidatePath(
    "/nasabah/tagihan"
  );

  return {
    success: true,
  };
}
