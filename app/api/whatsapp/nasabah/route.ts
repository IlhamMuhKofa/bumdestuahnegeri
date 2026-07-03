import { NextResponse } from "next/server";
import { canAccessWhatsAppApi } from "@/lib/whatsapp-auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  if (!(await canAccessWhatsAppApi(req))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const jadwal = await prisma.jadwalAngsuran.findMany({
    where: {
      status: {
        not: "LUNAS",
      },
      peminjaman: {
        anggota: {
          no_hp: {
            not: null,
          },
        },
      },
    },
    include: {
      peminjaman: {
        include: {
          anggota: true,
        },
      },
    },
    orderBy: {
      jatuh_tempo: "asc",
    },
  });

  const seen = new Set<number>();
  const items = jadwal
    .filter((item) => {
      const idAnggota = item.peminjaman.id_anggota;

      if (seen.has(idAnggota)) return false;

      seen.add(idAnggota);
      return true;
    })
    .map((item) => ({
      idAnggota: item.peminjaman.id_anggota,
      idJadwal: item.id_jadwal,
      nama: item.peminjaman.anggota.nama || "Nasabah",
      noHp: item.peminjaman.anggota.no_hp || "",
      cicilanKe: item.cicilan_ke,
      jumlahTagihan: item.jumlah_tagihan,
      jatuhTempo: item.jatuh_tempo,
    }));

  return NextResponse.json({
    items,
  });
}
