import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Wallet,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

type Props = {
  pembayaran: any;
};

export default function ClientPage({
  pembayaran,
}: Props) {
  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  const formatTanggal = (tanggal: string | Date) =>
    new Date(tanggal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const statusConfig = {
    BERHASIL: {
      color:
        "bg-green-100 text-green-700 border-green-200",
      icon: CheckCircle2,
    },

    MENUNGGU: {
      color:
        "bg-yellow-100 text-yellow-700 border-yellow-200",
      icon: Clock3,
    },

    DITOLAK: {
      color:
        "bg-red-100 text-red-700 border-red-200",
      icon: XCircle,
    },
  };

  const current =
    statusConfig[
      pembayaran.status as keyof typeof statusConfig
    ];

  const StatusIcon =
    current?.icon ??
    Clock3;

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="mx-auto max-w-4xl p-5 md:p-8">

        {/* HEADER */}

        <div className="mb-6">

          <Link
            href="/nasabah/simpanan"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-green-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            Detail Pembayaran
          </h1>

          <p className="mt-1 text-slate-500">
            Informasi pembayaran simpanan wajib
          </p>

        </div>

        {/* STATUS */}

        <div
          className={`mb-6 rounded-3xl border p-6 ${current.color}`}
        >

          <div className="flex items-center gap-3">

            <StatusIcon className="h-8 w-8" />

            <div>

              <p className="text-sm">
                Status Pembayaran
              </p>

              <h2 className="text-2xl font-bold">
                {pembayaran.status}
              </h2>

            </div>

          </div>

        </div>

        {/* INFORMASI */}

        <div className="rounded-3xl border bg-white p-6 shadow-sm">

          <h3 className="mb-5 text-lg font-semibold">
            Informasi Pembayaran
          </h3>

          <div className="grid gap-5 md:grid-cols-2">

            <InfoItem
              icon={<CalendarDays className="h-5 w-5" />}
              label="Bulan Ke"
              value={`Bulan ${pembayaran.bulan_ke}`}
            />

            <InfoItem
              icon={<Wallet className="h-5 w-5" />}
              label="Nominal"
              value={formatRupiah(
                pembayaran.nominal_bayar
              )}
            />

            <InfoItem
              icon={<Wallet className="h-5 w-5" />}
              label="Metode"
              value={
                pembayaran.metode_bayar ??
                "-"
              }
            />

            <InfoItem
              icon={<CalendarDays className="h-5 w-5" />}
              label="Tanggal Bayar"
              value={formatTanggal(
                pembayaran.tanggal_bayar
              )}
            />

          </div>

        </div>

        {/* CATATAN */}

        <div className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">

          <h3 className="mb-4 text-lg font-semibold">
            Catatan
          </h3>

          <div className="rounded-2xl bg-slate-50 p-4 text-slate-600">

            {pembayaran.catatan ||
              "Tidak ada catatan."}

          </div>

        </div>

        {/* BUKTI */}

        <div className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">

          <h3 className="mb-5 text-lg font-semibold">
            Bukti Pembayaran
          </h3>

          {pembayaran.bukti_bayar ? (

            <>

              <img
                src={
                  pembayaran.bukti_bayar
                }
                className="h-72 w-full rounded-2xl border object-cover"
              />

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                <a
                  href={
                    pembayaran.bukti_bayar
                  }
                  target="_blank"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-white hover:bg-blue-700"
                >
                  <Eye className="h-5 w-5" />
                  Lihat Fullscreen
                </a>

                <a
                  href={
                    pembayaran.bukti_bayar
                  }
                  download
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 hover:bg-slate-100"
                >
                  <Download className="h-5 w-5" />
                  Download
                </a>

              </div>

            </>

          ) : (

            <div className="rounded-2xl border border-dashed p-8 text-center text-slate-500">

              <FileText className="mx-auto mb-3 h-10 w-10" />

              Belum ada bukti pembayaran.

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border p-4">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
        {icon}
      </div>

      <div>

        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="font-semibold text-slate-800">
          {value}
        </p>

      </div>

    </div>
  );
}