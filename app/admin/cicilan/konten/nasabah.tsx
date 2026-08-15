"use client";

import CardNasabah from "../konten/cardNasabah";

export default function Nasabah({ data }: any) {

  // =====================================================
  // EMPTY STATE
  // =====================================================
  if (!data || data.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
            <span className="text-2xl">
              👥
            </span>
          </div>

          <h3 className="text-sm font-semibold text-gray-700">
            Belum ada data nasabah
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            Data nasabah dengan pengajuan yang sesuai akan muncul di sini
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

      {/* =====================================================
          TABLE WRAPPER
      ====================================================== */}
      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          {/* =================================================
              TABLE HEADER
          ================================================== */}
          <thead>

            <tr className="bg-blue-800">

              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white">
                Nasabah
              </th>

              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white">
                Terakhir Pengajuan
              </th>

              <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-white">
                Total Pengajuan
              </th>

              <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-white">
                Aksi
              </th>

            </tr>

          </thead>


          {/* =================================================
              TABLE BODY
          ================================================== */}
          <tbody>

            {data.map((item: any) => (
              <CardNasabah
                key={item.id_anggota}
                item={item}
              />
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}