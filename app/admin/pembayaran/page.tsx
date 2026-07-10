import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

import ClientPage from "./client";
import Pagination from "../component/Pagination";

const PAGE_SIZE = 9;

type Props = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function Page({
  searchParams,
}: Props) {
  const params = await searchParams;
  const currentPage = Math.max(Number(params?.page || 1), 1);
  const skip = (currentPage - 1) * PAGE_SIZE;

  // cek login
  const session =
    await getServerSession(
      authOptions
    );

  if (!session) {
    redirect("/auth/login");
  }

  const [
    pembayaranPinjaman,
    totalPinjaman,
    pembayaranSimpanan,
    totalSimpanan,
  ] = await Promise.all([
    prisma.pembayaran.findMany({
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
      skip,
      take: PAGE_SIZE,
    }),
    prisma.pembayaran.count(),
    prisma.pembayaran_simpanan.findMany({
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
      skip,
      take: PAGE_SIZE,
    }),
    prisma.pembayaran_simpanan.count(),
  ]);

  return (
    <>
      <ClientPage
        pinjaman={pembayaranPinjaman}
        simpanan={pembayaranSimpanan}
      />
      <div className="bg-gray-50 px-5 pb-10 md:px-10">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.max(
            Math.ceil(Math.max(totalPinjaman, totalSimpanan) / PAGE_SIZE),
            1
          )}
          basePath="/admin/pembayaran"
          totalItems={Math.max(totalPinjaman, totalSimpanan)}
          pageSize={PAGE_SIZE}
        />
      </div>
    </>
  );
}
