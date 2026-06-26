"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { catatRiwayatTransaksi } from "@/lib/transaksi";
import { createNotifikasi } from "@/lib/notifikasi";

import fs from "fs/promises";

import path from "path";

type StatusPembayaran =
  | "MENUNGGU"
  | "BERHASIL"
  | "DITOLAK";

export async function updateStatusPembayaran(
  idPembayaran: number,
  status: StatusPembayaran
) {
  try {

    // =========================
    // AMBIL DATA PEMBAYARAN
    // =========================
    const pembayaran =
      await prisma.pembayaranSimpanan.findUnique({
        where: {
          id_pembayaran_simpanan:
            idPembayaran,
        },
        include: {
          simpanan: true,
        },
      });

    if (!pembayaran) {
      throw new Error(
        "Pembayaran tidak ditemukan"
      );
    }

    // =========================
    // CEGAH DOUBLE APPROVE
    // =========================
    if (
      pembayaran.status !==
      "MENUNGGU"
    ) {
      return {
        success: false,
        message:
          "Pembayaran sudah diproses",
      };
    }

    // =========================
    // UPDATE STATUS PEMBAYARAN
    // =========================
    await prisma.pembayaranSimpanan.update({
      where: {
        id_pembayaran_simpanan:
          idPembayaran,
      },
      data: {
        status,
      },
    });

  const sisaTagihan =
  await prisma.pembayaranSimpanan.count({
    where: {
      id_simpanan:
        pembayaran.id_simpanan,
      status: {
        not: "BERHASIL",
      },
    },
  });

    // =========================
    // APPROVE
    // =========================
    if (status === "BERHASIL") {

      await prisma.simpanan.update({
        where: {
          id_simpanan:
            pembayaran.id_simpanan,
        },
        data: {
          terkumpul: {
            increment:
              pembayaran.nominal_bayar,
          },
        },
      });

      await catatRiwayatTransaksi(prisma, {
        idAnggota: pembayaran.simpanan.id_anggota,
        kategori: "SIMPANAN",
        nominal: pembayaran.nominal_bayar,
        metodeBayar: pembayaran.metode_bayar || "TRANSFER",
        nomor: pembayaran.bulan_ke,
        buktiBayar: pembayaran.bukti_bayar,
        refTabel: "pembayaran_simpanan",
        refId: pembayaran.id_pembayaran_simpanan,
        tanggal: pembayaran.tanggal_bayar,
      });

    }

    if (
  status === "BERHASIL" &&
  sisaTagihan === 0
) {
  await prisma.simpanan.update({
    where: {
      id_simpanan:
        pembayaran.id_simpanan,
    },
    data: {
      status: "BERHASIL",
    },
  });
}

    // =========================
    // TOLAK
    // =========================
    if (status === "DITOLAK") {

      await prisma.simpanan.update({
        where: {
          id_simpanan:
            pembayaran.id_simpanan,
        },
        data: {
          status: "DITOLAK",
        },
      });

    }

    if (status === "BERHASIL" || status === "DITOLAK") {
      await createNotifikasi({
        id_anggota: pembayaran.simpanan.id_anggota,
        role_tujuan: "nasabah",
        isi:
          pembayaran.simpanan.jenis_simpanan === "WAJIB"
            ? `Pembayaran simpanan wajib Anda ${
                status === "BERHASIL" ? "telah diverifikasi" : "ditolak"
              }`
            : `Pembayaran tabungan pendidikan Anda ${
                status === "BERHASIL" ? "telah diverifikasi" : "ditolak"
              }`,
        jenis:
          pembayaran.simpanan.jenis_simpanan === "WAJIB"
            ? "VERIFIKASI_SIMPANAN_WAJIB"
            : "VERIFIKASI_TABUNGAN_PENDIDIKAN",
        url: "/nasabah/simpanan",
      });
    }

    revalidatePath("/admin/simpanan");
    revalidatePath("/nasabah/simpanan");
    revalidatePath("/nasabah/dashboard");

    return {
      success: true,
      message:
        status === "BERHASIL"
          ? "Pembayaran berhasil disetujui"
          : "Pembayaran berhasil ditolak",
    };

  } catch (error) {

    console.error(
      "ERROR UPDATE STATUS:",
      error
    );

    return {
      success: false,
      message:
        "Gagal mengubah status pembayaran",
    };
  }
}

