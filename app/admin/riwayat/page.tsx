import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

import ClientPage from "./client";
import Pagination from "../component/Pagination";

const PAGE_SIZE = 10;

type Props = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function Page({
  searchParams,
}: Props) {
  const params = await searchParams;

  const currentPage = Math.max(
    Number(params?.page || 1),
    1
  );

  const skip =
    (currentPage - 1) * PAGE_SIZE;

  // =====================================================
  // CEK LOGIN
  // =====================================================

  const session =
    await getServerSession(
      authOptions
    );

  if (!session) {
    redirect("/auth/login");
  }

  // =====================================================
  // AMBIL DATA
  // =====================================================

  const [
    data,
    allData,
    totalData,
  ] = await Promise.all([

    // ===================================================
    // 1. DATA UNTUK TABEL / PAGINATION
    // ===================================================

    prisma.riwayat_transaksi.findMany({
      include: {
        anggota: true,
      },

      orderBy: {
        tanggal: "desc",
      },

      skip,

      take: PAGE_SIZE,
    }),

    // ===================================================
    // 2. SELURUH DATA UNTUK SUMMARY + PDF
    // ===================================================

    prisma.riwayat_transaksi.findMany({
      include: {
        anggota: true,
      },

      orderBy: {
        tanggal: "desc",
      },
    }),

    // ===================================================
    // 3. TOTAL DATA UNTUK PAGINATION
    // ===================================================

    prisma.riwayat_transaksi.count(),

  ]);

  // =====================================================
  // KIRIM KE CLIENT
  // =====================================================

  return (
    <>
      <ClientPage
        data={data}
        allData={allData}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={Math.max(
          Math.ceil(
            totalData / PAGE_SIZE
          ),
          1
        )}
        basePath="/admin/riwayat"
        totalItems={totalData}
        pageSize={PAGE_SIZE}
      />
    </>
  );
}