import { prisma } from "@/lib/prisma";

import Client from "./client";
import Pagination from "../component/Pagination";

const PAGE_SIZE = 7;

type Props = {
  searchParams?: Promise<{
    page?: string;
    q?: string;
  }>;
};

export default async function Page({
  searchParams,
}: Props) {
  const params = await searchParams;
  const currentPage = Math.max(Number(params?.page || 1), 1);
  const query = params?.q?.trim() || "";
  const skip = (currentPage - 1) * PAGE_SIZE;
  const where = {
    role: "nasabah",

    status: {
      not: "disabled",
    },

    ...(query
      ? {
          OR: [
            {
              nama: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
            {
              email: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  /* ======================================================
     GET DATA ANGGOTA
  ====================================================== */
const [anggota, totalData] = await Promise.all([
  prisma.anggota.findMany({
    where,

    include: {
      simpanans: {
        include: {
          pembayaranSimpanan: true,
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
    where,
  }),
]);

  /* ======================================================
     FORMAT DATA
  ====================================================== */
  const formattedData =
    anggota.map((item) => {

      /* ==============================
         TOTAL WAJIB
      ============================== */
const totalWajib =
  item.simpanans
    .filter(
      (simpanan) =>
        simpanan.jenis_simpanan ===
        "WAJIB"
    )
    .reduce((total, simpanan) => {
      const berhasil =
        simpanan.pembayaranSimpanan
          .filter(
            (bayar) =>
              bayar.status ===
              "BERHASIL"
          )
          .reduce(
            (a, b) =>
              a +
              b.nominal_bayar,
            0
          );

      return total + berhasil;
    }, 0);

      /* ==============================
         TOTAL PENDIDIKAN
      ============================== */
const totalPendidikan =
  item.simpanans
    .filter(
      (simpanan) =>
        simpanan.jenis_simpanan ===
        "PENDIDIKAN"
    )
    .reduce((total, simpanan) => {
      const berhasil =
        simpanan.pembayaranSimpanan
          .filter(
            (bayar) =>
              bayar.status ===
              "BERHASIL"
          )
          .reduce(
            (a, b) =>
              a +
              b.nominal_bayar,
            0
          );

      return total + berhasil;
    }, 0);

      /* ==============================
         PENDING
      ============================== */
const pending =
  item.simpanans.reduce(
    (total, simpanan) => {
      const jumlahPending =
        simpanan.pembayaranSimpanan.filter(
          (bayar) =>
            bayar.status ===
            "MENUNGGU"
        ).length;

      return (
        total + jumlahPending
      );
    },
    0
  );

      return {
        id_anggota:
          item.id,

        nama:
          item.nama,

        email:
          item.email,

        total_wajib:
          totalWajib,

        total_pendidikan:
          totalPendidikan,

        pending,
      };
    });

  return (
    <>
      <Client
        data={formattedData}
        search={query}
      />
      <div className="bg-gray-50 px-6 pb-6">
        <div className="mx-auto max-w-7xl">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(Math.ceil(totalData / PAGE_SIZE), 1)}
            basePath="/admin/simpanan"
            totalItems={totalData}
            pageSize={PAGE_SIZE}
            searchParams={{
              q: query,
            }}
          />
        </div>
      </div>
    </>
  );
}