export async function buatJadwalSimpananWajib(
  idAnggota: number,
  nominalBulanan: number,
  jangkaWaktu: number = 12,
  tanggalMulai: string = new Date().toISOString().split("T")[0]
) {
  try {

    // =========================
    // CEK SUDAH ADA ATAU BELUM
    // =========================
    const existing =
      await prisma.simpanan.findFirst({
        where: {
          id_anggota: idAnggota,
          jenis_simpanan: "WAJIB",
          status: "BERJALAN",
        },
      });

    if (existing) {
      return {
        success: false,
        message:
          "Jadwal simpanan wajib sudah ada",
      };
    }

    // =========================
    // BUAT SIMPANAN
    // =========================
    const simpanan =
      await prisma.simpanan.create({
        data: {
          id_anggota: idAnggota,

          jenis_simpanan: "WAJIB",

          tujuan:
            "Simpanan Wajib",

          nominal:
            nominalBulanan,

          jangka_waktu:
            jangkaWaktu,

          target_dana:
            nominalBulanan *
            jangkaWaktu,

          terkumpul: 0,

          status:
            "BERJALAN",

          tanggal_tagihan:
            new Date(tanggalMulai),
        },
      });

    // =========================
    // GENERATE TAGIHAN
    // =========================
const tagihan = [];

// const startDate =
//   new Date(tanggalMulai);

for (
  let bulan = 1;
  bulan <= jangkaWaktu;
  bulan++
) {

  // const tanggalTagihan =
  //   new Date(startDate);

  // tanggalTagihan.setMonth(
  //   tanggalTagihan.getMonth() +
  //     (bulan - 1)
  // );

  tagihan.push({
    id_simpanan:
      simpanan.id_simpanan,

    jenis_simpanan:
      "WAJIB",

    bulan_ke: bulan,

    // tanggal_tagihan:
    //   tanggalTagihan,

    nominal_bayar:
      nominalBulanan,

    status:
      "MENUNGGU",
  });
}

    await prisma.pembayaranSimpanan.createMany({
      data: tagihan,
    });

  
    revalidatePath(
      "/admin/simpanan"
    );

    revalidatePath(
      `/admin/simpanan/${idAnggota}`
    );

    return {
      success: true,
      message:
        "Jadwal simpanan wajib berhasil dibuat",
    };

  } catch (error) {

    console.error(
      "ERROR BUAT JADWAL:",
      error
    );

    return {
      success: false,
      message:
        "Gagal membuat jadwal simpanan wajib",
    };
  }
}

export async function buatTabunganPendidikan(
  idAnggota: number,
  targetDana: number = 1200000,
  jangkaWaktu: number = 12,
  tujuan: string = "Tabungan Pendidikan"
) {
  try {
    const existing =
      await prisma.simpanan.findFirst({
        where: {
          id_anggota: idAnggota,
          jenis_simpanan: "PENDIDIKAN",
          status: {
            not: "BERHASIL",
          },
        },
      });

    if (existing) {
      return {
        success: false,
        message: "Tabungan pendidikan sudah tersedia",
      };
    }

    await prisma.simpanan.create({
      data: {
        id_anggota: idAnggota,
        jenis_simpanan: "PENDIDIKAN",
        tujuan,
        nominal: Math.ceil(targetDana / jangkaWaktu),
        target_dana: targetDana,
        jangka_waktu: jangkaWaktu,
        tanggal_tagihan: new Date(),
        status: "AKTIF",
        terkumpul: 0,
      },
    });

    revalidatePath("/admin/simpanan");
    revalidatePath(`/admin/simpanan/${idAnggota}`);

    return {
      success: true,
      message: "Tabungan pendidikan berhasil dibuat",
    };
  } catch (error) {
    console.error("ERROR BUAT TABUNGAN PENDIDIKAN:", error);

    return {
      success: false,
      message: "Gagal membuat tabungan pendidikan",
    };
  }
}

