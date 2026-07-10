import { prisma } from "@/lib/prisma";
import ClientPage from "../[id_pembayaran]/client";

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
          },
        },
      },
    });

  if (!pembayaran) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Data pembayaran tidak ditemukan
      </div>
    );
  }

  if (
    pembayaran.simpanan.jenis_simpanan !==
    "WAJIB"
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Data bukan simpanan wajib
      </div>
    );
  }

  return (
    <ClientPage
      pembayaran={pembayaran}
    />
  );
}