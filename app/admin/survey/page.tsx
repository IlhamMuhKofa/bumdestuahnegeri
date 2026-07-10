import { prisma } from "@/lib/prisma";
import ClientPage from "./client";
import Pagination from "../component/Pagination";

const PAGE_SIZE = 7;

type Props = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function Page({
  searchParams,
}: Props) {
  const params = await searchParams;
  const currentPage = Math.max(Number(params?.page || 1), 1);
  const skip = (currentPage - 1) * PAGE_SIZE;

  // =========================
  // DATA NASABAH
  // =========================
  const [anggotaRaw, totalNasabah] =
    await Promise.all([
      prisma.anggota.findMany({
      where: {
        peminjaman: {
          some: {
            status: "APPROVED",
          },
        },
      },

      include: {
        peminjaman: {
          where: {
            status: "APPROVED",
          },
          include: {
            jadwalSurvey: true,
          },
          orderBy: {
            tanggal_pengajuan: "desc",
          },
        },
      },

      orderBy: {
        id: "desc",
      },
      skip,
      take: PAGE_SIZE,
    }),
      prisma.anggota.count({
        where: {
          peminjaman: {
            some: {
              status: "APPROVED",
            },
          },
        },
      }),
    ]);

  const dataNasabah =
    anggotaRaw.map((item) => {
      const latest = item.peminjaman[0];

      return {
        id_anggota: item.id,
        nama: item.nama || "Tanpa Nama",
        total_pengajuan: item.peminjaman.length,
        terakhir: latest?.tanggal_pengajuan,
        latest_peminjaman: latest?.id_peminjaman,
        status_survey: latest?.status_survey,
        jadwalSurvey: latest?.jadwalSurvey?.[0] || null,
      };
    });

  // =========================
  // DATA KALENDER
  // =========================
  const dataSurvey =
    await prisma.jadwal_survey.findMany({

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
    <>
      <ClientPage
        dataPeminjaman={dataNasabah}
        dataSurvey={dataSurvey}
      />
      <div className="bg-gray-50 px-4 pb-6 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(Math.ceil(totalNasabah / PAGE_SIZE), 1)}
            basePath="/admin/survey"
          />
        </div>
      </div>
    </>
  );
}
