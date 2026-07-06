"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { catatRiwayatTransaksi } from "@/lib/transaksi";
import { createNotifikasi } from "@/lib/notifikasi";
import { createWhatsAppReminderForJadwal } from "@/lib/whatsapp-reminder";

type CreateJadwalInput = {
  idPeminjaman: number;
  tanggalMulai: string;
  cicilanPerBulan: number;
  tenor: number;
  denda?: number;
  catatan?: string;
};

// ================= CREATE JADWAL =================
export async function createJadwalAngsuran(
  payload: CreateJadwalInput
) {
  const {
    idPeminjaman,
    tanggalMulai,
    cicilanPerBulan,
    tenor,
    denda,
    catatan,
  } = payload;

  const startDate = new Date(tanggalMulai);

  const peminjaman = await prisma.$transaction(async (tx) => {
    const dataPeminjaman = await tx.peminjaman.findUnique({
      where: {
        id_peminjaman: idPeminjaman,
      },
      include: {
        anggota: true,
      },
    });

    if (!dataPeminjaman) {
      throw new Error("Peminjaman tidak ditemukan");
    }

    for (let i = 0; i < tenor; i++) {
      const dueDate = new Date(startDate);

      dueDate.setMonth(
        dueDate.getMonth() + i
      );

      const jadwal = await tx.jadwal_angsuran.create({
        data: {
          id_peminjaman: idPeminjaman,
          cicilan_ke: i + 1,
          jumlah_cicilan:
            cicilanPerBulan,
          jumlah_tagihan:
            cicilanPerBulan,
          jatuh_tempo: dueDate,
          denda: denda || 0,
          catatan,
          status: "PENDING",
        },
      });

      await createWhatsAppReminderForJadwal(tx, jadwal, dataPeminjaman.anggota);
    }

    const updated = await tx.peminjaman.update({
      where: {
        id_peminjaman:
          idPeminjaman,
      },
      data: {
        status: "ACTIVE",
      },
    });

    return updated;
  });

  await createNotifikasi({
    id_anggota: peminjaman.id_anggota,
    role_tujuan: "nasabah",
    isi: "Jadwal angsuran pinjaman Anda telah dibuat",
    jenis: "JADWAL_ANGSURAN",
    url: `/nasabah/cicilan/${idPeminjaman}`,
  });

  refreshPages();

  return {
    success: true,
  };
}

// ================= HELPER =================
function refreshPages() {
  revalidatePath("/admin/cicilan");
  revalidatePath(
    "/admin/cicilan/konten",
    "layout"
  );
}

async function syncStatusPeminjaman(
  idPeminjaman: number
) {
  const jadwal =
    await prisma.jadwal_angsuran.findMany({
      where: {
        id_peminjaman:
          idPeminjaman,
      },
    });

  const allLunas =
    jadwal.length > 0 &&
    jadwal.every(
      (item) =>
        item.status === "LUNAS"
    );

  await prisma.peminjaman.update({
    where: {
      id_peminjaman:
        idPeminjaman,
    },
    data: {
      status: allLunas
        ? "LUNAS"
        : "ACTIVE",
    },
  });
}

// ================= KONFIRMASI =================
export async function konfirmasiPembayaran(
  idJadwal: number
) {
  const result =
    await prisma.$transaction(
      async (tx) => {

        const jadwal =
          await tx.jadwal_angsuran.findUnique({
            where: {
              id_jadwal:
                idJadwal,
            },
            include: {
              peminjaman: true,
            },
          });

        if (!jadwal) {
          throw new Error(
            "Jadwal tidak ditemukan"
          );
        }

        // cek apakah nasabah sudah submit
        let pembayaran =
          await tx.pembayaran.findFirst({
            where: {
              id_jadwal:
                idJadwal,
            },
          });

        // kalau belum = bayar langsung lama; aturan baru cash wajib lewat form upload bukti.
        if (!pembayaran) {
          throw new Error("Pembayaran cash wajib diinput melalui form dengan bukti pembayaran");
        }

        // kalau sudah submit = approve
        else {
          pembayaran = await tx.pembayaran.update({
            where: {
              id_pembayaran:
                pembayaran.id_pembayaran,
            },
            data: {
              status:
                "BERHASIL",
            },
          });
        }

        // update cicilan
        await tx.jadwal_angsuran.update({
          where: {
            id_jadwal:
              idJadwal,
          },
          data: {
            status:
              "LUNAS",
          },
        });

        await catatRiwayatTransaksi(tx, {
          idAnggota: jadwal.peminjaman.id_anggota,
          kategori: "PINJAMAN",
          nominal: pembayaran.jumlah,
          metodeBayar: pembayaran.metode_bayar,
          nomor: jadwal.cicilan_ke,
          buktiBayar: pembayaran.bukti_bayar,
          refTabel: "pembayaran",
          refId: pembayaran.id_pembayaran,
        });

        return jadwal;
      }
    );

  await syncStatusPeminjaman(
    result.id_peminjaman
  );

  await createNotifikasi({
    id_anggota: result.peminjaman.id_anggota,
    role_tujuan: "nasabah",
    isi: `Pembayaran cicilan ke-${result.cicilan_ke} telah diverifikasi`,
    jenis: "VERIFIKASI_CICILAN",
    url: `/nasabah/cicilan/${result.id_peminjaman}`,
  });

  refreshPages();

  return {
    success: true,
  };
}

