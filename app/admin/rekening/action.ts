"use server";

import { prisma } from "@/lib/prisma";

import { revalidatePath } from "next/cache";

/* =========================================================
   TAMBAH REKENING
========================================================= */
export async function tambahRekeningPembayaran(
  formData: FormData
) {
  try {
    const nama_bank =
      formData.get(
        "nama_bank"
      ) as string;

    const nomor_rekening =
      formData.get(
        "nomor_rekening"
      ) as string;

    const atas_nama =
      formData.get(
        "atas_nama"
      ) as string;

    const is_active =
      formData.get("is_active") ===
      "true";

    /* VALIDASI */
    if (
      !nama_bank?.trim() ||
      !nomor_rekening?.trim() ||
      !atas_nama?.trim()
    ) {
      return {
        success: false,
        message:
          "Semua field wajib diisi",
      };
    }

    /* HITUNG TOTAL */
    const totalRekening =
      await prisma.rekeningPembayaran.count();

    /* JIKA PERTAMA AUTO AKTIF */
    const activeFinal =
      totalRekening === 0
        ? true
        : is_active;

    /* NONAKTIFKAN SEMUA */
    if (activeFinal) {
      await prisma.rekeningPembayaran.updateMany(
        {
          data: {
            is_active: false,
          },
        }
      );
    }

    /* CREATE */
    await prisma.rekeningPembayaran.create(
      {
        data: {
          nama_bank,
          no_rekening:
            nomor_rekening,
          atas_nama,
          is_active:
            activeFinal,
        },
      }
    );

    revalidatePath(
      "/admin/rekening"
    );

    return {
      success: true,
      message:
        "Rekening berhasil ditambahkan",
    };
  } catch (error) {
    console.error(
      "ERROR TAMBAH REKENING:",
      error
    );

    return {
      success: false,
      message:
        "Gagal menambahkan rekening",
    };
  }
}

/* =========================================================
   AKTIFKAN REKENING
========================================================= */
export async function aktifkanRekening(
  id: number
) {
  try {
    /* NONAKTIFKAN SEMUA */
    await prisma.rekeningPembayaran.updateMany(
      {
        data: {
          is_active: false,
        },
      }
    );

    /* AKTIFKAN SATU */
    await prisma.rekeningPembayaran.update(
      {
        where: {
          id_rekening: id,
        },
        data: {
          is_active: true,
        },
      }
    );

    revalidatePath(
      "/admin/rekening"
    );

    return {
      success: true,
      message:
        "Rekening berhasil diaktifkan",
    };
  } catch (error) {
    console.error(
      "ERROR AKTIFKAN REKENING:",
      error
    );

    return {
      success: false,
      message:
        "Gagal mengaktifkan rekening",
    };
  }
}

/* =========================================================
   NONAKTIFKAN REKENING
========================================================= */
export async function nonaktifkanRekening(
  id: number
) {
  try {
    const totalAktif =
      await prisma.rekeningPembayaran.count(
        {
          where: {
            is_active: true,
          },
        }
      );

    /* CEGAH SEMUA REKENING NONAKTIF */
    if (totalAktif <= 1) {
      return {
        success: false,
        message:
          "Minimal harus ada 1 rekening aktif",
      };
    }

    await prisma.rekeningPembayaran.update(
      {
        where: {
          id_rekening: id,
        },
        data: {
          is_active: false,
        },
      }
    );

    revalidatePath(
      "/admin/rekening"
    );

    return {
      success: true,
      message:
        "Rekening berhasil dinonaktifkan",
    };
  } catch (error) {
    console.error(
      "ERROR NONAKTIFKAN REKENING:",
      error
    );

    return {
      success: false,
      message:
        "Gagal menonaktifkan rekening",
    };
  }
}

/* =========================================================
   UPDATE REKENING
========================================================= */
export async function updateRekening(
  id: number,
  formData: FormData
) {
  try {
    const nama_bank =
      formData.get(
        "nama_bank"
      ) as string;

    const nomor_rekening =
      formData.get(
        "nomor_rekening"
      ) as string;

    const atas_nama =
      formData.get(
        "atas_nama"
      ) as string;

    const is_active =
      formData.get("is_active") ===
      "true";

    /* VALIDASI */
    if (
      !nama_bank?.trim() ||
      !nomor_rekening?.trim() ||
      !atas_nama?.trim()
    ) {
      return {
        success: false,
        message:
          "Semua field wajib diisi",
      };
    }

    /* JIKA DISET AKTIF */
    if (is_active) {
      await prisma.rekeningPembayaran.updateMany(
        {
          data: {
            is_active: false,
          },
        }
      );
    }

    await prisma.rekeningPembayaran.update(
      {
        where: {
          id_rekening: id,
        },
        data: {
          nama_bank,
          no_rekening:
            nomor_rekening,
          atas_nama,
          is_active,
        },
      }
    );

    revalidatePath(
      "/admin/rekening"
    );

    return {
      success: true,
      message:
        "Rekening berhasil diperbarui",
    };
  } catch (error) {
    console.error(
      "ERROR UPDATE REKENING:",
      error
    );

    return {
      success: false,
      message:
        "Gagal memperbarui rekening",
    };
  }
}

/* =========================================================
   HAPUS REKENING
========================================================= */
export async function hapusRekening(
  id: number
) {
  try {
    /* AMBIL DATA */
    const rekening =
      await prisma.rekeningPembayaran.findUnique(
        {
          where: {
            id_rekening: id,
          },
        }
      );

    if (!rekening) {
      return {
        success: false,
        message:
          "Rekening tidak ditemukan",
      };
    }

    /* HITUNG TOTAL */
    const total =
      await prisma.rekeningPembayaran.count();

    /* CEGAH HAPUS SEMUA */
    if (total <= 1) {
      return {
        success: false,
        message:
          "Minimal harus ada 1 rekening",
      };
    }

    /* HAPUS */
    await prisma.rekeningPembayaran.delete(
      {
        where: {
          id_rekening: id,
        },
      }
    );

    /* JIKA YANG DIHAPUS AKTIF */
    if (rekening.is_active) {
      const first =
        await prisma.rekeningPembayaran.findFirst(
          {
            orderBy: {
              id_rekening:
                "asc",
            },
          }
        );

      /* AKTIFKAN REKENING PERTAMA */
      if (first) {
        await prisma.rekeningPembayaran.update(
          {
            where: {
              id_rekening:
                first.id_rekening,
            },
            data: {
              is_active: true,
            },
          }
        );
      }
    }

    revalidatePath(
      "/admin/rekening"
    );

    return {
      success: true,
      message:
        "Rekening berhasil dihapus",
    };
  } catch (error) {
    console.error(
      "ERROR HAPUS REKENING:",
      error
    );

    return {
      success: false,
      message:
        "Gagal menghapus rekening",
    };
  }
}