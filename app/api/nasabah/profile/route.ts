import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { supabaseStorage } from "@/lib/storage";

const MAX_SIZE = 2 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

/* =========================================================
   HELPER
========================================================= */

function getFileExtension(type: string) {
  switch (type) {
    case "image/png":
      return "png";

    case "image/webp":
      return "webp";

    case "image/jpeg":
    case "image/jpg":
    default:
      return "jpg";
  }
}

/*
 * Mengambil path file Supabase dari public URL.
 *
 * Contoh:
 * https://xxx.supabase.co/storage/v1/object/public/uploads/avatar/123.jpg
 *
 * menjadi:
 * avatar/123.jpg
 */
function getSupabaseStoragePath(url: string | null) {
  if (!url) return null;

  const marker = "/storage/v1/object/public/uploads/";

  const index = url.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return url.substring(index + marker.length);
}

/* =========================================================
   PATCH
   SIMPAN DATA DIRI
========================================================= */

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const userId = Number((session.user as any).id);

    const body = await req.json();

    const updated = await prisma.anggota.update({
      where: {
        id: userId,
      },

      data: {
        nama: body.nama ?? null,
        alamat: body.alamat ?? null,
        no_hp: body.no_hp ?? null,
        pekerjaan: body.pekerjaan ?? null,
        jenis_kelamin: body.jenis_kelamin ?? null,

        tanggal_lahir: body.tanggal_lahir
          ? new Date(body.tanggal_lahir)
          : null,

        nik: body.nik ?? null,
      },
    });

    return NextResponse.json({
      success: true,
      user: updated,
    });
  } catch (error) {
    console.error(
      "UPDATE PROFILE ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Gagal memperbarui data profil.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   GET
   AMBIL DATA DIRI
========================================================= */

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const userId = Number((session.user as any).id);

    const user = await prisma.anggota.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        nama: true,
        alamat: true,
        no_hp: true,
        pekerjaan: true,
        jenis_kelamin: true,
        tanggal_lahir: true,
        nik: true,
        foto_diri: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Data pengguna tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      "GET PROFILE ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Gagal mengambil data profil.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   POST
   UPLOAD / UPDATE FOTO PROFIL
========================================================= */

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const userId = Number((session.user as any).id);

    const formData = await req.formData();

    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        {
          message: "File foto tidak ditemukan.",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       VALIDASI TIPE
    ========================= */

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          message:
            "Format foto harus PNG, JPG, JPEG atau WEBP.",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       VALIDASI UKURAN
    ========================= */

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          message:
            "Ukuran foto maksimal 2 MB.",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       AMBIL DATA USER LAMA
       UNTUK MENGETAHUI FOTO LAMA
    ========================= */

    const existingUser =
      await prisma.anggota.findUnique({
        where: {
          id: userId,
        },

        select: {
          foto_diri: true,
        },
      });

    if (!existingUser) {
      return NextResponse.json(
        {
          message: "Data pengguna tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    /* =========================
       SIAPKAN FILE
    ========================= */

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const extension =
      getFileExtension(file.type);

    /*
     * Bucket:
     * uploads
     *
     * Folder:
     * avatar
     *
     * Contoh hasil:
     * avatar/15-uuid.jpg
     */

    const fileName =
      `avatar/${userId}-${crypto.randomUUID()}.${extension}`;

    /* =========================
       UPLOAD KE SUPABASE
    ========================= */

    const { error: uploadError } =
      await supabaseStorage.storage
        .from("uploads")
        .upload(
          fileName,
          buffer,
          {
            contentType: file.type,
            upsert: false,
          }
        );

    if (uploadError) {
      console.error(
        "SUPABASE PHOTO UPLOAD ERROR:",
        uploadError
      );

      return NextResponse.json(
        {
          message:
            "Foto gagal disimpan ke Supabase.",
        },
        {
          status: 500,
        }
      );
    }

    /* =========================
       AMBIL PUBLIC URL
    ========================= */

    const { data: publicUrlData } =
      supabaseStorage.storage
        .from("uploads")
        .getPublicUrl(fileName);

    const fotoUrl =
      publicUrlData.publicUrl;

    /* =========================
       SIMPAN URL KE DATABASE
    ========================= */

    try {
      const updated =
        await prisma.anggota.update({
          where: {
            id: userId,
          },

          data: {
            foto_diri: fotoUrl,
          },
        });

      /* =========================
         HAPUS FOTO LAMA
         SETELAH FOTO BARU BERHASIL
      ========================= */

      const oldPath =
        getSupabaseStoragePath(
          existingUser.foto_diri
        );

      if (oldPath) {
        const { error: deleteOldError } =
          await supabaseStorage.storage
            .from("uploads")
            .remove([oldPath]);

        if (deleteOldError) {
          console.warn(
            "FOTO LAMA GAGAL DIHAPUS:",
            deleteOldError
          );
        }
      }

      return NextResponse.json({
        success: true,
        message:
          "Foto profil berhasil diperbarui.",
        url: fotoUrl,
        user: updated,
      });
    } catch (databaseError) {
      /*
       * Jika upload Supabase berhasil tetapi
       * database gagal diperbarui, hapus file baru
       * agar tidak menjadi file yatim/orphan.
       */

      await supabaseStorage.storage
        .from("uploads")
        .remove([fileName]);

      throw databaseError;
    }
  } catch (error) {
    console.error(
      "UPLOAD PROFILE PHOTO ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Gagal memperbarui foto profil.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   DELETE
   HAPUS FOTO PROFIL
========================================================= */

export async function DELETE() {
  try {
    const session =
      await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const userId =
      Number((session.user as any).id);

    /* =========================
       AMBIL FOTO LAMA
    ========================= */

    const user =
      await prisma.anggota.findUnique({
        where: {
          id: userId,
        },

        select: {
          foto_diri: true,
        },
      });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "Data pengguna tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    /* =========================
       HAPUS FILE DARI SUPABASE
    ========================= */

    const storagePath =
      getSupabaseStoragePath(
        user.foto_diri
      );

    if (storagePath) {
      const { error } =
        await supabaseStorage.storage
          .from("uploads")
          .remove([storagePath]);

      if (error) {
        console.error(
          "SUPABASE DELETE PHOTO ERROR:",
          error
        );

        return NextResponse.json(
          {
            message:
              "Foto gagal dihapus dari penyimpanan.",
          },
          {
            status: 500,
          }
        );
      }
    }

    /* =========================
       HAPUS REFERENSI DI DATABASE
    ========================= */

    await prisma.anggota.update({
      where: {
        id: userId,
      },

      data: {
        foto_diri: null,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Foto profil berhasil dihapus.",
    });
  } catch (error) {
    console.error(
      "DELETE PROFILE PHOTO ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Gagal menghapus foto profil.",
      },
      {
        status: 500,
      }
    );
  }
}