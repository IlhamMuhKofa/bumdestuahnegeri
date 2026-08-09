import type { Prisma, PrismaClient } from "@prisma/client";
import {
  normalizeWhatsAppNumber,
  sendWhatsAppReminderTemplate,
} from "@/lib/whatsapp";

type PrismaExecutor = PrismaClient | Prisma.TransactionClient;

type JadwalReminderInput = {
  id_jadwal: number;
  cicilan_ke: number;
  jumlah_tagihan: number;
  jatuh_tempo: Date;
};

type AnggotaReminderInput = {
  nama: string | null;
  no_hp: string | null;
};

// Fungsi pendeteksi H-2 jatuh tempo: sistem mengirim reminder dua hari sebelum tanggal angsuran.
export function getJadwalKirimReminder(jatuhTempo: Date) {
  const jadwalKirim = new Date(jatuhTempo);
  jadwalKirim.setDate(jadwalKirim.getDate() - 2);
  jadwalKirim.setHours(8, 0, 0, 0);

  return jadwalKirim;
}

// Helper format Rupiah agar nominal di template Meta mudah dibaca nasabah.
export function formatNominalAngsuran(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

// Helper format tanggal Indonesia untuk variabel template WhatsApp.
export function formatTanggalJatuhTempo(value: Date) {
  return value.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Fungsi pembentuk pesan arsip yang disimpan ke database sebagai referensi isi notifikasi.
export function buildPesanReminderAngsuran(
  jadwal: JadwalReminderInput,
  anggota: AnggotaReminderInput
) {
  const nama = anggota.nama || "Nasabah";
  const jatuhTempo = formatTanggalJatuhTempo(jadwal.jatuh_tempo);
  const tagihan = formatNominalAngsuran(jadwal.jumlah_tagihan);

  return [
    `Halo ${nama},`,
    `Pengingat angsuran BUMDes ke-${jadwal.cicilan_ke}.`,
    `Nominal: ${tagihan}.`,
    `Jatuh tempo: ${jatuhTempo}.`,
    "Notifikasi ini dikirim otomatis pada H-2 sebelum jatuh tempo.",
  ].join("\n");
}

// Fungsi untuk menyimpan jadwal pengiriman WhatsApp setiap kali jadwal angsuran dibuat admin.
export async function createWhatsAppReminderForJadwal(
  db: PrismaExecutor,
  jadwal: JadwalReminderInput,
  anggota: AnggotaReminderInput
) {
  const normalizedNumber = anggota.no_hp
    ? normalizeWhatsAppNumber(anggota.no_hp)
    : null;

  if (!normalizedNumber) return;

  await db.whatsapp_reminder.upsert({
    where: {
      id_jadwal: jadwal.id_jadwal,
    },
    update: {
      no_hp: normalizedNumber,
      pesan: buildPesanReminderAngsuran(jadwal, anggota),
      jadwal_kirim: getJadwalKirimReminder(jadwal.jatuh_tempo),
      status: "PENDING",
      sent_at: null,
      error_message: null,
    },
    create: {
      id_jadwal: jadwal.id_jadwal,
      no_hp: normalizedNumber,
      pesan: buildPesanReminderAngsuran(jadwal, anggota),
      jadwal_kirim: getJadwalKirimReminder(jadwal.jatuh_tempo),
      status: "PENDING",
    },
  });
}

// Fungsi batch untuk membuat reminder dari banyak jadwal dalam satu transaksi pembuatan angsuran.
export async function createWhatsAppRemindersForJadwal(
  db: PrismaExecutor,
  jadwalList: JadwalReminderInput[],
  anggota: AnggotaReminderInput
) {
  for (const jadwal of jadwalList) {
    await createWhatsAppReminderForJadwal(db, jadwal, anggota);
  }
}

// Worker pengiriman otomatis: mengambil reminder PENDING yang jadwal_kirim-nya sudah masuk H-2.
export async function processDueWhatsAppReminders(
  db: PrismaExecutor,
  limit = 10
) {
  const now = new Date();
  const rekeningAktif = await db.rekeningpembayaran.findFirst({
  where: {
    is_active: true,
  },
    orderBy: {
    id_rekening: "asc",
  },
});

if (!rekeningAktif) {
  throw new Error("Belum ada rekening pembayaran yang aktif.");
}
  const reminders = await db.whatsapp_reminder.findMany({
    where: {
      status: "PENDING",
      jadwal_kirim: {
        lte: now,
      },
      jadwal_angsuran: {
        status: {
          not: "LUNAS",
        },
      },
    },
    include: {
      jadwal_angsuran: {
        include: {
          peminjaman: {
            include: {
              anggota: true,
            },
          },
        },
      },
    },
    orderBy: {
      jadwal_kirim: "asc",
    },
    take: limit,
  });

  let sent = 0;
  let failed = 0;

  for (const reminder of reminders) {
    const jadwal = reminder.jadwal_angsuran;
    const anggota = jadwal.peminjaman.anggota;

    try {
      await sendWhatsAppReminderTemplate({
        noHp: reminder.no_hp,
        nama: anggota.nama || "Nasabah",
        jumlah_tagihan: formatNominalAngsuran(jadwal.jumlah_tagihan),
        jatuh_tempo: formatTanggalJatuhTempo(jadwal.jatuh_tempo),
        nama_bank: rekeningAktif.nama_bank,
        nomor_rekening: rekeningAktif.no_rekening,
        atas_nama: rekeningAktif.atas_nama,
      });

      await db.whatsapp_reminder.update({
        where: {
          id_reminder: reminder.id_reminder,
        },
        data: {
          status: "SENT",
          sent_at: new Date(),
          error_message: null,
        },
      });

      sent += 1;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal mengirim WhatsApp";

      await db.whatsapp_reminder.update({
        where: {
          id_reminder: reminder.id_reminder,
        },
        data: {
          status: "FAILED",
          error_message: message,
        },
      });

      failed += 1;
    }
  }

  return {
    checked: reminders.length,
    sent,
    failed,
  };
}

export async function sendWhatsAppReminderNow(
  db: PrismaExecutor,
  reminderId: number
) {
  const reminder = await db.whatsapp_reminder.findUnique({
    where: {
      id_reminder: reminderId,
    },
    include: {
      jadwal_angsuran: {
        include: {
          peminjaman: {
            include: {
              anggota: true,
            },
          },
        },
      },
    },
  });

  if (!reminder) {
    throw new Error("Jadwal reminder WhatsApp tidak ditemukan.");
  }

  const jadwal = reminder.jadwal_angsuran;
  const anggota = jadwal.peminjaman.anggota;

  const rekeningAktif = await db.rekeningpembayaran.findFirst({
  where: {
    is_active: true,
  },
});

if (!rekeningAktif) {
  throw new Error("Belum ada rekening pembayaran yang aktif.");
}

  try {
    await sendWhatsAppReminderTemplate({
      noHp: reminder.no_hp,
      nama: anggota.nama || "Nasabah",
      jumlah_tagihan: formatNominalAngsuran(jadwal.jumlah_tagihan),
      jatuh_tempo: formatTanggalJatuhTempo(jadwal.jatuh_tempo),
      nama_bank: rekeningAktif.nama_bank,
      nomor_rekening: rekeningAktif.no_rekening,
      atas_nama: rekeningAktif.atas_nama,
    });

    await db.whatsapp_reminder.update({
      where: {
        id_reminder: reminder.id_reminder,
      },
      data: {
        status: "SENT",
        sent_at: new Date(),
        error_message: null,
      },
    });

    return {
      success: true,
      reminderId: reminder.id_reminder,
      sentTo: reminder.no_hp,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal mengirim WhatsApp";

    await db.whatsapp_reminder.update({
      where: {
        id_reminder: reminder.id_reminder,
      },
      data: {
        status: "FAILED",
        error_message: message,
      },
    });

    throw error;
  }
}
