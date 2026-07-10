import { prisma } from "@/lib/prisma";
import ClientPage from "./client";

type Props = {
  params: Promise<{
    id_pembayaran: string;
  }>;
};

export default async function Page({
  params,
}: Props) {

  const {
    id_pembayaran,
  } = await params;

  const pembayaran =
    await prisma.pembayaran_simpanan.findUnique({
      where: {
        id_pembayaran_simpanan:
          Number(id_pembayaran),
      },

      include: {
        simpanan: {
          include: {
            anggota: true,
            pembayaranSimpanan: true,
          },
        },
      },
    });

  if (!pembayaran) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Pembayaran tidak ditemukan
      </div>
    );
  }

  if (
    pembayaran.simpanan.jenis_simpanan !==
    "PENDIDIKAN"
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Data bukan simpanan pendidikan
      </div>
    );
  }

  const totalTerkumpul =
    pembayaran.simpanan.pembayaranSimpanan
      .filter(
        (x) =>
          x.status === "BERHASIL"
      )
      .reduce(
        (a, b) =>
          a + b.nominal_bayar,
        0
      );

  const progress =
    pembayaran.simpanan.target_dana
      ? Math.min(
          Math.round(
            (totalTerkumpul /
              pembayaran.simpanan.target_dana) *
              100
          ),
          100
        )
      : 0;

  return (
    <ClientPage
      pembayaran={pembayaran}
      totalTerkumpul={
        totalTerkumpul
      }
      progress={progress}
    />
  );
}