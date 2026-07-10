"use client";

import { useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  Wallet,
  Target,
  PiggyBank,
  CalendarDays,
  Download,
  Eye,
  FileText,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

type Props = {
  pembayaran: any;
  totalTerkumpul: number;
  progress: number;
};

export default function ClientPage({
  pembayaran,
  totalTerkumpul,
  progress,
}: Props) {
  const [preview, setPreview] = useState(false);

  const formatRupiah = (nominal: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(nominal);

  const formatTanggal = (tanggal: string | Date) =>
    new Date(tanggal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const statusConfig = {
    BERHASIL: {
      icon: CheckCircle2,
      className:
        "bg-green-100 text-green-700 border-green-200",
    },
    MENUNGGU: {
      icon: Clock3,
      className:
        "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    DITOLAK: {
      icon: XCircle,
      className:
        "bg-red-100 text-red-700 border-red-200",
    },
  };

  const current =
    statusConfig[
      pembayaran.status as keyof typeof statusConfig
    ];

  const StatusIcon =
    current?.icon ?? Clock3;

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="mx-auto max-w-5xl p-5 md:p-8">

        {/* HEADER */}

        <Link
          href="/nasabah/simpanan"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-green-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>

        <h1 className="mt-5 text-3xl font-bold text-slate-900">
          Detail Pembayaran Pendidikan
        </h1>

        <p className="mt-2 text-slate-500">
          Informasi pembayaran tabungan pendidikan.
        </p>

        {/* STATUS */}

        <div
          className={`mt-8 rounded-3xl border p-6 ${current.className}`}
        >
          <div className="flex items-center gap-4">

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

        {/* CARD */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* TABUNGAN */}

          <div className="rounded-3xl border bg-white p-6 shadow-sm">

            <h3 className="mb-5 text-lg font-semibold">
              Informasi Tabungan
            </h3>

            <InfoItem
              icon={<Target className="h-5 w-5" />}
              label="Tujuan"
              value={pembayaran.simpanan.tujuan}
            />

            <InfoItem
              icon={<Wallet className="h-5 w-5" />}
              label="Target Dana"
              value={formatRupiah(
                pembayaran.simpanan.target_dana
              )}
            />

            <InfoItem
              icon={<PiggyBank className="h-5 w-5" />}
              label="Total Terkumpul"
              value={formatRupiah(totalTerkumpul)}
            />

            <div className="mt-6">

              <div className="mb-2 flex justify-between text-sm">

                <span>Progress</span>

                <span>{progress}%</span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                <div
                  className="h-full rounded-full bg-green-600 transition-all"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

            </div>

          </div>

          {/* PEMBAYARAN */}

          <div className="rounded-3xl border bg-white p-6 shadow-sm">

            <h3 className="mb-5 text-lg font-semibold">
              Informasi Pembayaran
            </h3>

            <InfoItem
              icon={<Wallet className="h-5 w-5" />}
              label="Nominal Setoran"
              value={formatRupiah(
                pembayaran.nominal_bayar
              )}
            />

            <InfoItem
              icon={<CalendarDays className="h-5 w-5" />}
              label="Tanggal Bayar"
              value={formatTanggal(
                pembayaran.tanggal_bayar
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
                src={pembayaran.bukti_bayar}
                className="h-72 w-full cursor-pointer rounded-2xl border object-cover hover:opacity-90"
                onClick={() =>
                  setPreview(true)
                }
              />

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                <button
                  onClick={() =>
                    setPreview(true)
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-white hover:bg-blue-700"
                >
                  <Eye className="h-5 w-5" />
                  Lihat Fullscreen
                </button>

                <a
                  href={pembayaran.bukti_bayar}
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

      {/* MODAL PREVIEW */}

      {preview && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5"
          onClick={() =>
            setPreview(false)
          }
        >

          <img
            src={pembayaran.bukti_bayar}
            className="max-h-[90vh] max-w-full rounded-2xl"
          />

        </div>

      )}

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
    <div className="mb-5 flex gap-4">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
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