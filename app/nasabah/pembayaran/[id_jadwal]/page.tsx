import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

import ClientPage from "./client";

type Props = {
  params: Promise<{
    id_jadwal: string;
  }>;
};

export default async function Page({
  params,
}: Props) {

  // cek session login
  const session =
    await getServerSession(
      authOptions
    );

  if (!session) {
    redirect("/auth/login");
  }

  const userId = Number(
    (session.user as any).id
  );

  const {
    id_jadwal,
  } = await params;

  // ambil jadwal + validasi milik user
  const jadwal =
    await prisma.jadwal_angsuran.findFirst({
      where: {
        id_jadwal:
          Number(
            id_jadwal
          ),

        peminjaman: {
          id_anggota:
            userId,
        },
      },

      include: {
        peminjaman: true,

        pembayaran: {
          orderBy: {
            tanggal_bayar:
              "desc",
          },

          take: 1,
        },
      },
    });

  // jika tidak ditemukan
  if (!jadwal) {
    redirect(
      "/nasabah/cicilan"
    );
  }

  // kalau sudah lunas
  if (
    jadwal.status ===
    "LUNAS"
  ) {
    redirect(
      `/nasabah/cicilan/${jadwal.id_peminjaman}`
    );
  }

  // kalau sudah ada pembayaran menunggu
  const latestPayment =
    jadwal.pembayaran?.[0];

  if (
    latestPayment &&
    [
      "MENUNGGU",
      "BERHASIL",
    ].includes(
      latestPayment.status
    )
  ) {
    redirect(
      `/nasabah/cicilan/${jadwal.id_peminjaman}`
    );
  }

  return (
    <ClientPage
      jadwal={jadwal}
    />
  );
}