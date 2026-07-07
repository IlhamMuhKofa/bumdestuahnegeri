import { prisma } from "@/lib/prisma";

import Client from "./client";

export default async function Page() {

  /* ======================================================
     GET DATA ANGGOTA
  ====================================================== */
const anggota = await prisma.anggota.findMany({
  where: {
    role: "nasabah",

    status: {
      not: "disabled",
    },

    // peminjaman: {
    //   some: {
    //     status: "APPROVED",
    //   },
    // },
  },

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
});

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
    <Client
      data={formattedData}
    />
  );
}