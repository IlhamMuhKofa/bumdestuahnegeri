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

  // ambil riwayat transaksi
  const [data, totalData] =
    await Promise.all([
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
      prisma.riwayat_transaksi.count(),
    ]);

  return (
    <>
      <ClientPage
        data={data}
      />
      <div className="bg-gray-50 px-6 pb-6">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.max(Math.ceil(totalData / PAGE_SIZE), 1)}
          basePath="/admin/riwayat"
          totalItems={totalData}
          pageSize={PAGE_SIZE}
        />
      </div>
    </>
  );
}
