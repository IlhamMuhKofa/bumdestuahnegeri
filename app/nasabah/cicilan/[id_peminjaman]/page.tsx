import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

import ClientPage from "./client";

type Props = {
  params: Promise<{
    id_peminjaman: string;
  }>;
};

export default async function Page({
  params,
}: Props) {

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
    id_peminjaman,
  } = await params;

  // cek apakah pinjaman milik user
  const peminjaman =
    await prisma.peminjaman.findFirst({
      where: {
        id_peminjaman:
          Number(
            id_peminjaman
          ),

        id_anggota:
          userId,
      },
    });

  if (!peminjaman) {
    redirect(
      "/nasabah/cicilan"
    );
  }

  const data =
    await prisma.jadwal_angsuran.findMany({
      where: {
        id_peminjaman:
          Number(
            id_peminjaman
          ),
      },

      include: {
        pembayaran: {
          orderBy: {
            tanggal_bayar:
              "desc",
          },

          take: 1,
        },
      },

      orderBy: {
        cicilan_ke:
          "asc",
      },
    });

  return (
    <ClientPage
      data={data}
    />
  );
}