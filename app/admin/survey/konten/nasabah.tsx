"use client";

import CardNasabah from "../konten/cardNasabah";

export default function Nasabah({ data }: any) {
  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-medium text-gray-500">
          Tidak ada pengajuan pending
        </p>

        <p className="mt-1 text-xs text-gray-400">
          Data pengajuan pending akan tampil di sini.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-sm
      "
    >
      {/* =====================================================
          RESPONSIVE TABLE
      ===================================================== */}

      <div className="overflow-x-auto">

        <table
          className="
            w-full
            min-w-[900px]
            text-left
          "
        >

          {/* =================================================
              HEADER TABLE
          ================================================= */}

          <thead>

            <tr className="bg-blue-800">

              <th
                className="
                  px-5
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                "
              >
                NASABAH
              </th>

              <th
                className="
                  px-5
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                "
              >
                PENGAJUAN TERAKHIR
              </th>

              <th
                className="
                  px-5
                  py-3.5
                  text-center
                  text-sm
                  font-semibold
                  text-white
                "
              >
                TOTAL PENGAJUAN
              </th>

              <th
                className="
                  px-5
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                "
              >
                STATUS
              </th>

              <th
                className="
                  px-5
                  py-3.5
                  text-center
                  text-sm
                  font-semibold
                  text-white
                "
              >
                AKSI
              </th>

            </tr>

          </thead>


          {/* =================================================
              BODY
          ================================================= */}

          <tbody>

            {data.map(
              (item: any) => (
                <CardNasabah
                  key={
                    item.id_anggota
                  }
                  item={item}
                />
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}