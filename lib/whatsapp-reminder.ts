import type { Prisma, PrismaClient } from "@prisma/client";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

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

export function getJadwalKirimReminder(jatuhTempo: Date) {
  const jadwalKirim = new Date(jatuhTempo);
  jadwalKirim.setDate(jadwalKirim.getDate() - 1);
  jadwalKirim.setHours(8, 0, 0, 0);

  return jadwalKirim;
}

export function buildPesanReminderAngsuran(
  jadwal: JadwalReminderInput,
  anggota: AnggotaReminderInput
) {
  const nama = anggota.nama || "Nasabah";
  const jatuhTempo = jadwal.jatuh_tempo.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const tagihan = jadwal.jumlah_tagihan.toLocaleString("id-ID");

  return [
    `Halo ${nama},`,
    "",
    `Ini adalah pengingat cicilan pinjaman BUMDes ke-${jadwal.cicilan_ke}.`,
    `Jatuh tempo: ${jatuhTempo}`,
    `Jumlah tagihan: Rp ${tagihan}`,
    "",
    "Mohon lakukan pembayaran tepat waktu. Abaikan pesan ini jika sudah membayar.",
  ].join("\n");
}

export async function createWhatsAppReminderForJadwal(
  db: PrismaExecutor,
  jadwal: JadwalReminderInput,
  anggota: AnggotaReminderInput
) {
  if (!anggota.no_hp) {
    return;
  }

  await db.whatsAppReminder.upsert({
    where: {
      id_jadwal: jadwal.id_jadwal,
    },
    update: {
      no_hp: anggota.no_hp,
      pesan: buildPesanReminderAngsuran(jadwal, anggota),
      jadwal_kirim: getJadwalKirimReminder(jadwal.jatuh_tempo),
      status: "PENDING",
      sent_at: null,
      error_message: null,
    },
    create: {
      id_jadwal: jadwal.id_jadwal,
      no_hp: anggota.no_hp,
      pesan: buildPesanReminderAngsuran(jadwal, anggota),
      jadwal_kirim: getJadwalKirimReminder(jadwal.jatuh_tempo),
      status: "PENDING",
    },
  });
}

export async function processDueWhatsAppReminders(
  db: PrismaExecutor,
  limit = 10,
  options: {
    forceHMinusOne?: boolean;
  } = {}
) {
  const now = new Date();
  const tomorrowStart = new Date(now);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  tomorrowStart.setHours(0, 0, 0, 0);

  const tomorrowEnd = new Date(tomorrowStart);
  tomorrowEnd.setHours(23, 59, 59, 999);

  const reminders = await db.whatsAppReminder.findMany({
    where: {
      status: "PENDING",
      ...(options.forceHMinusOne
        ? {}
        : {
            jadwal_kirim: {
              lte: now,
            },
          }),
      jadwal: {
        status: {
          not: "LUNAS",
        },
        ...(options.forceHMinusOne
          ? {
              jatuh_tempo: {
                gte: tomorrowStart,
                lte: tomorrowEnd,
              },
            }
          : {}),
      },
    },
    include: {
      jadwal: true,
    },
    orderBy: {
      jadwal_kirim: "asc",
    },
    take: limit,
  });

  let sent = 0;
  let failed = 0;

  for (const reminder of reminders) {
    try {
      await sendWhatsAppMessage(reminder.no_hp, reminder.pesan);

      await db.whatsAppReminder.update({
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

      await db.whatsAppReminder.update({
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
