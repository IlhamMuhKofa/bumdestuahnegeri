import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import fs from "fs";
import path from "path";
import { createNotifikasi } from "@/lib/notifikasi";

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

    // 📁 folder upload
    const uploadDir = path.join(process.cwd(), "public/uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 🔥 HANDLE FOTO AGUNAN
    let fotoAgunanPath: string | null = null;
    if (fotoAgunan && fotoAgunan.size > 0) {
      const bytes = await fotoAgunan.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = Date.now() + "-" + fotoAgunan.name;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, buffer);
      fotoAgunanPath = "/uploads/" + fileName;
    }

    // 🔥 HANDLE FOTO SURAT
    let fotoSuratPath: string | null = null;
    if (fotoSurat && fotoSurat.size > 0) {
      const bytes = await fotoSurat.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = Date.now() + "-surat-" + fotoSurat.name;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, buffer);
      fotoSuratPath = "/uploads/" + fileName;
    }

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

    const existing = await prisma.peminjaman.findFirst({
  where: {
    id_anggota: Number(sessionUser.id),
    status: "PENDING",
  },
});

if (existing) {
  return NextResponse.json(
    {
      error:
        "Masih ada pengajuan pinjaman yang sedang diproses.",
    },
    {
      status: 400,
    }
  );
}

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
