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
    <div className="min-h-screen bg-gray-50">

      <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:p-6">

        {/* HEADER */}
        <div className="mb-6">

          <Link
            href="/nasabah/simpanan"
            className="h-8 -ml-3 inline-flex items-center gap-2 rounded-lg px-3 text-xs font-medium text-gray-600 transition-colors hover:bg-white hover:text-[#1a3c2e]"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-800 sm:text-[30px]">
            Detail Pembayaran
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Informasi pembayaran simpanan wajib
          </p>

        </div>

        {/* STATUS */}
        <div
          className={`mb-6 rounded-2xl border p-5 sm:p-6 ${current?.color ?? "bg-gray-100 text-gray-600 border-gray-200"}`}
        >

          <div className="flex items-center gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/50">
              <StatusIcon className="h-5 w-5" />
            </div>

            <div>

              <p className="text-xs font-medium">
                Status Pembayaran
              </p>

              <h2 className="mt-1 text-lg font-semibold sm:text-2xl">
                {pembayaran.status}
              </h2>

            </div>

          </div>

        </div>

        {/* INFORMASI */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

          <h3 className="mb-5 text-base font-semibold text-gray-900 sm:text-lg">
            Informasi Pembayaran
          </h3>

          <div className="grid gap-3 md:grid-cols-2">

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
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

          <h3 className="mb-4 text-base font-semibold text-gray-900 sm:text-lg">
            Catatan
          </h3>

          <div className="rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-600">

            {pembayaran.catatan ||
              "Tidak ada catatan."}

          </div>

        </div>

        {/* BUKTI */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

          <h3 className="mb-5 text-base font-semibold text-gray-900 sm:text-lg">
            Bukti Pembayaran
          </h3>

          {pembayaran.bukti_bayar ? (

            <>

              <img
                src={
                  pembayaran.bukti_bayar
                }
                alt="Bukti pembayaran"
                className="h-72 w-full rounded-xl border object-cover"
              />

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                <a
                  href={
                    pembayaran.bukti_bayar
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1a3c2e] px-4 text-sm font-medium text-white transition-colors hover:bg-[#142f24]"
                >
                  <Eye className="h-4 w-4" />
                  Lihat Fullscreen
                </a>

                <a
                  href={
                    pembayaran.bukti_bayar
                  }
                  download
                  className="h-10 flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>

              </div>

            </>

          ) : (

            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-gray-500">

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
    <div className="flex gap-4 rounded-xl border border-gray-200 p-4">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-xs text-gray-500">
          {label}
        </p>

        <p className="mt-0.5 text-sm font-semibold text-gray-800">
          {value}
        </p>

      </div>

    </div>
  );
}