import { prisma } from "@/lib/prisma";
import ClientPage from "./ClientPage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DataNasabahPage() {
  const nasabah = await prisma.anggota.findMany({
    where: {
      role: "nasabah",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      peminjaman: true,
    },
  });

  return <ClientPage nasabah={nasabah} />;
}