import { prisma } from "@/lib/prisma";
import Client from "./client";

export default async function Page() {

  // ================= NASABAH =================
  const dataRaw =
    await prisma.peminjaman.findMany({
      where: {
        status: {
          in: [
            "APPROVED",
            "ACTIVE",
            "LUNAS",
          ],
        },
      },

      include: {
        anggota: true,
      },

      orderBy: {
        tanggal_pengajuan:
          "desc",
      },
    });

  // ================= GROUPING =================
  const grouped: any = {};

  dataRaw.forEach((item) => {
    const id =
      item.id_anggota;

    if (!grouped[id]) {
      grouped[id] = {
        id_anggota: id,

        nama:
          item.anggota
            ?.nama ||
          "Tanpa Nama",

        total_pengajuan: 0,

        terakhir:
          item.tanggal_pengajuan,
      };
    }

    grouped[
      id
    ].total_pengajuan += 1;

    if (
      new Date(
        item.tanggal_pengajuan
      ) >
      new Date(
        grouped[id]
          .terakhir
      )
    ) {
      grouped[
        id
      ].terakhir =
        item.tanggal_pengajuan;
    }
  });

  const nasabah =
    Object.values(
      grouped
    );

  // ================= JADWAL =================
  const jadwal =
    await prisma.jadwal_angsuran.findMany({
      include: {
        peminjaman: {
          include: {
            anggota: true,
          },
        },
      },

      orderBy: {
        jatuh_tempo:
          "asc",
      },
    });

  return (
    <Client
      nasabah={nasabah}
      jadwal={jadwal}
    />
  );
}