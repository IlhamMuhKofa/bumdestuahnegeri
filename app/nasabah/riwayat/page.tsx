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

  const userId = Number(
    (session.user as any).id
  );

  // ambil riwayat transaksi user
  const data =
    await prisma.riwayat_transaksi.findMany({
      where: {
        id_anggota:
          userId,
      },

      orderBy: {
        tanggal:
          "desc",
      },
    });

  return (
    <ClientPage
      data={data}
    />
  );
}