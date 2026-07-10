import { prisma } from "@/lib/prisma";
import Client from "./client";

type Props = {
  params: Promise<{
    id_anggota: string;
    id_peminjaman: string;
  }>;
};

export default async function Page({
  params,
}: Props) {
  const {
    id_anggota,
    id_peminjaman,
  } = await params;

  const data = await prisma.peminjaman.findUnique({
    where: {
      id_peminjaman: Number(id_peminjaman),
    },
    include: {
      anggota: true,
      jadwal: {
        orderBy: {
          cicilan_ke: "asc",
        },
      },
    },
  });

  if (!data) {
    return <div>Data tidak ditemukan</div>;
  }

  return <Client data={data} />;
}