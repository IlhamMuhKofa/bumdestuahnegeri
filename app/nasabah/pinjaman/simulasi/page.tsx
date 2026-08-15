"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calculator,
  Clock,
  Wallet,
  Receipt,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

type SimulasiResult = {
  cicilan_per_bulan: number;
};

const durationOptions = [
  { value: 12, label: "12 Bulan" },
  { value: 18, label: "18 Bulan" },
  { value: 24, label: "24 Bulan" },
];

// Design System v1 — mengikuti halaman Pinjaman
const UI = {
  pageTitle: "text-2xl sm:text-[30px] font-bold tracking-tight text-gray-800",
  pageDescription: "text-sm leading-relaxed text-gray-500",
  sectionTitle: "text-base sm:text-lg font-semibold text-gray-900",
  componentTitle: "text-sm sm:text-base font-semibold",
  body: "text-sm",
  secondary: "text-xs",
  button:
    "h-10 px-4 rounded-lg text-sm font-medium inline-flex items-center justify-center transition-all",
  smallButton:
    "h-8 px-3 rounded-lg text-xs font-medium inline-flex items-center justify-center transition-all",
  card: "rounded-2xl border border-gray-200 bg-white shadow-sm",
} as const;

export default function SimulasiPinjamanPage() {
  const [loanAmount, setLoanAmount] = useState<number>(5_000_000);
  const [duration, setDuration] = useState<number>(12);

  const [results, setResults] =
    useState<SimulasiResult | null>(null);

  const [loading, setLoading] = useState(false);

  // =========================
  // VALIDASI NOMINAL
  // =========================
  const nominalValid =
    loanAmount >= 1_000_000 &&
    loanAmount <= 30_000_000 &&
    loanAmount % 1_000_000 === 0;

  // =========================
  // FORMAT RUPIAH
  // =========================
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("id-ID").format(value);
  };

  // =========================
  // AMBIL HASIL SIMULASI
  // =========================
  useEffect(() => {
    if (!nominalValid) {
      setResults(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadSimulasi = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/simulasi?jumlah=${loanAmount}&tenor=${duration}`,
          {
            signal: controller.signal,
          }
        );

        const json = await res.json();

        if (json.success) {
          setResults(json.data);
        } else {
          setResults(null);
        }
      } catch (error: any) {
        if (error?.name !== "AbortError") {
          console.error("Gagal mengambil simulasi:", error);
          setResults(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadSimulasi();

    return () => {
      controller.abort();
    };
  }, [loanAmount, duration, nominalValid]);

  // =========================
  // HASIL PERHITUNGAN
  // =========================
  const cicilanPerBulan =
    results?.cicilan_per_bulan ?? 0;

  const totalBayar =
    cicilanPerBulan * duration;

  const totalBunga =
    Math.max(totalBayar - loanAmount, 0);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-5 sm:p-6">
      {/* Design System v1:
          Page title 30/24px • section 18/16px • body 14px • secondary 12px
          Controls 40–44px • small actions 32px • card radius 16px • control radius 8px */}

      <div className="mx-auto w-full max-w-6xl">

        {/* =========================
            HEADER
        ========================= */}
        <div className="mb-6">

          <Link
            href="/nasabah/pinjaman"
            className={`${UI.smallButton} gap-2 -ml-3 text-gray-600 hover:bg-white hover:text-[#1a3c2e]`}
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Pinjaman
          </Link>

          <div className="mt-4">

            <div className="mb-2 flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a3c2e]">
                <Calculator className="h-4 w-4 text-white" />
              </div>

              <span className="text-sm font-semibold text-[#1a3c2e]">
                Simulasi Pinjaman
              </span>

            </div>

            <h1 className={UI.pageTitle}>
              Hitung Estimasi Angsuran
            </h1>

            <p className={`mt-2 max-w-2xl ${UI.pageDescription}`}>
              Masukkan jumlah pinjaman dan jangka waktu
              untuk melihat estimasi cicilan Anda.
            </p>

          </div>
        </div>

        {/* =========================
            CALCULATOR
        ========================= */}
        <div className="grid gap-5 lg:grid-cols-5">

          {/* =========================
              INPUT
          ========================= */}
          <section className={`lg:col-span-3 ${UI.card} p-4 sm:p-6`}>

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                <Wallet className="h-5 w-5 text-[#1a3c2e]" />
              </div>

              <div>
                <h2 className={UI.sectionTitle}>
                  Data Pinjaman
                </h2>

                <p className="text-xs text-gray-500">
                  Tentukan nominal dan tenor pinjaman
                </p>
              </div>

            </div>

            {/* NOMINAL */}
            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Jumlah Pinjaman
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
                  Rp
                </span>

                <input
                  type="text"
                  inputMode="numeric"
                  value={formatNumber(loanAmount)}
                  onChange={(e) => {
                    const angka = Number(
                      e.target.value.replace(/\D/g, "")
                    );

                    if (angka <= 30_000_000) {
                      setLoanAmount(angka);
                    }
                  }}
                  className="
                    h-11
                    w-full
                    rounded-lg
                    border
                    border-gray-200
                    bg-gray-50
                    pl-11
                    pr-4
                    text-base
                    font-semibold
                    text-gray-900
                    outline-none
                    transition
                    focus:border-[#1a3c2e]
                    focus:bg-white
                    focus:ring-2
                    focus:ring-[#1a3c2e]/10
                  "
                />

              </div>

              <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>Minimal Rp1.000.000</span>
                <span>Maksimal Rp30.000.000</span>
              </div>

              <div className="mt-2">

                {nominalValid ? (
                  <p className="text-xs font-medium text-green-600">
                    ✓ Nominal tersedia
                  </p>
                ) : (
                  <p className="text-xs font-medium text-red-500">
                    Nominal harus kelipatan Rp1.000.000
                  </p>
                )}

              </div>

            </div>

            {/* TENOR */}
            <div className="mt-5">

              <div className="mb-2 flex items-center justify-between">

                <label className="text-sm font-medium text-gray-700">
                  Jangka Waktu
                </label>

                <Clock className="h-4 w-4 text-gray-400" />

              </div>

              <div className="grid grid-cols-3 gap-2">

                {durationOptions.map((option) => {

                  const active =
                    duration === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setDuration(option.value)
                      }
                      className={`
                        h-10
                        rounded-lg
                        border
                        px-3
                        text-sm
                        font-medium
                        transition-all
                        ${
                          active
                            ? "border-[#1a3c2e] bg-[#1a3c2e] text-white shadow-sm"
                            : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  );
                })}

              </div>

            </div>

            {/* INFORMASI BUNGA */}
            <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4">

              <p className="text-xs font-semibold text-[#1a3c2e]">
                Informasi Bunga
              </p>

              <p className="mt-1 text-xs leading-relaxed text-gray-600">
                Perhitungan menggunakan bunga flat
                sebesar{" "}
                <span className="font-semibold text-gray-800">
                  1,5% per bulan
                </span>{" "}
                atau{" "}
                <span className="font-semibold text-gray-800">
                  18% per tahun
                </span>.
              </p>

            </div>

          </section>

          {/* =========================
              HASIL
          ========================= */}
          <section className="lg:col-span-2">

            <div className="rounded-2xl bg-[#1a3c2e] p-4 text-white shadow-sm sm:p-6">

              {/* HEADER HASIL */}
              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                  <Receipt className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base sm:text-lg font-semibold">
                    Hasil Simulasi
                  </h2>

                  <p className="text-xs text-emerald-100">
                    Estimasi berdasarkan pilihan Anda
                  </p>
                </div>

              </div>

              {/* CICILAN UTAMA */}
              <div className="rounded-xl bg-white/10 p-4">

                <div className="flex items-center gap-2">

                  <TrendingUp className="h-4 w-4 text-yellow-300" />

                  <p className="text-xs text-emerald-100">
                    Angsuran per Bulan
                  </p>

                </div>

                <div className="mt-2">

                  {loading ? (
                    <div className="flex items-center gap-2">

                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      <span className="text-sm text-emerald-100">
                        Menghitung...
                      </span>

                    </div>
                  ) : (
                    <p className="text-2xl sm:text-[30px] font-bold tracking-tight">
                      {results
                        ? formatCurrency(
                            results.cicilan_per_bulan
                          )
                        : "-"}
                    </p>
                  )}

                </div>

                <p className="mt-1 text-xs text-emerald-200">
                  Selama {duration} bulan
                </p>

              </div>

              {/* DETAIL */}
              <div className="mt-3 space-y-2">

                <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5">

                  <span className="text-xs text-emerald-100">
                    Suku Bunga
                  </span>

                  <span className="text-sm font-semibold">
                    1,5% / bulan
                  </span>

                </div>

                <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5">

                  <span className="text-xs text-emerald-100">
                    Total Bunga
                  </span>

                  <span className="text-sm font-semibold">
                    {results
                      ? formatCurrency(totalBunga)
                      : "-"}
                  </span>

                </div>

                <div className="rounded-lg bg-white/10 px-3 py-3">

                  <p className="text-xs text-emerald-100">
                    Total Pembayaran
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {results
                      ? formatCurrency(totalBayar)
                      : "-"}
                  </p>

                </div>

              </div>

              {/* POKOK */}
              <div className="mt-4 border-t border-white/10 pt-4">

                <div className="flex items-center justify-between gap-3 text-xs">

                  <span className="text-emerald-100">
                    Pokok Pinjaman
                  </span>

                  <span className="font-semibold">
                    {formatCurrency(loanAmount)}
                  </span>

                </div>

              </div>

            </div>

          </section>

        </div>

        {/* =========================
            CATATAN
        ========================= */}
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">

          <p className="text-xs leading-relaxed text-gray-700">

            <span className="font-semibold text-amber-700">
              Informasi penting:
            </span>{" "}
            Nasabah baru dapat mengajukan pinjaman maksimal{" "}
            <span className="font-semibold">
              Rp30.000.000
            </span>
            . Hasil simulasi merupakan estimasi berdasarkan
            bunga flat 1,5% per bulan dan dapat disesuaikan
            dengan hasil persetujuan BUMDes.

          </p>

        </div>

      </div>

    </main>
  );
}