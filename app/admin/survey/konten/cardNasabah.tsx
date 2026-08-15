"use client";

import { useRouter } from "next/navigation";

export default function CardNasabah({ item }: any) {
  const router = useRouter();

  const formatTanggal = (
    date: string
  ) => {
    return new Date(
      date
    ).toLocaleDateString(
      "id-ID",
      {
        day: "numeric",
        month: "short",
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

  const isSudahSurvey =
    item.status_survey ===
    "SUDAH";

  return (
    <tr
      className="
        border-b
        border-gray-100
        last:border-0
        transition-colors
        hover:bg-blue-50/40
      "
    >

      {/* =====================================================
          NASABAH
      ===================================================== */}

      <td className="px-5 py-4">

        <div className="flex items-center gap-3">

          {/* AVATAR */}

          <div
            className={`
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              ${
                isSudahSurvey
                  ? "bg-blue-100 text-blue-700"
                  : "bg-orange-100 text-orange-700"
              }
            `}
          >

            <span className="text-xs font-bold">
              {getInitial(
                item.nama
              )}
            </span>

          </div>


          {/* NAMA */}

          <div className="min-w-0">

            <p className="truncate text-sm font-semibold text-gray-800">
              {item.nama}
            </p>

          </div>

        </div>

      </td>


      {/* =====================================================
          PENGAJUAN TERAKHIR
      ===================================================== */}

      <td className="whitespace-nowrap px-5 py-4">

        <p className="text-sm font-medium text-gray-700">
          {formatTanggal(
            item.terakhir
          )}
        </p>

        <p className="mt-0.5 text-xs text-gray-400">
          Pengajuan terakhir
        </p>

      </td>


      {/* =====================================================
          TOTAL PENGAJUAN
      ===================================================== */}

      <td className="px-5 py-4 text-center">

        <span
          className="
            inline-flex
            min-w-[36px]
            items-center
            justify-center
            rounded-full
            bg-gray-100
            px-3
            py-1
            text-xs
            font-semibold
            text-gray-700
          "
        >
          {item.total_pengajuan}
        </span>

      </td>


      {/* =====================================================
          STATUS SURVEY
      ===================================================== */}

      <td className="px-5 py-4">

        <span
          className={`
            inline-flex
            items-center
            rounded-full
            border
            px-2.5
            py-1
            text-xs
            font-semibold
            ${
              isSudahSurvey
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : "border-orange-200 bg-orange-50 text-orange-700"
            }
          `}
        >
          {isSudahSurvey
            ? "Sudah Survey"
            : "Belum Survey"}
        </span>

      </td>


      {/* =====================================================
          AKSI
      ===================================================== */}

      <td className="px-5 py-4 text-center">

        <button
          type="button"
          onClick={() =>
            router.push(
              `/admin/survey/konten/${item.id_peminjaman}`
            )
          }
          className={`
            inline-flex
            h-9
            items-center
            justify-center
            rounded-lg
            border
            px-3
            text-xs
            font-semibold
            transition-all
            ${
              isSudahSurvey
                ? `
                  border-blue-200
                  bg-white
                  text-blue-700
                  hover:border-blue-700
                  hover:bg-blue-700
                  hover:text-white
                `
                : `
                  border-blue-200
                  bg-white
                  text-blue-700
                  hover:border-blue-700
                  hover:bg-blue-700
                  hover:text-white
                `
            }
          `}
        >
          {isSudahSurvey
            ? "Lihat Survey"
            : "Buat Jadwal"}
        </button>

      </td>

    </tr>
  );
}