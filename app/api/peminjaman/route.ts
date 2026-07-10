import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createNotifikasi } from "@/lib/notifikasi";
import { uploadImage, uploadPdf } from "@/lib/storage";

type SessionUserWithId = {
  id?: string | number;
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as SessionUserWithId | undefined;

    if (!sessionUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔥 GANTI JSON → FORM DATA
    const formData = await req.formData();

    const jumlahPinjaman = formData.get("jumlahPinjaman");
    const pekerjaan = formData.get("pekerjaan");
    const penghasilan = formData.get("penghasilan");
    const jenisAgunan = formData.get("jenisAgunan");
    const rencanaUsaha = formData.get("rencanaUsaha");
    const jangkaWaktu = formData.get("jangkaWaktu");

    const fotoAgunan = formData.get("fotoAgunan") as File;
    const fotoSurat = formData.get("fotoSurat") as File;

    const fotoAgunanPath =
      fotoAgunan && fotoAgunan.size > 0
        ? await uploadImage(fotoAgunan, "agunan")
        : null;

    const fotoSuratPath =
      fotoSurat && fotoSurat.size > 0
        ? await uploadPdf(fotoSurat, "surat")
        : null;

    console.log("=== MASUK API PEMINJAMAN ===");

const existing = await prisma.peminjaman.findFirst({
  where: {
    id_anggota: Number(sessionUser.id),
    status: {
      in: ["PENDING", "APPROVED"],
    },
  },
});

    console.log("EXISTING:", existing);

    if (existing) {
      return NextResponse.json(
        {
          error:
            "Anda masih memiliki pinjaman yang sedang diproses atau masih aktif. Silakan selesaikan pinjaman tersebut sebelum mengajukan pinjaman baru.",
        },
        {
          status: 400,
        }
      );
    }

    console.log("LANJUT CREATE");

    // 🔥 SIMPAN KE DB
    const peminjaman = await prisma.peminjaman.create({
      data: {
        id_anggota: Number(sessionUser.id),
        total_pinjaman: Number(jumlahPinjaman),
        status: "PENDING",
        jangka_waktu: Number(jangkaWaktu),
      },
    });

    // 🔥 CEK APAKAH SUDAH ADA PENGAJUAN PINJAMAN YANG PENDING



    await prisma.detail_peminjaman.create({
      data: {
        id_peminjaman: peminjaman.id_peminjaman,
        nama: "Pengajuan Pinjaman",
        jenis: jenisAgunan as string,
        jumlah: Number(jumlahPinjaman),
        nilai_perolehan: Number(penghasilan),
        keterangan: rencanaUsaha as string,
        jangka_waktu: Number(jangkaWaktu),
        foto_agunan: fotoAgunanPath,
        foto_surat: fotoSuratPath,
      },
    });

    await createNotifikasi({
      role_tujuan: "admin",
      isi: "Nasabah mengajukan pinjaman baru",
      jenis: "PENGAJUAN_PINJAMAN",
      url: `/admin/pinjaman/${peminjaman.id_peminjaman}`,
    });

    return NextResponse.json({
      success: true,
      data: peminjaman,
    });

  } catch (error) {
    console.error("ERROR UPLOAD:", error);
    return NextResponse.json({ error: "Gagal simpan" }, { status: 500 });
  }
}
