import { prisma } from "@/lib/prisma";
import FormBayar from "./client";

type Props = {
  params: {
    id_simpanan: string;
  };
};

export default async function Page({
  params,
}: Props) {
  const idSimpanan = Number(
    params.id_simpanan
  );

  const rekening =
    await prisma.rekeningpembayaran.findFirst({
      where: {
        is_active: true,
      },
    });

  const simpanan =
    await prisma.simpanan.findUnique({
      where: {
        id_simpanan:
          idSimpanan,
      },

      include: {
        pembayaranSimpanan: true,
      },
    });

  // =========================
  // VALIDASI SIMPANAN
  // =========================
  if (!simpanan) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Simpanan tidak ditemukan
      </div>
    );
  }

  // =========================
  // TOTAL TERKUMPUL
  // =========================
  const totalTerkumpul =
    simpanan.pembayaranSimpanan
      .filter(
        (x) =>
          x.status ===
          "BERHASIL"
      )
      .reduce(
        (a, b) =>
          a + b.nominal_bayar,
        0
      );

  // =========================
  // VALIDASI JENIS
  // =========================
  if (
    simpanan.jenis_simpanan !==
    "PENDIDIKAN"
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Data bukan tabungan pendidikan
      </div>
    );
  }

  // =========================
  // VALIDASI REKENING
  // =========================
  if (!rekening) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-lg rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">
            Rekening Belum Tersedia
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            Admin belum mengatur rekening pembayaran aktif.
            Silakan hubungi admin BUMDes terlebih dahulu.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">

        <FormBayar
          idSimpanan={
            idSimpanan
          }
          rekening={rekening}
          simpanan={{
            ...simpanan,
            total_terkumpul:
              totalTerkumpul,
          }}
        />

      </div>
    </div>
  );
}