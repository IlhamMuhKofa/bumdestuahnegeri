"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Loader2 } from "lucide-react";

type Props = {
  item: any;
};

export default function CardNasabah({
  item,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const formatTanggal = (
    date: string
  ) => {
    return new Date(
      date
    ).toLocaleDateString(
      "id-ID",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  const getInitial = (
    name: string
  ) => {
    return (
      name
        ?.charAt(0)
        ?.toUpperCase() || "?"
    );
  };

  const handleDetail = () => {
    // Cegah klik berkali-kali
    if (loading) return;

    setLoading(true);

    router.push(
      `/admin/cicilan/konten/${item.id_anggota}`
    );
  };

  return (
    <tr className="border-b border-gray-50 transition-colors hover:bg-blue-50/40">

      {/* =====================================================
          NASABAH
      ===================================================== */}

      <td className="px-5 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">

            <span className="text-xs font-bold text-blue-700">
              {getInitial(item.nama)}
            </span>

          </div>

          <div>

            <p className="text-sm font-medium text-gray-800">
              {item.nama}
            </p>

          </div>

        </div>

      </td>


      {/* =====================================================
          TERAKHIR PENGAJUAN
      ===================================================== */}

      <td className="px-4 py-4">

        <p className="text-sm font-medium text-gray-700">
          {formatTanggal(
            item.terakhir
          )}
        </p>

        <p className="mt-0.5 text-xs text-gray-400">
          Terakhir pengajuan
        </p>

      </td>


      {/* =====================================================
          TOTAL PENGAJUAN
      ===================================================== */}

      <td className="px-4 py-4 text-center">

        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
          {item.total_pengajuan}
        </span>

      </td>


      {/* =====================================================
          AKSI
      ===================================================== */}

      <td className="px-5 py-4 text-center">

        <button
          type="button"
          onClick={handleDetail}
          disabled={loading}
          className="
            inline-flex
            h-8
            min-w-[72px]
            items-center
            justify-center
            gap-1.5
            rounded-lg
            border
            border-blue-200
            px-3
            py-1.5
            text-xs
            font-semibold
            text-blue-700
            transition-all
            hover:border-blue-700
            hover:bg-blue-700
            hover:text-white
            disabled:cursor-not-allowed
            disabled:border-blue-200
            disabled:bg-blue-50
            disabled:text-blue-600
          "
        >

          {loading ? (
            <>
              <Loader2
                className="h-3.5 w-3.5 animate-spin"
              />

              Memuat...
            </>
          ) : (
            <>
              Detail
            </>
          )}

        </button>

      </td>

    </tr>
  );
}