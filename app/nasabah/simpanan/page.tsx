import ClientPage from "./client";

import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Page() {

  // 🔐 SESSION
  const session =
    await getServerSession(
      authOptions
    );

  const user = session?.user as
    | {
      id?: string;
    }
    | undefined;

  if (!user?.id) {
    return null;
  }

  const idAnggota = Number(
    user.id
  );

  // =========================
  // AMBIL DATA
  // =========================
  const simpanan =
    await prisma.simpanan.findMany({
      where: {
        id_anggota: idAnggota,
      },

      include: {
        pembayaranSimpanan: true,
      },

      orderBy: {
        created_at: "desc",
      },
    });

  // =========================
  // SIMPANAN WAJIB
  // =========================
const simpananWajib =
  simpanan
    .filter(
      (item) =>
        item.jenis_simpanan ===
        "WAJIB"
    )
    .map((item) => {

      const totalTerkumpul =
        item.pembayaranSimpanan
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

      return {
        id_simpanan:
          item.id_simpanan,

        nominal:
          item.nominal,

        tanggal_tagihan:
          item.tanggal_tagihan,

        status:
          item.status,

        total_terkumpul:
          totalTerkumpul,

        pembayaran:
          item.pembayaranSimpanan
.sort(
  (a, b) =>
    (a.bulan_ke ?? 0) -
    (b.bulan_ke ?? 0)
)
.map((bayar) => {

  const tanggalTagihan =
    new Date(item.tanggal_tagihan);

  tanggalTagihan.setMonth(
    tanggalTagihan.getMonth() +
      ((bayar.bulan_ke ?? 1) - 1)
  );

  return {
    id:
      bayar.id_pembayaran_simpanan,

    bulan_ke:
      bayar.bulan_ke,

    tanggal:
      tanggalTagihan,

    nominal:
      bayar.nominal_bayar,

    status:
      bayar.status,

    metode:
      bayar.metode_bayar,

    bukti_bayar:
      bayar.bukti_bayar,

    catatan:
      bayar.catatan,
  };
})
      };
    });

  // =========================
  // SIMPANAN PENDIDIKAN
  // =========================
  const simpananPendidikan =
    simpanan
      .filter(
        (item) =>
          item.jenis_simpanan ===
          "PENDIDIKAN"
      )
      .map((item) => {

        // =========================
        // SORT PEMBAYARAN TERBARU
        // =========================
        const pembayaranSorted =
          [
            ...item.pembayaranSimpanan,
          ].sort(
            (a, b) =>
              new Date(
                b.tanggal_bayar
              ).getTime() -
              new Date(
                a.tanggal_bayar
              ).getTime()
          );

        // =========================
        // PEMBAYARAN BERHASIL
        // =========================
        const pembayaranBerhasil =
          pembayaranSorted.filter(
            (bayar) =>
              bayar.status ===
              "BERHASIL"
          );

        // =========================
        // TOTAL TERKUMPUL
        // =========================
        const totalTerkumpul =
          pembayaranBerhasil.reduce(
            (total, bayar) =>
              total +
              bayar.nominal_bayar,
            0
          );

        // =========================
        // REKOMENDASI SETORAN
        // =========================
        const rekomendasiSetoran =
          item.target_dana &&
            item.jangka_waktu
            ? Math.ceil(
              item.target_dana /
              item.jangka_waktu
            )
            : 0;

        // =========================
        // PROGRESS
        // =========================
        const progress =
          item.target_dana
            ? Math.min(
              Math.round(
                (totalTerkumpul /
                  item.target_dana) *
                100
              ),
              100
            )
            : 0;

        // =========================
        // LAST UPDATE
        // =========================
        const lastUpdate =
          pembayaranSorted.length >
            0
            ? pembayaranSorted[0]
              ?.tanggal_bayar
            : null;

        return {
          id_simpanan:
            item.id_simpanan,

          created_at:
            item.created_at,

          tujuan:
            item.tujuan,

          target_dana:
            item.target_dana,

          jangka_waktu:
            item.jangka_waktu,

          rekomendasi_setoran:
            rekomendasiSetoran,

          total_terkumpul:
            totalTerkumpul,

          progress,

          last_update:
            lastUpdate,

          pembayaran:
            pembayaranSorted.map(
              (bayar) => ({
                id:
                  bayar.id_pembayaran_simpanan,

                tanggal:
                  bayar.tanggal_bayar,

                nominal:
                  bayar.nominal_bayar,

                catatan:
                  bayar.catatan,

                status:
                  bayar.status,

                metode:
                  bayar.metode_bayar,

                bukti_bayar:
                  bayar.bukti_bayar,
              })
            ),
        };
      });

  // =========================
  // RETURN
  // =========================
  return (
    <ClientPage
      dataWajib={
        simpananWajib
      }
      dataPendidikan={
        simpananPendidikan
      }
      idAnggota={idAnggota}
    />
  );
}