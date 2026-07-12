"use server";

import { prisma } from "@/lib/prisma";
import { createNotifikasi } from "@/lib/notifikasi";

import { revalidatePath } from "next/cache";
import { uploadImage } from "@/lib/storage";

/// ===============================
/// BAYAR SIMPANAN
/// ===============================
export async function bayarSimpanan(
  formData: FormData
) {
  try {
    const idSimpanan = Number(
      formData.get("idSimpanan")
    );

    const catatan =
      formData.get(
        "catatan"
      ) as string;

    const nominal = Number(
      formData.get("nominal")
    );

    const metode_bayar =
      formData.get(
        "metode_bayar"
      ) as string;

    const file =
      formData.get(
        "bukti_bayar"
      ) as File;

    // VALIDASI
    if (!idSimpanan) {
      throw new Error(
        "ID simpanan tidak valid"
      );
    }

    if (!file || file.size === 0) {
      throw new Error(
        "Bukti pembayaran wajib diupload"
      );
    }

    if (!nominal || nominal <= 0) {
      throw new Error(
        "Nominal pembayaran tidak valid"
      );
    }

    // CEK SIMPANAN
    const simpanan =
      await prisma.simpanan.findUnique(
        {
          where: {
            id_simpanan:
              idSimpanan,
          },
        }
      );

    if (!simpanan) {
      throw new Error(
        "Simpanan tidak ditemukan"
      );
    }

    // ===============================
    // UPLOAD FILE
    // ===============================
const fileUrl = await uploadImage(
  file,
  "bukti-transfer"
);

    const bulanKe =
      (await prisma.pembayaran_simpanan.count(
        {
          where: {
            id_simpanan:
              idSimpanan,
          },
        }
      )) + 1;

    // ===============================
    // SIMPAN PEMBAYARAN
    // ===============================
    await prisma.pembayaran_simpanan.create(
      {
        data: {
          id_simpanan:
            idSimpanan,

          bulan_ke:
            bulanKe,

          nominal_bayar:
            nominal,

          metode_bayar,

          catatan,

          bukti_bayar:
            fileUrl,

          tanggal_bayar:
            new Date(),

          status:
            "MENUNGGU",
        },
      }
    );

    // ===============================
    // UPDATE STATUS MASTER
    // ===============================
    await prisma.simpanan.update({
      where: {
        id_simpanan:
          idSimpanan,
      },
      data: {
        status:
          "MENUNGGU",
      },
    });

    await createNotifikasi({
      role_tujuan: "admin",
      isi:
        simpanan.jenis_simpanan === "WAJIB"
          ? "Nasabah membayar setoran simpanan wajib"
          : "Nasabah membayar setoran tabungan pendidikan",
      jenis:
        simpanan.jenis_simpanan === "WAJIB"
          ? "SETORAN_SIMPANAN_WAJIB"
          : "SETORAN_TABUNGAN_PENDIDIKAN",
      url: `/admin/simpanan/${simpanan.id_anggota}`,
    });

    revalidatePath(
      "/nasabah/simpanan"
    );

    revalidatePath(
      "/admin/simpanan"
    );

    revalidatePath(
      "/nasabah/dashboard"
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "ERROR BAYAR SIMPANAN:",
      error
    );

    return {
      success: false,
      message:
        "Gagal melakukan pembayaran",
    };
  }
}

/// ===============================
/// BUAT TABUNGAN PENDIDIKAN
/// ===============================
type PendidikanPayload = {
  idAnggota: number;
  targetDana: number;
  jangkaWaktu: number;
  tujuan: string;
  catatan?: string;
  nominal: number;
};

