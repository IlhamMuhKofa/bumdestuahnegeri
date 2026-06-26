import { prisma } from "@/lib/prisma";

type NotifPayload = {
  id_anggota?: number;
  role_tujuan: "admin" | "nasabah";
  isi: string;
  url?: string;
  jenis: string;
};

export async function createNotifikasi({
  id_anggota,
  role_tujuan,
  isi,
  url,
  jenis,
}: NotifPayload) {
  return await prisma.notifikasi.create({
    data: {
      id_anggota,
      role_tujuan,
      isi_notifikasi: isi,
      url_tujuan: url,
      jenis_notifikasi: jenis,
    },
  });
}