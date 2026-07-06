import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

import ClientPage from "./client";

export default async function Page() {

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
  // PEMINJAMAN
  // =========================
  const peminjaman =
    await prisma.peminjaman.findMany({
      where: {
        id_anggota: userId,

        status: {
          in: [
            "ACTIVE",
            "LUNAS",
          ],
        },
      },

      include: {
        jadwal_angsuran: {
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
        },
      },

      orderBy: {
        tanggal_pengajuan:
          "desc",
      },
    });

  // =========================
  // SURVEY
  // =========================
  const survey =
    await prisma.jadwal_survey.findMany({
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
      peminjaman={
        peminjaman
      }
      survey={survey}
    />
  );
}