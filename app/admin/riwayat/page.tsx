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

  // ambil riwayat transaksi
  const data =
    await prisma.riwayatTransaksi.findMany({
      include: {
        anggota: true,
      },

      orderBy: {
        tanggal: "desc",
      },
    });

  return (
    <ClientPage
      data={data}
    />
  );
}