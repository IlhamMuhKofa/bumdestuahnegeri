import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import ClientPage from "./client";

type Props = {
  params: Promise<{
    id_peminjaman: string;
  }>;
};

export default async function Page({
  params,
}: Props) {

  const { id_peminjaman } = await params;

  const idPeminjaman = Number(
    id_peminjaman
  );

  // =====================================================
  // VALIDASI ID PEMINJAMAN
  // =====================================================

  if (isNaN(idPeminjaman)) {
    redirect(
      "/admin/survey"
    );
  }

  // =====================================================
  // AMBIL DATA PEMINJAMAN
  // =====================================================

  const peminjaman =
    await prisma.peminjaman.findUnique({
      where: {
        id_peminjaman:
          idPeminjaman,
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

  // =====================================================
  // JIKA DATA TIDAK DITEMUKAN
  // =====================================================

  if (!peminjaman) {
    redirect(
      "/admin/survey"
    );
  }

  // =====================================================
  // AMBIL SURVEY TERAKHIR
  // =====================================================

  const survey =
    peminjaman
      .jadwalSurvey?.[0] ||
    null;

  // =====================================================
  // RENDER CLIENT
  // =====================================================

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