export async function bayarCashMassal(
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
message:
"Belum ada tagihan yang dipilih",
};
}

if (!buktiBayar) {
return {
success: false,
message:
"Bukti pembayaran cash wajib diupload",
};
}

// =========================
// AMBIL SEMUA TAGIHAN
// =========================
const tagihan =
  await prisma.pembayaranSimpanan.findMany({
    where: {
      id_pembayaran_simpanan: {
        in: idsPembayaran,
      },
    },
  });

if (tagihan.length === 0) {
  return {
    success: false,
    message:
      "Tagihan tidak ditemukan",
  };
}

// =========================
// CEK SUDAH DIBAYAR?
// =========================
const sudahDibayar =
  tagihan.some(
    (item) =>
      item.status === "BERHASIL"
  );

if (sudahDibayar) {
  return {
    success: false,
    message:
      "Ada tagihan yang sudah dibayar",
  };
}

// =========================
// UPDATE SEMUA TAGIHAN
// =========================
await prisma.pembayaranSimpanan.updateMany({
  where: {
    id_pembayaran_simpanan: {
      in: idsPembayaran,
    },
  },
  data: {
    status: "BERHASIL",
    metode_bayar: "CASH",
    tanggal_bayar:
      new Date(tanggalBayar),
    bukti_bayar:
      buktiBayar || null,
  },
});

// =========================
// TOTAL PEMBAYARAN
// =========================
const totalBayar =
  tagihan.reduce(
    (sum, item) =>
      sum + item.nominal_bayar,
    0
  );

// =========================
// AMBIL ID SIMPANAN
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
    message:
      "Simpanan tidak ditemukan",
  };
}

for (const item of tagihan) {
  await catatRiwayatTransaksi(prisma, {
    idAnggota: simpanan.id_anggota,
    kategori: "SIMPANAN",
    nominal: item.nominal_bayar,
    metodeBayar: "CASH",
    nomor: item.bulan_ke,
    buktiBayar,
    refTabel: "pembayaran_simpanan",
    refId: item.id_pembayaran_simpanan,
    tanggal: new Date(tanggalBayar),
  });
}

// =========================
// UPDATE TERKUMPUL
// =========================
await prisma.simpanan.update({
  where: {
    id_simpanan:
      idSimpanan,
  },
  data: {
    terkumpul: {
      increment:
        totalBayar,
    },
  },
});

// =========================
// CEK MASIH ADA TAGIHAN?
// =========================
const sisaTagihan =
  await prisma.pembayaranSimpanan.count({
    where: {
      id_simpanan:
        idSimpanan,
      status: {
        not: "BERHASIL",
      },
    },
  });

// =========================
// JIKA SEMUA LUNAS
// =========================
if (sisaTagihan === 0) {
  await prisma.simpanan.update({
    where: {
      id_simpanan:
        idSimpanan,
    },
    data: {
      status: "BERHASIL",
    },
  });
}

// =========================
// REVALIDATE
// =========================
revalidatePath(
  "/admin/simpanan"
);

if (simpanan) {
  revalidatePath(
    `/admin/simpanan/${simpanan.id_anggota}`
  );
}

revalidatePath(
  "/nasabah/simpanan"
);

revalidatePath(
  "/nasabah/dashboard"
);

return {
  success: true,
  message:
    "Pembayaran berhasil disimpan",
};


} catch (error) {
console.error(
"ERROR BAYAR MASSAL:",
error
);

return {
  success: false,
  message:
    "Gagal menyimpan pembayaran",
};

}
}

