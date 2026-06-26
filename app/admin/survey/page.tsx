import { prisma } from "@/lib/prisma";
import ClientPage from "./client";

export default async function Page() {

  // =========================
  // DATA NASABAH
  // =========================
  const dataRaw =
    await prisma.peminjaman.findMany({
      where: {
        status: "APPROVED",
      },

      include: {
        anggota: true,
        jadwalSurvey: true,
      },

      orderBy: {
        tanggal_pengajuan: "desc",
      },
    });

  // =========================
  // GROUP NASABAH
  // =========================
  const grouped: any = {};

  dataRaw.forEach((item) => {

    const id =
      item.id_anggota;

    if (!grouped[id]) {

      grouped[id] = {
        id_anggota: id,

        nama:
          item.anggota?.nama ||
          "Tanpa Nama",

        total_pengajuan: 0,

        terakhir:
          item.tanggal_pengajuan,

        latest_peminjaman:
          item.id_peminjaman,

        status_survey:
          item.status_survey,

        jadwalSurvey:
          item.jadwalSurvey?.[0] || null,
      };
    }

    grouped[id].total_pengajuan += 1;

    if (
      new Date(item.tanggal_pengajuan) >
      new Date(grouped[id].terakhir)
    ) {

      grouped[id].terakhir =
        item.tanggal_pengajuan;

      grouped[id].latest_peminjaman =
        item.id_peminjaman;

      grouped[id].status_survey =
        item.status_survey;

      grouped[id].jadwalSurvey =
        item.jadwalSurvey?.[0] || null;
    }
  });

  const dataNasabah =
    Object.values(grouped);

  // =========================
  // DATA KALENDER
  // =========================
  const dataSurvey =
    await prisma.jadwalSurvey.findMany({

      include: {
        peminjaman: {
          include: {
            anggota: true,
          },
        },
      },

      orderBy: {
        tanggal_survey: "asc",
      },
    });

  return (
    <ClientPage
      dataPeminjaman={dataNasabah}
      dataSurvey={dataSurvey}
    />
  );
}