export async function createTabunganPendidikan(
  payload: PendidikanPayload
) {
  const {
    idAnggota,
    targetDana,
    jangkaWaktu,
    tujuan,
    nominal,
  } = payload;


  // ===============================
  // HANYA 1 RECORD MASTER
  // ===============================
  const simpanan = await prisma.simpanan.create({
    data: {
      id_anggota:
        idAnggota,

      jenis_simpanan:
        "PENDIDIKAN",

      tujuan,

      target_dana:
        targetDana,

      jangka_waktu:
        jangkaWaktu,

      tanggal_tagihan:
        new Date(),

      status:
        "AKTIF",

      nominal,

      terkumpul: 0,
    },
  });

  await createNotifikasi({
    role_tujuan: "admin",
    isi: "Nasabah membuat tabungan pendidikan",
    jenis: "TABUNGAN_PENDIDIKAN_DIBUAT",
    url: `/admin/simpanan/${simpanan.id_anggota}`,
  });

  revalidatePath(
    "/nasabah/simpanan"
  );

  revalidatePath(
    "/admin/simpanan"
  );

  revalidatePath(
    "/nasabah/dashboard"
  );

  return {
    success: true,
  };
}

export async function bayarTransferNasabah(
  idsPembayaran: number[],
  tanggalBayar: string,
  buktiBayar?: string
) {
  try {
    // =========================
    // VALIDASI INPUT
    // =========================
    if (idsPembayaran.length === 0) {
      return {
        success: false,
        message: "Belum ada tagihan yang dipilih",
      };
    }

    // =========================
    // AMBIL TAGIHAN
    // =========================
    const tagihan =
      await prisma.pembayaran_simpanan.findMany({
        where: {
          id_pembayaran_simpanan: {
            in: idsPembayaran,
          },
        },
      });

    if (tagihan.length === 0) {
      return {
        success: false,
        message: "Tagihan tidak ditemukan",
      };
    }

    // =========================
    // CEK SUDAH BERHASIL?
    // =========================
    const sudahLunas = tagihan.some(
      (item) => item.status === "BERHASIL"
    );

    if (sudahLunas) {
      return {
        success: false,
        message:
          "Ada tagihan yang sudah dibayar",
      };
    }

    // =========================
    // UPDATE PEMBAYARAN
    // =========================
    await prisma.pembayaran_simpanan.updateMany({
      where: {
        id_pembayaran_simpanan: {
          in: idsPembayaran,
        },
      },
      data: {
        metode_bayar: "TRANSFER",

        tanggal_bayar:
          new Date(tanggalBayar),

        bukti_bayar:
          buktiBayar || null,

        status: "MENUNGGU",
      },
    });

    // =========================
    // REVALIDATE
    // =========================
    const idSimpanan =
      tagihan[0].id_simpanan;

    const simpanan =
      await prisma.simpanan.findUnique({
        where: {
          id_simpanan:
            idSimpanan,
        },
      });

    if (!simpanan) {
      return {
        success: false,
        message: "Simpanan tidak ditemukan",
      };
    }

    revalidatePath(
      "/nasabah/dashboard"
    );

    revalidatePath(
      "/nasabah/simpanan"
    );

    revalidatePath(
      "/admin/simpanan"
    );

    revalidatePath(
      `/admin/simpanan/${simpanan.id_anggota}`
    );

    await createNotifikasi({
      role_tujuan: "admin",
      isi:
        simpanan.jenis_simpanan === "WAJIB"
          ? "Nasabah membayar setoran simpanan wajib"
          : "Nasabah membayar setoran tabungan pendidikan",
      jenis:
        simpanan.jenis_simpanan === "WAJIB"
          ? "SETORAN_SIMPANAN_WAJIB"
          : "SETORAN_TABUNGAN_PENDIDIKAN",
      url: `/admin/simpanan/${simpanan.id_anggota}`,
    });

    return {
      success: true,
      message:
        "Bukti pembayaran berhasil dikirim dan menunggu verifikasi admin",
    };
  } catch (error) {
    console.error(
      "ERROR BAYAR TRANSFER:",
      error
    );

    return {
      success: false,
      message:
        "Gagal mengirim pembayaran",
    };
  }
}
