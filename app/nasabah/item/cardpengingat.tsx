"use client";

import {
  Bell,
} from "lucide-react";

import { useRouter } from "next/navigation";

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

  if (!data) return null;

  const statusColor = {
    PENDING:
      "bg-emerald-50 text-emerald-700 border-emerald-100",

    MENUNGGU:
      "bg-yellow-50 text-yellow-700 border-yellow-100",

    TELAT:
      "bg-red-50 text-red-700 border-red-100",

    LUNAS:
      "bg-green-50 text-green-700 border-green-100",
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

      {/* glow */}
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-100 blur-3xl" />

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
          <Bell className="h-6 w-6 text-emerald-600" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Pengingat Angsuran
          </h3>

          <p className="text-sm text-gray-500">
            Cicilan ke-{data.cicilanKe} dari{" "}
            {data.totalCicilan}
          </p>
        </div>

      </div>

      {/* BODY */}
      <div>

        {/* JATUH TEMPO */}
        <p className="text-sm text-gray-500">
          Jatuh Tempo
        </p>

        <h3 className="mt-1 text-lg font-semibold text-gray-800">
          {new Date(
            data.jatuhTempo
          ).toLocaleDateString(
            "id-ID",
            {
              day: "numeric",
              month: "long",
              year: "numeric",
            }
          )}
        </h3>

        {/* NOMINAL (HERO) */}
        <p className="mt-6 text-sm text-gray-500">
          Nominal Angsuran
        </p>

        <h2 className="mt-1 text-3xl font-bold text-emerald-600">
          Rp{" "}
          {Number(
            data.nominal
          ).toLocaleString("id-ID")}
        </h2>

      </div>

      {/* STATUS */}
      <div className="mt-6">
        <span
          className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${
            statusColor[
              data.status as keyof typeof statusColor
            ]
          }`}
        >
          {data.status}
        </span>
      </div>

      {/* CTA */}
      <div className="mt-8">
        <button
          onClick={() =>
            router.push(
              `/nasabah/cicilan/${data.idPeminjaman}`
            )
          }
          className="w-full rounded-xl bg-[#1a3c2e] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] hover:shadow-lg"
        >
          Lihat Tagihan
        </button>
      </div>

    </div>
  );
}