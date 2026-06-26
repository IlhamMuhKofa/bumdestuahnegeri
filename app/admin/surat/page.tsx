import { prisma } from "@/lib/prisma";
import Client from "./client";

export default async function SuratPage() {
  const surat =
    await prisma.suratTemplate.findUnique({
      where: {
        kode: "SP2K_PENCAIRAN",
      },
      select: {
        id_surat: true,
        kode: true,
        nama_file: true,
        file_url: true,
      },
    });

  return (
    <Client
      surat={surat}
    />
  );
}
