import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Detail Reminder WhatsApp",
};

type ReminderStatus = "SENT" | "FAILED" | "PENDING" | string;

function formatRupiah(value: number) {
  return `Rp${value.toLocaleString("id-ID")}`;
}

function formatTanggal(value: Date) {
  return value.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getStatusView(status: ReminderStatus) {
  switch (status) {
    case "SENT":
      return {
        label: "Terkirim",
        icon: CheckCircle2,
        className:
          "bg-emerald-50 text-emerald-700 border border-emerald-200",
      };

    case "FAILED":
      return {
        label: "Gagal",
        icon: XCircle,
        className: "bg-red-50 text-red-700 border border-red-200",
      };

    default:
      return {
        label: "Menunggu H-2",
        icon: Clock3,
        className:
          "bg-amber-50 text-amber-700 border border-amber-200",
      };
  }
}

async function getReminderByNasabah(id: number) {
  return prisma.whatsapp_reminder.findMany({
    where: {
      jadwal_angsuran: {
        peminjaman: {
          anggota: {
            id,
          },
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
  });
}

export default async function DetailWhatsAppPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const reminders = await getReminderByNasabah(Number(params.id));

  if (reminders.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold">
          Data tidak ditemukan
        </h1>
      </div>
    );
  }

  const nasabah =
    reminders[0].jadwal_angsuran.peminjaman.anggota;

  const totalTerkirim = reminders.filter(
    (item) => item.status === "SENT"
  ).length;

  const totalPending = reminders.filter(
    (item) => item.status === "PENDING"
  ).length;

  const totalGagal = reminders.filter(
    (item) => item.status === "FAILED"
  ).length;

  return (
    <div className="space-y-6 p-6">

      {/* tombol kembali */}

<Link
  href="/admin/whatsapp"
  className="
    inline-flex
    w-fit
    items-center
    gap-3
    rounded-2xl
    border
    border-blue-100
    bg-white
    px-5
    py-3
    text-sm
    font-medium
    text-slate-700
    shadow-sm
    transition-all
    duration-300
    hover:-translate-y-0.5
    hover:border-blue-200
    hover:bg-blue-50
    hover:text-blue-800
    hover:shadow-md
  "
>
  <div
    className="
      flex
      h-8
      w-8
      items-center
      justify-center
      rounded-full
      bg-blue-100
      text-blue-800
    "
  >
    <ArrowLeft size={16} />
  </div>

  <div className="flex flex-col items-start">
    <span className="font-semibold">
      Kembali
    </span>
  </div>
</Link>

      {/* header */}

      <section className="rounded-3xl bg-gradient-to-r from-blue-800 to-blue-700 p-6 text-white shadow-lg">

        <h1 className="text-3xl font-bold">
          {nasabah.nama}
        </h1>

        <p className="mt-2 text-blue-100">
          {nasabah.no_hp}
        </p>

      </section>

      {/* statistik */}

      <section className="grid gap-4 md:grid-cols-3">

        <div className="rounded-2xl border bg-white p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            Total Cicilan
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-800">
            {reminders.length}
          </h2>

        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            Terkirim
          </p>

          <h2 className="mt-2 text-3xl font-bold text-emerald-600">
            {totalTerkirim}
          </h2>

        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            Menunggu
          </p>

          <h2 className="mt-2 text-3xl font-bold text-amber-500">
            {totalPending}
          </h2>

        </div>


      </section>

      {/* tabel */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 p-5">

          <h2 className="text-lg font-bold text-slate-900">
            Jadwal Reminder WhatsApp
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Monitoring seluruh jadwal pengiriman notifikasi.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">

            <thead className="bg-slate-50 text-sm text-slate-500">

              <tr>

                <th className="px-6 py-4 text-left">
                  Cicilan
                </th>

                <th className="px-6 py-4 text-left">
                  Jatuh Tempo
                </th>

                <th className="px-6 py-4 text-left">
                  Nominal
                </th>

                <th className="px-6 py-4 text-left">
                  Jadwal Kirim
                </th>

                <th className="px-6 py-4 text-center">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {reminders.map((reminder, index) => {
                const jadwal = reminder.jadwal_angsuran;

                const view = getStatusView(
                  reminder.status
                );

                const Icon = view.icon;

                return (
                  <tr
                    key={reminder.id_reminder}
                    className="border-t hover:bg-slate-50"
                  >

                    <td className="px-6 py-5 font-semibold">
                      Cicilan {index + 1}
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      {formatTanggal(
                        jadwal.jatuh_tempo
                      )}
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      {formatRupiah(
                        jadwal.jumlah_tagihan
                      )}
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      {formatTanggal(
                        reminder.jadwal_kirim
                      )}
                    </td>

                    <td className="px-6 py-5 text-center">

                      <span
                        className={`
                          inline-flex
                          min-w-[170px]
                          items-center
                          justify-center
                          gap-2
                          rounded-full
                          px-4
                          py-2
                          text-sm
                          font-semibold
                          ${view.className}
                        `}
                      >
                        <Icon size={18} />
                        {view.label}
                      </span>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}