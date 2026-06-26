import { prisma } from "@/lib/prisma";

import Client from "./client";

type Props = {
  params: {
    id_anggota: string;
  };
};

export default async function Page({
  params,
}: Props) {
  const idAnggota = Number(
    params.id_anggota
  );

  // =========================
  // AMBIL DATA ANGGOTA
  // =========================
  const anggota =
    await prisma.anggota.findUnique({
      where: {
        id: idAnggota,
      },

      include: {
        simpanans: {
          include: {
            pembayaran_simpanan: true,
          },
        },
      },
    });

  if (!anggota) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Anggota tidak ditemukan
      </div>
    );
  }

  // =========================
  // SIMPANAN WAJIB
  // =========================
  const simpananWajib =
    anggota.simpanans
      .filter(
        (item) =>
          item.jenis_simpanan ===
          "WAJIB"
      )
      .map((item) => ({
        id_simpanan:
          item.id_simpanan,

        status:
          item.status,

        pembayaran:
          item.pembayaran_simpanan
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

                tanggal_bayar:
                  bayar.tanggal_bayar,

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
      }));

  // =========================
  // SIMPANAN PENDIDIKAN
  // =========================
  const simpananPendidikan =
    anggota.simpanans
      .filter(
        (item) =>
          item.jenis_simpanan ===
          "PENDIDIKAN"
      )
      .map((item) => {
        const totalTerkumpul =
          item.pembayaran_simpanan
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

        return {
          id_simpanan:
            item.id_simpanan,

          tujuan:
            item.tujuan,

          target_dana:
            item.target_dana,

          jangka_waktu:
            item.jangka_waktu,

          status:
            item.status,

          total_terkumpul:
            totalTerkumpul,

          progress,

          pembayaran:
            item.pembayaran_simpanan
              .sort(
                (a, b) =>
                  new Date(
                    b.tanggal_bayar
                  ).getTime() -
                  new Date(
                    a.tanggal_bayar
                  ).getTime()
              )
              .map((bayar) => ({
                id:
                  bayar.id_pembayaran_simpanan,

                tanggal:
                  bayar.tanggal_bayar,

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
              })),
        };
      });

  // =========================
  // DATA ANGGOTA
  // =========================
  const dataAnggota = {
    id:
      anggota.id,

    nama:
      anggota.nama ?? "-",

    email:
      anggota.email,

    no_hp:
      anggota.no_hp,
  };

  // =========================
  // RETURN
  // =========================
  return (
    <Client
      anggota={
        dataAnggota
      }
      simpananWajib={
        simpananWajib
      }
      simpananPendidikan={
        simpananPendidikan
      }
    />
  );
}