export async function bayarCashPendidikan(
  idSimpanan: number,
  nominal: number,
  buktiBayar: string,
  catatan?: string
) {
  try {
    // =========================
    // VALIDASI
    // =========================
    if (!idSimpanan) {
      return {
        success: false,
        message: "Simpanan tidak ditemukan",
      };
    }

    if (!nominal || nominal <= 0) {
      return {
        success: false,
        message: "Nominal tidak valid",
      };
    }

    if (!buktiBayar) {
      return {
        success: false,
        message: "Bukti pembayaran wajib diupload",
      };
    }

    // =========================
    // AMBIL SIMPANAN
    // =========================
    const simpanan =
      await prisma.simpanan.findUnique({
        where: {
          id_simpanan: idSimpanan,
        },
      });

    if (!simpanan) {
      return {
        success: false,
        message: "Data simpanan tidak ditemukan",
      };
    }

    // =========================
    // CEK SISA TARGET
    // =========================
    const sisaTarget =
      (simpanan.target_dana ?? 0) -
      simpanan.terkumpul;

    if (nominal > sisaTarget) {
      return {
        success: false,
        message:
          "Nominal melebihi sisa target tabungan",
      };
    }

    // =========================
    // BULAN KE
    // =========================
    const bulanKe =
      (
        await prisma.pembayaranSimpanan.count({
          where: {
            id_simpanan: idSimpanan,
          },
        })
      ) + 1;

    // =========================
    // BUAT PEMBAYARAN
    // =========================
    const pembayaran = await prisma.pembayaranSimpanan.create({
      data: {
        id_simpanan: idSimpanan,

        bulan_ke: bulanKe,

        nominal_bayar: nominal,

        metode_bayar: "CASH",

        tanggal_bayar: new Date(),

        status: "BERHASIL",

        catatan: catatan || null,
        bukti_bayar: buktiBayar,
      },
    });

    await catatRiwayatTransaksi(prisma, {
      idAnggota: simpanan.id_anggota,
      kategori: "SIMPANAN",
      nominal,
      metodeBayar: "CASH",
      nomor: bulanKe,
      buktiBayar,
      refTabel: "pembayaran_simpanan",
      refId: pembayaran.id_pembayaran_simpanan,
    });

    // =========================
    // UPDATE TERKUMPUL
    // =========================
    const totalBaru =
      simpanan.terkumpul + nominal;

    await prisma.simpanan.update({
      where: {
        id_simpanan: idSimpanan,
      },
      data: {
        terkumpul: totalBaru,

        status:
          totalBaru >=
          (simpanan.target_dana ?? 0)
            ? "BERHASIL"
            : "AKTIF",
      },
    });

    // =========================
    // REVALIDATE
    // =========================
    revalidatePath("/admin/simpanan");
    revalidatePath("/nasabah/simpanan");
    revalidatePath("/nasabah/dashboard");

    revalidatePath(
      `/admin/simpanan/${simpanan.id_anggota}`
    );

    return {
      success: true,
      message:
        "Setoran pendidikan berhasil disimpan",
    };
  } catch (error) {
    console.error(
      "ERROR BAYAR PENDIDIKAN:",
      error
    );

    return {
      success: false,
      message:
        "Gagal menyimpan setoran pendidikan",
    };
  }
}

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
    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name}`;

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "bukti-transfer"
    );

    await fs.mkdir(uploadDir, {
      recursive: true,
    });

    const filePath = path.join(
      uploadDir,
      fileName
    );

    await fs.writeFile(
      filePath,
      buffer
    );

    const fileUrl =
      `/uploads/bukti-transfer/${fileName}`;

    const bulanKe =
      (await prisma.pembayaranSimpanan.count(
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
    await prisma.pembayaranSimpanan.create(
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
