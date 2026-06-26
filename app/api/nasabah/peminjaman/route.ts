import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { createNotifikasi } from "@/lib/notifikasi";

type SessionUserWithId = {
  id?: string | number;
};

// ✅ GET DATA NASABAH
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const sessionUser = session?.user as SessionUserWithId | undefined;

    if (!sessionUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(sessionUser.id);

    const data = await prisma.peminjaman.findMany({
      where: {
        id_anggota: userId,
      },
      include: {
        detail: true,
      },
      orderBy: {
        tanggal_pengajuan: "desc",
      },
    });

    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

// ✅ POST PENGAJUAN
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    const sessionUser = session?.user as SessionUserWithId | undefined;

    if (!sessionUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const {
      jumlahPinjaman,
      pekerjaan,
      penghasilan,
      jenisAgunan,
      rencanaUsaha,
      jangkaWaktu,
      fotoAgunan,
      fotoSurat,
    } = body;

    const userId = Number(sessionUser.id);

    const peminjaman = await prisma.peminjaman.create({
      data: {
        id_anggota: userId,
        status: "Menunggu",
        total_pinjaman: Number(jumlahPinjaman),
        jangka_waktu: Number(jangkaWaktu),

        detail: {
          create: [
            {
              nama: pekerjaan,
              jenis: jenisAgunan,
              jumlah: Number(penghasilan),
              nilai_perolehan: Number(jumlahPinjaman),
              keterangan: rencanaUsaha,
              jangka_waktu: Number(jangkaWaktu),
              foto_agunan: fotoAgunan || null,
              foto_surat: fotoSurat || null,
            },
          ],
        },
      },
    });

    await createNotifikasi({
      role_tujuan: "admin",
      isi: "Nasabah mengajukan pinjaman baru",
      jenis: "PENGAJUAN_PINJAMAN",
      url: `/admin/pinjaman/${peminjaman.id_peminjaman}`,
    });

    return NextResponse.json({ success: true, data: peminjaman });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
