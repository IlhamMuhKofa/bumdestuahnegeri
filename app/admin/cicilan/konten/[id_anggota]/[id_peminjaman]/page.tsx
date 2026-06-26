import { prisma } from "@/lib/prisma";
import Client from "./client";

export default async function Page({ params }: any) {
  const data = await prisma.peminjaman.findUnique({
    where: {
      id_peminjaman: Number(params.id_peminjaman),
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