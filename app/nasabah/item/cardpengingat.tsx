"use client";

import {
  Bell,
  CreditCard,
  Building2,
  X,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  data: {
    cicilanKe: number;
    totalCicilan: number;
    jatuhTempo: Date;
    nominal: number;
    status: string;
    idPeminjaman: number;
  } | null;
};

export default function CardPengingatAngsuran({
  data,
}: Props) {
  const router = useRouter();

  const [showPaymentModal, setShowPaymentModal] =
    useState(false);

  if (!data) return null;

  const statusColor = {
    PENDING:
      "bg-yellow-50 text-yellow-700 border-yellow-100",

    MENUNGGU:
      "bg-yellow-50 text-yellow-700 border-yellow-100",

    TELAT:
      "bg-red-50 text-red-700 border-red-100",

    LUNAS:
      "bg-green-50 text-green-700 border-green-100",
  };

  const statusLabel = {
    PENDING: "Menunggu",
    MENUNGGU: "Menunggu",
    TELAT: "Telat",
    LUNAS: "Lunas",
  };

  // =========================
  // BAYAR TRANSFER
  // =========================
  const handleTransfer = () => {
    setShowPaymentModal(false);

    router.push(
      `/nasabah/pembayaran/${data.idPeminjaman}`
    );
  };

  // =========================
  // BAYAR DI KANTOR
  // =========================
  const handleCashPayment = () => {
    setShowPaymentModal(false);

    router.push(
      `/nasabah/cicilan/${data.idPeminjaman}`
    );
  };

  // =========================
  // LIHAT DETAIL
  // =========================
  const handleDetail = () => {
    router.push(
      `/nasabah/cicilan/${data.idPeminjaman}`
    );
  };

  const normalizedStatus = data.status.toUpperCase() as keyof typeof statusColor;
  const badgeColor =
    statusColor[normalizedStatus] ??
    "bg-gray-100 text-gray-600 border-gray-200";
  const badgeLabel =
    statusLabel[normalizedStatus] ?? data.status;

  return (
    <>
      {/* =====================================================
          CARD PENGINGAT
      ===================================================== */}
      <div className="relative min-h-[290px] overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6">

        {/* GLOW */}
        <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-100/70 blur-2xl" />

        {/* HEADER */}
        <div className="relative flex items-center gap-3">

          {/* ICON */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
            <Bell className="h-5 w-5 text-emerald-600" />
          </div>

          {/* TITLE */}
          <div className="min-w-0">

            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              Pengingat Angsuran
            </h3>

            <p className="mt-0.5 text-xs text-gray-500">
              Cicilan ke-{data.cicilanKe} dari{" "}
              {data.totalCicilan}
            </p>

          </div>

        </div>

        {/* INFO */}
        <div className="relative mt-5 grid grid-cols-2 gap-4">

          {/* JATUH TEMPO */}
          <div>

            <p className="text-xs text-gray-500">
              Jatuh Tempo
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-800">
              {new Date(
                data.jatuhTempo
              ).toLocaleDateString(
                "id-ID",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              )}
            </p>

          </div>

          {/* NOMINAL */}
          <div>

            <p className="text-xs text-gray-500">
              Nominal
            </p>

            <p className="mt-1 text-sm font-semibold text-emerald-600">
              Rp{" "}
              {Number(
                data.nominal
              ).toLocaleString("id-ID")}
            </p>

          </div>

        </div>

        {/* STATUS */}
        <div className="relative mt-5">

          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${badgeColor}`}
          >
            {badgeLabel}
          </span>

        </div>

        {/* ACTION */}
        <div className="relative mt-5">

          {/* BAYAR SEKARANG */}
          <button
            onClick={() =>
              setShowPaymentModal(true)
            }
            disabled={
              data.status === "LUNAS" ||
              data.status === "MENUNGGU"
            }
            className="h-10 w-full rounded-lg bg-[#1a3c2e] px-4 text-sm font-medium text-white transition-all hover:bg-[#142f24] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            Bayar Sekarang
          </button>

          {/* LIHAT DETAIL */}
          <button
            onClick={handleDetail}
            className="mt-2 h-8 w-full rounded-lg px-4 text-xs font-medium text-[#1a3c2e] transition-colors hover:bg-emerald-50"
          >
            Lihat Detail
          </button>

        </div>

      </div>


      {/* =====================================================
          MODAL PILIH METODE PEMBAYARAN
      ===================================================== */}
      {showPaymentModal && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          onClick={() =>
            setShowPaymentModal(false)
          }
        >

          {/* MODAL */}
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER MODAL */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

              <div>

                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  Pilih Metode Pembayaran
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Pilih metode pembayaran cicilan Anda
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowPaymentModal(false)
                }
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                aria-label="Tutup"
              >
                <X className="h-4 w-4" />
              </button>

            </div>


            {/* BODY */}
            <div className="space-y-3 p-5 sm:p-6">

              {/* TRANSFER */}
              <button
                type="button"
                onClick={handleTransfer}
                className="group flex w-full items-center gap-4 rounded-xl border border-gray-200 p-4 text-left transition-all hover:border-[#1a3c2e]/30 hover:bg-emerald-50/50 hover:shadow-sm"
              >

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#1a3c2e] transition-colors group-hover:bg-[#1a3c2e] group-hover:text-white">
                  <CreditCard className="h-5 w-5" />
                </div>

                <div className="min-w-0">

                  <p className="text-sm font-semibold text-gray-800">
                    Bayar Transfer
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    Bayar melalui transfer dan upload bukti pembayaran
                  </p>

                </div>

              </button>


              {/* KANTOR */}
              <button
                type="button"
                onClick={handleCashPayment}
                className="group flex w-full items-center gap-4 rounded-xl border border-gray-200 p-4 text-left transition-all hover:border-[#1a3c2e]/30 hover:bg-emerald-50/50 hover:shadow-sm"
              >

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#1a3c2e] transition-colors group-hover:bg-[#1a3c2e] group-hover:text-white">
                  <Building2 className="h-5 w-5" />
                </div>

                <div className="min-w-0">

                  <p className="text-sm font-semibold text-gray-800">
                    Bayar di Kantor
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    Lakukan pembayaran secara langsung di kantor BUMDes
                  </p>

                </div>

              </button>

            </div>


            {/* FOOTER */}
            <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">

              <button
                type="button"
                onClick={() =>
                  setShowPaymentModal(false)
                }
                className="h-8 w-full rounded-lg px-4 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                Batal
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
}