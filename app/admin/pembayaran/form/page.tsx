import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

import ClientPage from "../form/client";

export default async function Page() {

  // cek login
  const session =
    await getServerSession(
      authOptions
    );

  if (!session) {
    redirect("/auth/login");
  }

  // ambil semua jadwal yang belum lunas
  const data =
    await prisma.jadwal_angsuran.findMany({
      where: {
        status:
          "PENDING",
      },

      include: {
        peminjaman: {
          include: {
            anggota: true,
          },
        },
      },

      orderBy: {
        jatuh_tempo:
          "asc",
      },
    });

  return (
    <ClientPage
      data={data}
    />
  );
}