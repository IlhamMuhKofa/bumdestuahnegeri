"use client";

import Link from "next/link";

type Props = {
  data: any[];
};

export default function Cicilan({
  data,
}: Props) {
  const formatRupiah = (
    value: number
  ) =>
    "Rp " +
    value.toLocaleString(
      "id-ID"
    );

  const getProgress = (
    item: any
  ) => {
    const total =
      item.jadwal?.length || 0;

    const lunas =
      item.jadwal?.filter(
        (j: any) =>
          j.status ===
          "LUNAS"
      ).length || 0;

    const percent =
      total === 0
        ? 0
        : (
          (lunas /
            total) *
          100
        );

    return {
      total,
      lunas,
      percent,
    };
  };

  return (
    <div className="p-5 md:p-10">

      <div className="grid md:grid-cols-2 gap-5">

        {data.map(
          (
            item,
            index
          ) => {

            const progress =
              getProgress(
                item
              );

            return (
              <div
                key={
                  item.id_peminjaman
                }
                className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-lg transition"
              >

                {/* TOP */}
                <div className="flex justify-between">

                  <div>

                    <p className="text-lg font-bold text-gray-800">
                      Pinjaman ke-
                      {
                        index + 1
                      }
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(
                        item.tanggal_pengajuan
                      ).toLocaleDateString(
                        "id-ID",
                        {
                          day:
                            "numeric",
                          month:
                            "long",
                          year:
                            "numeric",
                        }
                      )}
                    </p>

                  </div>

                  <span
                    className={`inline-flex items-center text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap
    ${item.status === "LUNAS"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                      }`}
                  >
                    {item.status}
                  </span>

                </div>

                {/* NOMINAL */}
                <div className="mt-5">

                  <p className="text-xs text-gray-400">
                    Total Pinjaman
                  </p>

                  <p className="text-xl font-bold text-gray-800 mt-1">
                    {formatRupiah(
                      item.total_pinjaman
                    )}
                  </p>

                </div>

                {/* PROGRESS */}
                <div className="mt-5">

                  <div className="flex justify-between text-sm mb-2">

                    <span>
                      Progress
                    </span>

                    <span>
                      {
                        progress.lunas
                      }
                      /
                      {
                        progress.total
                      }
                    </span>

                  </div>

                  <div className="w-full h-2 bg-gray-100 rounded-full">

                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${progress.percent}%`,
                      }}
                    />

                  </div>

                </div>

                {/* ACTION */}
                <Link
                  href={`/nasabah/cicilan/${item.id_peminjaman}`}
                  className="mt-5 w-full bg-[#245240] hover:bg-[#1a3c2e] text-white text-sm rounded-xl py-3 flex justify-center"
                >
                  Lihat Cicilan
                </Link>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}