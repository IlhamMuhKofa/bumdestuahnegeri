import { CheckCircle2, Clock3, Bell, XCircle, Filter } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getMetaWhatsAppStatus } from "@/lib/whatsapp";
import { InstantWhatsAppSend } from "./client";
import Link from "next/link";

export const metadata = {
  title: "Manajemen WhatsApp",
};

type ReminderStatus = "SENT" | "FAILED" | "PENDING" | string;

const statusView = {
  SENT: {
    label: "Terkirim",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: CheckCircle2,
  },
  FAILED: {
    label: "Gagal",
    className: "bg-rose-50 text-rose-700 ring-rose-200",
    icon: XCircle,
  },
  PENDING: {
    label: "Menunggu H-2",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    icon: Clock3,
  },
};

// Helper format Rupiah untuk kolom nominal angsuran di tabel monitoring.
function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

// Helper format tanggal agar tanggal jatuh tempo dan jadwal kirim mudah dibaca admin.
function formatTanggal(value: Date) {
  return value.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Helper badge status untuk menerjemahkan status database menjadi label presentasi UI.
function getStatusView(status: ReminderStatus) {
  return statusView[status as keyof typeof statusView] || statusView.PENDING;
}

// Query log WhatsApp yang sudah dijadwalkan dari tabel reminder untuk monitoring admin.
async function getReminderLogs(
  bulan?: string,
  status?: string
) {
  const where: any = {};

  if (bulan) {
    const [month, year] = bulan.split(" ");
    const monthIndex = new Date(Date.parse(`${month} 1, ${year}`)).getMonth();
    const yearIndex = parseInt(year);

    where.jadwal_angsuran = {
      jatuh_tempo: {
        gte: new Date(yearIndex, monthIndex, 1),
        lt: new Date(yearIndex, monthIndex + 1, 1),
      },
    };
  }

  if (status) {
    where.status = status;
  }

  return prisma.whatsapp_reminder.findMany({
    where,
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
  });
}

async function getAvailableMonths() {
  const reminders = await prisma.whatsapp_reminder.findMany({
    select: {
      jadwal_angsuran: {
        select: {
          jatuh_tempo: true,
        },
      },
    },
    orderBy: {
      jadwal_angsuran: {
        jatuh_tempo: "asc",
      },
    },
  });

  return Array.from(
    new Map(
      reminders.map((item) => {
        const date = item.jadwal_angsuran.jatuh_tempo;

        const value =
          `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

        const label = date.toLocaleDateString("id-ID", {
          month: "long",
          year: "numeric",
        });

        return [value, { value, label }];
      })
    ).values()
  );
}

async function getNasabahRecipients() {
  return prisma.anggota.findMany({
    where: {
      role: "nasabah",
      no_hp: {
        not: null,
      },
    },
    select: {
      id: true,
      nama: true,
      no_hp: true,
    },
    orderBy: {
      nama: "asc",
    },
  });
}

// Halaman monitoring WhatsApp resmi Meta Cloud API tanpa QR, connect HP, atau kirim manual.
export default async function WhatsAppManagementPage({
  searchParams,
}: {
  searchParams: Promise<{
    bulan?: string;
    status?: string;
  }>;
}) {
  const params = await searchParams;
  const [status, reminders, recipients, bulanOptions] =
    await Promise.all([
      getMetaWhatsAppStatus(),
      getReminderLogs(params.bulan, params.status),
      getNasabahRecipients(),
      getAvailableMonths(),
    ]);

  const reminderOptions = reminders.map((reminder) => {
    const jadwal = reminder.jadwal_angsuran;
    const anggota = jadwal.peminjaman.anggota;

    return {
      id: reminder.id_reminder,
      name: anggota.nama || "Nasabah",
      noHp: reminder.no_hp,
      jatuhTempo: formatTanggal(jadwal.jatuh_tempo),
      nominal: formatRupiah(jadwal.jumlah_tagihan),
      status: reminder.status,
    };
  });

  const recipientOptions = recipients.map((recipient) => ({
    id: recipient.id,
    name: recipient.nama || "Nasabah",
    noHp: recipient.no_hp || "",
  }));

  const totalReminder = reminders.length;

  const totalSent = reminders.filter(
    (item) => item.status === "SENT"
  ).length;

  const totalPending = reminders.filter(
    (item) => item.status === "PENDING"
  ).length;

  const totalFailed = reminders.filter(
    (item) => item.status === "FAILED"
  ).length;

  const nasabahMap = new Map();

  reminders.forEach((reminder) => {
    const anggota = reminder.jadwal_angsuran.peminjaman.anggota;

    const id = anggota.id;

    if (!nasabahMap.has(id)) {
      nasabahMap.set(id, {
        id,
        nama: anggota.nama,
        noHp: anggota.no_hp,

        totalCicilan: 0,
        terkirim: 0,
        pending: 0,
        gagal: 0,
      });
    }

    const item = nasabahMap.get(id);

    item.totalCicilan++;

    if (reminder.status === "SENT") {
      item.terkirim++;
    }

    if (reminder.status === "PENDING") {
      item.pending++;
    }

    if (reminder.status === "FAILED") {
      item.gagal++;
    }
  });

  const nasabahList = Array.from(nasabahMap.values());



  return (
    <div className="mx-auto max-w-6xl space-y-6">
<div>
  <h1 className="text-2xl font-bold text-slate-900">
    Pusat Notifikasi WhatsApp
  </h1>

  <p className="mt-1 text-sm text-slate-500">
    Kelola seluruh pengiriman WhatsApp kepada nasabah, mulai dari
    pengingat angsuran otomatis H-2 
  </p>
</div>

<section className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

    <div className="flex gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
        <Bell size={22} />
      </div>

      <div>
        <p className="text-base font-bold text-emerald-900">
          Pengiriman Notifikasi WhatsApp
        </p>

        <p className="mt-1 max-w-3xl text-sm leading-6 text-emerald-800">
          Sistem akan mengirimkan pengingat pembayaran angsuran secara otomatis
          pada H-2 sebelum tanggal jatuh tempo. Admin juga dapat mengirim
          reminder atau pesan manual kepada nasabah kapan saja
        </p>
      </div>
    </div>

    <InstantWhatsAppSend
      isApiActive={status.active}
      reminders={reminderOptions}
      recipients={recipientOptions}
    />

  </div>
</section>

      <section className="grid gap-4 md:grid-cols-3">

        <div className="rounded-2xl bg-blue-800 p-5 text-white shadow-lg">
          <p className="text-sm text-blue-100">
            Total Reminder
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {totalReminder}
          </h2>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Terkirim
          </p>

          <h2 className="mt-2 text-3xl font-bold text-emerald-600">
            {totalSent}
          </h2>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Menunggu H-2
          </p>

          <h2 className="mt-2 text-3xl font-bold text-amber-500">
            {totalPending}
          </h2>
        </div>

      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-bold text-slate-900">
            Daftar Monitoring Reminder Nasabah
          </h2>

          <div className="relative w-60">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <select
              className="
      w-full
      appearance-none
      rounded-lg
      border
      border-slate-300
      bg-white
      py-2
      pl-10
      pr-10
      text-sm
      shadow-sm
      focus:border-emerald-600
      focus:ring-2
      focus:ring-emerald-100
      "
            >
              <option>Semua Reminder</option>

              <option>Hari Ini</option>

              <option>Minggu Ini</option>

              <option>Bulan Ini</option>

              <option disabled>
                ───────────────
              </option>

              <option>Menunggu H-2</option>

              <option>Sudah Terkirim</option>

              <option disabled>
                ───────────────
              </option>

              {bulanOptions.map((bulan) => (
                <option
                  key={bulan.value}
                  value={bulan.value}
                >
                  {bulan.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Nama Nasabah</th>
                <th className="px-5 py-3 font-semibold">No Hp</th>
                <th className="px-5 py-3 font-semibold">Total Cicilan</th>
                <th className="px-5 py-3 font-semibold">Terkirim</th>
                <th className="px-5 py-3 font-semibold">Pending</th>
                <th className="px-5 py-3 font-semibold">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reminders.length === 0 ? (
                <tr>
                  <td className="px-5 py-10 text-center text-slate-500" colSpan={5}>
                    Belum ada jadwal notifikasi WhatsApp.
                  </td>
                </tr>
              ) : (
                nasabahList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">

                    <td className="px-5 py-4 font-semibold">
                      {item.nama}
                    </td>

                    <td className="px-5 py-4">
                      {item.noHp}
                    </td>

                    <td className="px-5 py-4">
                      {item.totalCicilan}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700">
                        {item.terkirim}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">
                        {item.pending}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/whatsapp/${item.id}`}
                        className="
    rounded-xl
    border
    border-blue-800
    px-4
    py-2
    text-sm
    font-medium
    text-blue-800
    transition
    hover:bg-blue-800
    hover:text-white
  "
                      >
                        Detail
                      </Link>
                    </td>

                  </tr>
                ))

              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
