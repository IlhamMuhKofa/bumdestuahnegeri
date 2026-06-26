"use client";

import { useRouter } from "next/navigation";

export default function CardNasabah({ item }: any) {
  const router = useRouter();

  const formatTanggal = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getInitial = (name: string) => {
    return name?.charAt(0)?.toUpperCase() || "?";
  };

  return (
    <div className="relative bg-white border rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">

      {/* 🔥 ACCENT TOP */}
      <div className="absolute top-0 left-0 w-full h-1 bg-blue-800" />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

        {/* 🔥 LEFT CONTENT */}
        <div className="flex items-center gap-4">

          {/* AVATAR */}
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
            {getInitial(item.nama)}
          </div>

          {/* TEXT */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {item.nama}
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Terakhir pengajuan:
            </p>
            <p className="text-sm text-gray-600">
              {formatTanggal(item.terakhir)}
            </p>
          </div>
        </div>

        {/* 🔥 RIGHT CONTENT */}
        <div className="flex items-center justify-between md:justify-end gap-6">

          {/* INFO BOX */}
          <div className="text-center">
            <p className="text-xs text-gray-400">
              Total Pengajuan
            </p>
            <p className="text-lg font-bold text-gray-800">
              {item.total_pengajuan}
            </p>
          </div>

          {/* BUTTON */}
          <button
            onClick={() =>
              router.push(`/admin/cicilan/konten/${item.id_anggota}`)
            }
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow-sm transition"
          >
            Detail →
          </button>

        </div>

      </div>
    </div>
  );
}