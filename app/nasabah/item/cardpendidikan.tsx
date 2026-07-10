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
    <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-100 bg-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* HEADER */}
      <div className="p-4 sm:p-6">

        {/* ICON + TITLE ROW */}
        <div className="mb-4 flex items-center gap-3">

          {/* ICON */}
          <div className="flex h-11 w-11 sm:h-14 sm:w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-50">

            <GraduationCap className="h-5 w-5 sm:h-7 sm:w-7 text-green-700" />

          </div>

          {/* TITLE */}
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:gap-3">

            <h3 className="text-base sm:text-xl font-bold text-gray-800">
              {data.tujuan}
            </h3>

            <span className="rounded-full bg-[#1a3c2e] px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold text-white">

              {data.jangka_waktu} Bulan

            </span>

          </div>

        </div>

        {/* CONTENT (full width, no longer indented by the icon) */}
        <div>

            {/* STATS */}
            <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-3">

              {/* TARGET */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3.5 sm:p-4">

                <div className="mb-2 flex items-center gap-2 text-gray-500">

                  <Target className="h-4 w-4 flex-shrink-0" />

                  <span className="text-xs font-medium uppercase tracking-wide">
                    Target Dana
                  </span>

                </div>

                <p className="break-words text-base sm:text-lg font-bold text-gray-800">

                  Rp{" "}
                  {Number(
                    data.target_dana
                  ).toLocaleString(
                    "id-ID"
                  )}

                </p>

              </div>

              {/* TERKUMPUL */}
              <div className="rounded-2xl border border-green-100 bg-green-50 p-3.5 sm:p-4">

                <div className="mb-2 flex items-center gap-2 text-green-700">

                  <Wallet className="h-4 w-4 flex-shrink-0" />

                  <span className="text-xs font-medium uppercase tracking-wide">
                    Terkumpul
                  </span>

                </div>

                <p className="break-words text-base sm:text-lg font-bold text-green-700">

                  Rp{" "}
                  {Number(
                    data.total_terkumpul
                  ).toLocaleString(
                    "id-ID"
                  )}

                </p>

              </div>

              {/* SARAN */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3.5 sm:p-4">

                <div className="mb-2 flex items-center gap-2 text-gray-500">

                  <Wallet className="h-4 w-4 flex-shrink-0" />

                  <span className="text-xs font-medium uppercase tracking-wide">
                    Saran / Bulan
                  </span>

                </div>

                <p className="break-words text-base sm:text-lg font-bold text-gray-800">

                  Rp{" "}
                  {saranSetoran.toLocaleString(
                    "id-ID"
                  )}

                </p>

              </div>

            </div>

            {/* PROGRESS BAR */}
            <div className="mt-4 sm:mt-5">

              <div className="mb-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs text-gray-500">

                <span>

                  Rp{" "}
                  {data.total_terkumpul.toLocaleString(
                    "id-ID"
                  )}{" "}
                  terkumpul dari target

                </span>

                <span className="font-semibold text-gray-600">
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
            <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div className="text-xs sm:text-sm text-gray-500">

                Sisa target:

                <span className="ml-2 font-semibold text-gray-700">

                  Rp{" "}
                  {sisaTarget.toLocaleString(
                    "id-ID"
                  )}

                </span>

              </div>
              <button
                onClick={() =>
                  router.push(
                    `/nasabah/simpanan/pembayaran/pendidikan/${data.id_simpanan}`
                  )
                }
                className="w-full sm:w-auto rounded-xl bg-[#1a3c2e] px-5 py-2.5 sm:py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] hover:shadow-lg"
              >
                Bayar Setoran
              </button>

            </div>

        </div>

      </div>

    </div>
  );
}