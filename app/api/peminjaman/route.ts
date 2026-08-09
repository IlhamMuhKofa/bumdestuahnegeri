import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createNotifikasi } from "@/lib/notifikasi";
import { uploadImage, uploadPdf } from "@/lib/storage";

type SessionUserWithId = {
  id?: string | number;
  role?: string;
};

export const dynamic = "force-dynamic";

/* =========================================================
   POST
   Membuat pengajuan pinjaman baru
========================================================= */

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    const sessionUser = session?.user as
      | SessionUserWithId
      | undefined;

    if (!sessionUser?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = Number(sessionUser.id);

    /* =====================================================
       AMBIL FORM DATA
    ===================================================== */

    const formData = await req.formData();

    console.log("========== DEBUG FORM DATA ==========");

for (const [key, value] of formData.entries()) {
  if (value instanceof File) {
    console.log(key, {
      name: value.name,
      type: value.type,
      size: value.size,
    });
  } else {
    console.log(key, value);
  }
}

console.log("====================================");

    const jumlahPinjaman = formData.get("jumlahPinjaman");
    const pekerjaan = formData.get("pekerjaan");
    const penghasilan = formData.get("penghasilan");
    const jenis = formData.get("jenis");
    const rencanaUsaha = formData.get("rencanaUsaha");
    const jangkaWaktu = formData.get("jangkaWaktu");

    const fotoAgunan = formData.get("fotoAgunan");
    const fotoSurat = formData.get("fotoSurat");

    

    /* =====================================================
       DEBUG FORM DATA
    ===================================================== */

    console.log("========== FORM PEMINJAMAN ==========");
    console.log("jumlahPinjaman :", jumlahPinjaman);
    console.log("pekerjaan      :", pekerjaan);
    console.log("penghasilan    :", penghasilan);
    console.log("jenis          :", jenis);
    console.log("rencanaUsaha   :", rencanaUsaha);
    console.log("jangkaWaktu    :", jangkaWaktu);

    console.log(
      "fotoAgunan     :",
      fotoAgunan instanceof File
        ? fotoAgunan.name
        : "TIDAK ADA"
    );

    console.log(
      "fotoSurat      :",
      fotoSurat instanceof File
        ? fotoSurat.name
        : "TIDAK ADA"
    );

    console.log("====================================");

    /* =====================================================
       VALIDASI FIELD
    ===================================================== */

    if (!jumlahPinjaman) {
      return NextResponse.json(
        {
          error: "Jumlah pinjaman wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (!pekerjaan) {
      return NextResponse.json(
        {
          error: "Pekerjaan wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (!penghasilan) {
      return NextResponse.json(
        {
          error: "Penghasilan wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (!jenis) {
      return NextResponse.json(
        {
          error: "Jenis agunan wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (!rencanaUsaha) {
      return NextResponse.json(
        {
          error: "Rencana usaha wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (!jangkaWaktu) {
      return NextResponse.json(
        {
          error: "Jangka waktu wajib diisi.",
        },
        { status: 400 }
      );
    }

    /* =====================================================
       VALIDASI FOTO AGUNAN
    ===================================================== */

    if (!(fotoAgunan instanceof File)) {
      return NextResponse.json(
        {
          error: "Foto agunan wajib diupload.",
        },
        { status: 400 }
      );
    }

    if (fotoAgunan.size <= 0) {
      return NextResponse.json(
        {
          error: "Foto agunan tidak valid.",
        },
        { status: 400 }
      );
    }

    /* =====================================================
       VALIDASI SURAT
    ===================================================== */

    if (!(fotoSurat instanceof File)) {
      return NextResponse.json(
        {
          error: "Surat usaha wajib diupload.",
        },
        { status: 400 }
      );
    }

    if (fotoSurat.size <= 0) {
      return NextResponse.json(
        {
          error: "Surat usaha tidak valid.",
        },
        { status: 400 }
      );
    }

    /* =====================================================
       CEK PINJAMAN AKTIF / PENDING
    ===================================================== */

    const existing =
      await prisma.peminjaman.findFirst({
        where: {
          id_anggota: userId,
          status: {
            in: ["PENDING", "APPROVED"],
          },
        },
      });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "Anda masih memiliki pinjaman yang sedang diproses atau masih aktif. Silakan selesaikan pinjaman tersebut sebelum mengajukan pinjaman baru.",
        },
        { status: 400 }
      );
    }

    /* =====================================================
       UPLOAD KE SUPABASE
    ===================================================== */

    let fotoAgunanPath: string | null = null;
    let fotoSuratPath: string | null = null;

    try {
      fotoAgunanPath =
        await uploadImage(
          fotoAgunan,
          "agunan"
        );

      fotoSuratPath =
        await uploadPdf(
          fotoSurat,
          "surat"
        );

      console.log(
        "UPLOAD AGUNAN:",
        fotoAgunanPath
      );

      console.log(
        "UPLOAD SURAT:",
        fotoSuratPath
      );
    } catch (uploadError) {
      console.error(
        "SUPABASE UPLOAD ERROR:",
        uploadError
      );

      return NextResponse.json(
        {
          error:
            "Gagal mengupload berkas ke penyimpanan.",
        },
        { status: 500 }
      );
    }

    /* =====================================================
       TRANSACTION DATABASE
    ===================================================== */

    const result =
      await prisma.$transaction(
        async (tx) => {
          /* ============================
             CREATE PEMINJAMAN
          ============================ */

          const peminjaman =
            await tx.peminjaman.create({
              data: {
                id_anggota: userId,

                total_pinjaman:
                  Number(jumlahPinjaman),

                status: "PENDING",

                jangka_waktu:
                  Number(jangkaWaktu),
              },
            });

          /* ============================
             CREATE DETAIL PEMINJAMAN
          ============================ */

          const detail =
            await tx.detail_peminjaman.create({
              data: {
                id_peminjaman:
                  peminjaman.id_peminjaman,

                nama:
                  String(pekerjaan),

                jenis:
                  String(jenis),

                jumlah:
                  Number(jumlahPinjaman),

                nilai_perolehan:
                  Number(penghasilan),

                keterangan:
                  String(rencanaUsaha),

                jangka_waktu:
                  Number(jangkaWaktu),

                foto_agunan:
                  fotoAgunanPath,

                foto_surat:
                  fotoSuratPath,
              },
            });

          return {
            peminjaman,
            detail,
          };
        }
      );

    /* =====================================================
       NOTIFIKASI ADMIN
    ===================================================== */

    try {
      await createNotifikasi({
        role_tujuan: "admin",

        isi:
          "Nasabah mengajukan pinjaman baru",

        jenis:
          "PENGAJUAN_PINJAMAN",

        url:
          `/admin/pinjaman/${result.peminjaman.id_peminjaman}`,
      });
    } catch (notificationError) {
      console.error(
        "GAGAL MEMBUAT NOTIFIKASI ADMIN:",
        notificationError
      );

      // Notification tidak boleh menggagalkan
      // pengajuan pinjaman.
    }

    /* =====================================================
       RESPONSE BERHASIL
    ===================================================== */

    return NextResponse.json(
      {
        success: true,

        message:
          "Pengajuan pinjaman berhasil disimpan.",

        data: result.peminjaman,

        detail: result.detail,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "ERROR API PEMINJAMAN:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Gagal menyimpan pengajuan pinjaman.",
      },
      {
        status: 500,
      }
    );
  }
}


/* =========================================================
   GET
   Mengambil data pengajuan

   Admin  → semua pengajuan
   Nasabah → pengajuan miliknya
========================================================= */

export async function GET() {
  try {
    const session =
      await getServerSession(authOptions);

    const sessionUser = session?.user as
      | SessionUserWithId
      | undefined;

    if (!sessionUser?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId =
      Number(sessionUser.id);

    const role =
      sessionUser.role?.toLowerCase();

    /* =====================================================
       Tentukan filter berdasarkan role
    ===================================================== */

    const where =
      role === "admin"
        ? {}
        : {
            id_anggota: userId,
          };

    /* =====================================================
       Ambil data lengkap
    ===================================================== */

    const data =
      await prisma.peminjaman.findMany({
        where,

        include: {
          anggota: true,

          detail: true,
        },

        orderBy: {
          tanggal_pengajuan:
            "desc",
        },
      });

    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );

  } catch (error) {
    console.error(
      "ERROR GET PEMINJAMAN:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Gagal mengambil data peminjaman.",
      },
      { status: 500 }
    );
  }
}