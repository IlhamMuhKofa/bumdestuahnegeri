import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

import ClientPage from "./client";

export default async function Page() {

  // =========================
  // CEK LOGIN
  // =========================
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

  // =========================
  // AMBIL JADWAL SURVEY
  // =========================
  const data =
    await prisma.jadwalSurvey.findMany({

      where: {
        peminjaman: {
          id_anggota:
            userId,
        },
      },

      include: {
        peminjaman: true,
      },

      orderBy: {
        tanggal_survey:
          "desc",
      },
    });

  return (
    <ClientPage
      data={data}
    />
  );
}