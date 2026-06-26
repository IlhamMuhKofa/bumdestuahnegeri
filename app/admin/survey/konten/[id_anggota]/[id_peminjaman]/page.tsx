import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import ClientPage from "./client";

type Props = {
  params: {
    id_anggota: string;
    id_peminjaman: string;
  };
};

export default async function Page({
  params,
}: Props) {

  const idAnggota = Number(
    params.id_anggota
  );

  const idPeminjaman =
    Number(
      params.id_peminjaman
    );

  // validasi id
  if (
    isNaN(idAnggota) ||
    isNaN(idPeminjaman)
  ) {
    redirect(
      "/admin/survey"
    );
  }

  // ambil data peminjaman
  const peminjaman =
    await prisma.peminjaman.findFirst({
      where: {
        id_peminjaman:
          idPeminjaman,

        id_anggota:
          idAnggota,

        status:
          "APPROVED",
      },

      include: {
        anggota: true,

        detail: true,

        jadwalSurvey: {
          orderBy: {
            tanggal_survey:
              "desc",
          },

          take: 1,
        },
      },
    });

  // tidak ditemukan
  if (!peminjaman) {
    redirect(
      "/admin/survey"
    );
  }

  // ambil survey terakhir
  const survey =
    peminjaman
      .jadwalSurvey?.[0] ||
    null;

  return (
    <ClientPage
      peminjaman={
        peminjaman
      }

      survey={
        survey
      }
    />
  );
}