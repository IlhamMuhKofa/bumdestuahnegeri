import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

import ClientPage from "./client";

export default async function Page() {

  // cek login
  const session =
    await getServerSession(
      authOptions
    );

  if (!session) {
    redirect("/auth/login");
  }

  const pembayaranPinjaman =
    await prisma.pembayaran.findMany({
      include: {
        jadwal: {
          include: {
            peminjaman: {
              include: {
                anggota: true,
              },
            },
          },
        },
      },

      orderBy: {
        tanggal_bayar:
          "desc",
      },
    });

  const pembayaranSimpanan =
    await prisma.pembayaranSimpanan.findMany({
      include: {
        simpanan: {
          include: {
            anggota: true,
          },
        },
      },

      orderBy: {
        tanggal_bayar:
          "desc",
      },
    });

  return (
    <ClientPage
      pinjaman={pembayaranPinjaman}
      simpanan={pembayaranSimpanan}
    />
  );
}
