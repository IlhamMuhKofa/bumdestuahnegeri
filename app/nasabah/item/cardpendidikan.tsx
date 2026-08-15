"use client";

import {
  GraduationCap,
  Target,
  Wallet,
} from "lucide-react";

import { useRouter } from "next/navigation";

type Tabungan = {
  id_simpanan: number;
  tujuan: string;
  target_dana: number;
  jangka_waktu: number;
  total_terkumpul: number;
};

type Props = {
  data: Tabungan | null;
};

// Dashboard Variant V1:
// card radius 16px • padding 20/24px • section title 18/16px
// metric 18px • secondary 12px • badge 12px • CTA 40px
export default function CardPendidikan({
  data,
}: Props) {
  const router = useRouter();

  // =========================
  // EMPTY
  // =========================
  if (!data) {
    return null;
  }

  // =========================
  // PROGRESS
  // =========================
  const progress = Math.min(
    Math.round(
      (data.total_terkumpul /
        data.target_dana) *
        100
    ),
    100
  );

  // =========================
  // SARAN SETORAN
  // =========================
  const saranSetoran = Math.ceil(
    data.target_dana /
      data.jangka_waktu
  );

  // =========================
  // SISA TARGET
  // =========================
  const sisaTarget = Math.max(
    data.target_dana -
      data.total_terkumpul,
    0
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

      {/* HEADER */}
      <div className="p-5 sm:p-6">

        {/* ICON + TITLE */}
        <div className="mb-3 flex items-center gap-3">

          {/* ICON */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <GraduationCap className="h-5 w-5 text-green-700" />
          </div>

          {/* TITLE */}
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">

            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              {data.tujuan}
            </h3>

            <span className="rounded-full bg-[#1a3c2e] px-2.5 py-1 text-xs font-medium text-white">
              {data.jangka_waktu} Bulan
            </span>

          </div>

        </div>

        {/* STATS */}
        <div className="grid gap-3 sm:grid-cols-3">

          {/* TARGET */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

            <div className="mb-1.5 flex items-center gap-1.5 text-gray-500">
              <Target className="h-3.5 w-3.5 shrink-0" />

              <span className="text-xs font-medium uppercase tracking-wide">
                Target Dana
              </span>
            </div>

            <p className="break-words text-lg font-semibold text-gray-800">
              Rp{" "}
              {Number(
                data.target_dana
              ).toLocaleString("id-ID")}
            </p>

          </div>

          {/* TERKUMPUL */}
          <div className="rounded-xl border border-green-100 bg-green-50 p-4">

            <div className="mb-1.5 flex items-center gap-1.5 text-green-700">
              <Wallet className="h-3.5 w-3.5 shrink-0" />

              <span className="text-xs font-medium uppercase tracking-wide">
                Terkumpul
              </span>
            </div>

            <p className="break-words text-lg font-semibold text-green-700">
              Rp{" "}
              {Number(
                data.total_terkumpul
              ).toLocaleString("id-ID")}
            </p>

          </div>

          {/* SARAN */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

            <div className="mb-1.5 flex items-center gap-1.5 text-gray-500">
              <Wallet className="h-3.5 w-3.5 shrink-0" />

              <span className="text-xs font-medium uppercase tracking-wide">
                Saran / Bulan
              </span>
            </div>

            <p className="break-words text-lg font-semibold text-gray-800">
              Rp{" "}
              {saranSetoran.toLocaleString("id-ID")}
            </p>

          </div>

        </div>

        {/* PROGRESS */}
        <div className="mt-3">

          <div className="mb-2 flex items-center justify-between gap-2 text-xs text-gray-500">

            <span className="truncate">
              Rp{" "}
              {data.total_terkumpul.toLocaleString(
                "id-ID"
              )}{" "}
              terkumpul
            </span>

            <span className="shrink-0 font-semibold text-gray-600">
              {progress}%
            </span>

          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-100">

            <div
              className="h-full rounded-full bg-[#1a3c2e] transition-all"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        {/* FOOTER */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="text-xs text-gray-500">

            Sisa target:

            <span className="ml-1 font-semibold text-gray-700">
              Rp{" "}
              {sisaTarget.toLocaleString("id-ID")}
            </span>

          </div>

          <button
            onClick={() =>
              router.push(
                `/nasabah/simpanan/pembayaran/pendidikan/${data.id_simpanan}`
              )
            }
            className="h-10 w-full sm:w-auto rounded-lg bg-[#1a3c2e] px-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#142f24] hover:shadow-md"
          >
            Bayar Setoran
          </button>

        </div>

      </div>

    </div>
  );
}