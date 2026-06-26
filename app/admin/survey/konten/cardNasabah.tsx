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

  const isSudahSurvey =
    item.status_survey ===
    "SUDAH";

  return (
    <div
      className="
        relative
        bg-white
        border
        rounded-3xl
        p-6
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1
        transition-all
        duration-300
        overflow-hidden
      "
    >

      {/* ACCENT */}
      <div
        className={`
          absolute
          top-0
          left-0
          w-full
          h-1
          ${
            isSudahSurvey
              ? "bg-gradient-to-r from-blue-500 to-cyan-400"
              : "bg-gradient-to-r from-orange-500 to-yellow-400"
          }
        `}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        {/* LEFT */}
        <div className="flex items-start gap-4">

          {/* AVATAR */}
          <div
            className={`
              w-14
              h-14
              rounded-2xl
              flex
              items-center
              justify-center
              font-bold
              text-lg
              shadow-sm
              ${
                isSudahSurvey
                  ? "bg-blue-100 text-blue-700"
                  : "bg-orange-100 text-orange-700"
              }
            `}
          >
            {getInitial(
              item.nama
            )}
          </div>

          {/* TEXT */}
          <div>

            {/* NAME */}
            <div className="flex flex-wrap items-center gap-2">

              <h2 className="text-xl font-bold text-gray-800">
                {item.nama}
              </h2>

              {/* STATUS */}
              <span
                className={`
                  text-xs
                  px-3
                  py-1
                  rounded-full
                  font-medium
                  ${
                    isSudahSurvey
                      ? "bg-blue-100 text-blue-700"
                      : "bg-orange-100 text-orange-700"
                  }
                `}
              >
                {isSudahSurvey
                  ? "Sudah Survey"
                  : "Belum Survey"}
              </span>

            </div>

            {/* DATE */}
            <div className="mt-3">

              <p className="text-xs text-gray-400">
                Pengajuan terakhir
              </p>

              <p className="text-sm text-gray-700 font-medium">
                {formatTanggal(
                  item.terakhir
                )}
              </p>

            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-between lg:justify-end gap-6">

          {/* TOTAL */}
          <div className="text-center">

            <p className="text-xs text-gray-400">
              Total Pengajuan
            </p>

            <p className="text-2xl font-bold text-gray-800">
              {item.total_pengajuan}
            </p>

          </div>

          {/* ACTION */}
          <button
            onClick={() =>
              router.push(
                `/admin/survey/konten/${item.id_anggota}`
              )
            }
            className={`
              px-5
              py-3
              rounded-xl
              text-sm
              font-medium
              text-white
              shadow-sm
              transition
              ${
                isSudahSurvey
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-orange-500 hover:bg-orange-600"
              }
            `}
          >
            {isSudahSurvey
              ? "Lihat Survey"
              : "Buat Jadwal"}
          </button>

        </div>

      </div>

    </div>
  );
}