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
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* HEADER */}
      <div className="flex w-full items-center justify-between bg-white p-6">

        <div className="flex flex-1 items-start gap-4">

          {/* ICON */}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">

            <GraduationCap className="h-7 w-7 text-green-700" />

          </div>

          {/* CONTENT */}
          <div className="flex-1">

            {/* TITLE */}
            <div className="mb-3 flex flex-wrap items-center gap-3">

              <h3 className="text-xl font-bold text-gray-800">
                {data.tujuan}
              </h3>

              <span className="rounded-full bg-[#1a3c2e] px-3 py-1 text-xs font-semibold text-white">

                {data.jangka_waktu} Bulan

              </span>

            </div>

            {/* STATS */}
            <div className="grid gap-3 sm:grid-cols-3">

              {/* TARGET */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">

                <div className="mb-2 flex items-center gap-2 text-gray-500">

                  <Target className="h-4 w-4" />

                  <span className="text-xs font-medium uppercase tracking-wide">
                    Target Dana
                  </span>

                </div>

                <p className="text-lg font-bold text-gray-800">

                  Rp{" "}
                  {Number(
                    data.target_dana
                  ).toLocaleString(
                    "id-ID"
                  )}

                </p>

              </div>

              {/* TERKUMPUL */}
              <div className="rounded-2xl border border-green-100 bg-green-50 p-4">

                <div className="mb-2 flex items-center gap-2 text-green-700">

                  <Wallet className="h-4 w-4" />

                  <span className="text-xs font-medium uppercase tracking-wide">
                    Terkumpul
                  </span>

                </div>

                <p className="text-lg font-bold text-green-700">

                  Rp{" "}
                  {Number(
                    data.total_terkumpul
                  ).toLocaleString(
                    "id-ID"
                  )}

                </p>

              </div>

              {/* SARAN */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">

                <div className="mb-2 flex items-center gap-2 text-gray-500">

                  <Wallet className="h-4 w-4" />

                  <span className="text-xs font-medium uppercase tracking-wide">
                    Saran / Bulan
                  </span>

                </div>

                <p className="text-lg font-bold text-gray-800">

                  Rp{" "}
                  {saranSetoran.toLocaleString(
                    "id-ID"
                  )}

                </p>

              </div>

            </div>

            {/* PROGRESS BAR */}
            <div className="mt-5">

              <div className="mb-2 flex items-center justify-between text-xs text-gray-500">

                <span>

                  Rp{" "}
                  {data.total_terkumpul.toLocaleString(
                    "id-ID"
                  )}{" "}
                  terkumpul dari target

                </span>

                <span>
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
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">

              <div className="text-sm text-gray-500">

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
                className="w-full rounded-xl bg-[#1a3c2e] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] hover:shadow-lg"
              >
                Bayar Setoran
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}