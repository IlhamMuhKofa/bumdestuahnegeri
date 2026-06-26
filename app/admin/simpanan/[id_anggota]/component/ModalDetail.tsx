"use client";

import React from "react";
import { createPortal } from "react-dom";
import {
  X,
  CalendarDays,
  Wallet,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;

  pembayaran: {
    id: number;
    bulan_ke?: number;
    tanggal: Date | string;
    nominal: number;
    status: string;
    metode?: string | null;
    bukti_bayar?: string | null;
    catatan?: string | null;
  } | null;
};

function InfoCard({
  icon,
  title,
  value,
}: {
  icon?: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
        {icon}
        {title}
      </div>

      <p className="font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

export default function ModalDetail({
  open,
  onClose,
  pembayaran,
}: Props) {
  if (!open || !pembayaran) return null;

  const statusStyle =
    pembayaran.status === "BERHASIL"
      ? {
          bg: "from-green-600 to-emerald-500",
          badge:
            "bg-white/20 text-white",
        }
      : pembayaran.status ===
        "DITOLAK"
      ? {
          bg: "from-red-600 to-rose-500",
          badge:
            "bg-white/20 text-white",
        }
      : {
          bg: "from-yellow-500 to-amber-400",
          badge:
            "bg-white/20 text-white",
        };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)]">

        {/* Header */}
        <div className="sticky top-0 z-20 border-b bg-white px-6 py-5">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold text-slate-900">
                Detail Pembayaran
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Informasi transaksi pembayaran simpanan
              </p>

            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

          </div>

        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">

          <div className="space-y-6">

            {/* Summary */}
            <div
              className={`rounded-3xl bg-gradient-to-r ${statusStyle.bg} p-6 text-white`}
            >

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm opacity-90">
                    Total Pembayaran
                  </p>

                  <h3 className="mt-2 text-4xl font-bold">
                    Rp{" "}
                    {pembayaran.nominal.toLocaleString(
                      "id-ID"
                    )}
                  </h3>

                </div>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold backdrop-blur ${statusStyle.badge}`}
                >
                  {pembayaran.status}
                </span>

              </div>

            </div>

            {/* Informasi */}
            <div>

              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Informasi Pembayaran
              </h3>

              <div className="grid gap-4 md:grid-cols-2">

                <InfoCard
                  icon={
                    <CalendarDays className="h-4 w-4" />
                  }
                  title="Tanggal Bayar"
                  value={new Date(
                    pembayaran.tanggal
                  ).toLocaleDateString(
                    "id-ID",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                />

                <InfoCard
                  icon={
                    <Wallet className="h-4 w-4" />
                  }
                  title="Metode Pembayaran"
                  value={
                    pembayaran.metode ||
                    "-"
                  }
                />

                {pembayaran.bulan_ke && (
                  <InfoCard
                    title="Bulan Ke"
                    value={String(
                      pembayaran.bulan_ke
                    )}
                  />
                )}

                <InfoCard
                  title="Nominal"
                  value={`Rp ${pembayaran.nominal.toLocaleString(
                    "id-ID"
                  )}`}
                />

              </div>

            </div>

            {/* Catatan */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

              <div className="mb-3 flex items-center gap-2 font-semibold text-slate-700">

                <FileText className="h-4 w-4" />

                Catatan

              </div>

              <p className="leading-relaxed text-slate-600">
                {pembayaran.catatan ||
                  "Tidak ada catatan untuk transaksi ini."}
              </p>

            </div>

            {/* Bukti Pembayaran */}
            <div className="rounded-2xl border border-slate-200 p-5">

              <div className="mb-4 flex items-center gap-2 font-semibold text-slate-700">

                <ImageIcon className="h-4 w-4" />

                Bukti Pembayaran

              </div>

              {pembayaran.bukti_bayar ? (
                <div className="space-y-4">

                  <div className="overflow-hidden rounded-2xl border border-slate-200">

                    <img
                      src={
                        pembayaran.bukti_bayar
                      }
                      alt="Bukti Pembayaran"
                      className="max-h-[320px] w-full object-cover transition duration-300 hover:scale-[1.02]"
                    />

                  </div>

                  <a
                    href={
                      pembayaran.bukti_bayar
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-xl bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-800"
                  >
                    Lihat Ukuran Penuh
                  </a>

                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

                  <ImageIcon className="mx-auto mb-3 h-10 w-10 text-slate-300" />

                  <p className="text-slate-500">
                    Tidak ada bukti pembayaran
                  </p>

                </div>
              )}

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t bg-white px-6 py-4">

          <div className="flex justify-end">

            <button
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Tutup
            </button>

          </div>

        </div>

      </div>

    </div>,
    document.body
  );
}