// ================= BATALKAN =================
export async function batalkanPembayaran(
  idJadwal: number
) {
  const result =
    await prisma.$transaction(
      async (tx) => {

        const jadwal =
          await tx.jadwal_angsuran.findUnique({
            where: {
              id_jadwal:
                idJadwal,
            },
            include: {
              peminjaman: true,
            },
          });

        if (!jadwal) {
          throw new Error(
            "Jadwal tidak ditemukan"
          );
        }

        // reset cicilan
        await tx.jadwal_angsuran.update({
          where: {
            id_jadwal:
              idJadwal,
          },
          data: {
            status:
              "PENDING",
          },
        });

        // hapus riwayat
        const pembayaran = await tx.pembayaran.findFirst({
          where: { id_jadwal: idJadwal },
        });

        await tx.riwayat_transaksi.deleteMany({
          where: pembayaran
            ? {
                ref_tabel: "pembayaran",
                ref_id: pembayaran.id_pembayaran,
              }
            : {
                id_anggota: jadwal.peminjaman.id_anggota,
                keterangan: {
                  contains: `cicilan ke-${jadwal.cicilan_ke}`,
                },
              },
        });

        return jadwal;
      }
    );

  await syncStatusPeminjaman(
    result.id_peminjaman
  );

  refreshPages();

  return {
    success: true,
  };
}

// ================= MANUAL PAYMENT =================
export async function createManualPayment(
  payload: {
    idJadwal: number;
    catatan?: string;
    buktiBayar: string;
  }
) {

  const {
    idJadwal,
    catatan,
    buktiBayar,
  } = payload;

  if (!buktiBayar) {
    throw new Error("Bukti pembayaran cash wajib diupload");
  }

  const result =
    await prisma.$transaction(
      async (tx) => {

        const jadwal =
          await tx.jadwal_angsuran.findUnique({
            where: {
              id_jadwal:
                idJadwal,
            },

            include: {
              peminjaman: true,
            },
          });

        if (!jadwal) {
          throw new Error(
            "Jadwal tidak ditemukan"
          );
        }

        // cegah double bayar
        if (
          jadwal.status ===
          "LUNAS"
        ) {
          throw new Error(
            "Cicilan sudah lunas"
          );
        }

        // create pembayaran
        const pembayaran =
          await tx.pembayaran.create({
          data: {
            id_jadwal:
              idJadwal,

            jumlah:
              jadwal.jumlah_tagihan,

            metode_bayar:
              "CASH",

            status:
              "BERHASIL",

            catatan:
              catatan || null,

            bukti_bayar:
              buktiBayar,
          },
        });

        // update jadwal
        await tx.jadwal_angsuran.update({
          where: {
            id_jadwal:
              idJadwal,
          },

          data: {
            status:
              "LUNAS",
          },
        });

        await catatRiwayatTransaksi(tx, {
          idAnggota: jadwal.peminjaman.id_anggota,
          kategori: "PINJAMAN",
          nominal: jadwal.jumlah_tagihan,
          metodeBayar: "CASH",
          nomor: jadwal.cicilan_ke,
          buktiBayar,
          refTabel: "pembayaran",
          refId: pembayaran.id_pembayaran,
        });

        return jadwal;
      }
    );

  await syncStatusPeminjaman(
    result.id_peminjaman
  );

  await createNotifikasi({
    id_anggota: result.peminjaman.id_anggota,
    role_tujuan: "nasabah",
    isi: `Pembayaran cicilan ke-${result.cicilan_ke} telah diverifikasi`,
    jenis: "VERIFIKASI_CICILAN",
    url: `/nasabah/cicilan/${result.id_peminjaman}`,
  });

  refreshPages();

  return {
    success: true,
  };
}
