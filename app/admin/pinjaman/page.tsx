import { prisma } from "@/lib/prisma";
import ClientPage from "./client";

export default async function Page() {
  const data = await prisma.peminjaman.findMany({
    include: {
      detail_peminjaman: true,
      anggota: true,
    },
    orderBy: {
      tanggal_pengajuan: "desc",
    },
  });

  // ✅ FORMAT DI SERVER
  const formattedData = data.map((item) => ({
    ...item,
    tanggal_formatted: new Date(item.tanggal_pengajuan).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    waktu_formatted: new Date(item.tanggal_pengajuan).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    jumlah_formatted: item.total_pinjaman.toLocaleString("id-ID"),
  }));

  return <ClientPage data={formattedData} />;
}