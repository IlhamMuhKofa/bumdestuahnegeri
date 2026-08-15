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
    value.toLocaleString("id-ID");

  const getProgress = (
    item: any
  ) => {
    const total =
      item.jadwal?.length || 0;

    const lunas =
      item.jadwal?.filter(
        (j: any) =>
          j.status === "LUNAS"
      ).length || 0;

    const percent =
      total === 0
        ? 0
        : (lunas / total) * 100;

    return {
      total,
      lunas,
      percent,
    };
  };

  return (
    <div className="bg-gray-50 px-4 py-5 sm:p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-800 sm:text-[30px]">
          Pinjaman Saya
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          Pantau status dan perkembangan pembayaran pinjaman Anda.
        </p>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* RESPONSIVE SCROLL */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[800px] text-sm">

            {/* HEADER TABLE */}
            <thead>
              <tr className="border-b border-gray-100 bg-[#1a3c2e] text-left">

                <th className="px-5 py-3.5 text-sm font-semibold text-white/90">
                  Pinjaman
                </th>

                <th className="px-5 py-3.5 text-sm font-semibold text-white/90">
                  Tanggal Pengajuan
                </th>

                <th className="px-5 py-3.5 text-sm font-semibold text-white/90">
                  Total Pinjaman
                </th>

                <th className="px-5 py-3.5 text-sm font-semibold text-white/90">
                  Progress
                </th>

                <th className="px-5 py-3.5 text-sm font-semibold text-white/90">
                  Status
                </th>

                <th className="px-5 py-3.5 text-right text-sm font-semibold text-white/90">
                  Aksi
                </th>

              </tr>
            </thead>

            {/* BODY */}
            <tbody>

              {data.length > 0 ? (
                data.map(
                  (
                    item,
                    index
                  ) => {

                    const progress =
                      getProgress(
                        item
                      );

                    return (
                      <tr
                        key={
                          item.id_peminjaman
                        }
                        className="border-b border-gray-100 last:border-0 transition-colors hover:bg-gray-50/70"
                      >

                        {/* PINJAMAN */}
                        <td className="px-5 py-4">

                          <p className="text-sm font-semibold text-gray-800">
                            Pinjaman ke-
                            {index + 1}
                          </p>

                        </td>

                        {/* TANGGAL */}
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">

                          {new Date(
                            item.tanggal_pengajuan
                          ).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}

                        </td>

                        {/* TOTAL */}
                        <td className="whitespace-nowrap px-5 py-4">

                          <p className="text-sm font-semibold text-gray-800">
                            {formatRupiah(
                              item.total_pinjaman
                            )}
                          </p>

                        </td>

                        {/* PROGRESS */}
                        <td className="px-5 py-4">

                          <div className="w-36">

                            <div className="mb-2 flex items-center justify-between text-xs">

                              <span className="text-gray-500">
                                Pembayaran
                              </span>

                              <span className="font-medium text-gray-700">
                                {
                                  progress.lunas
                                }
                                /
                                {
                                  progress.total
                                }
                              </span>

                            </div>

                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">

                              <div
                                className="h-full rounded-full bg-[#1a3c2e] transition-all duration-300"
                                style={{
                                  width: `${progress.percent}%`,
                                }}
                              />

                            </div>

                          </div>

                        </td>

{/* STATUS */}
<td className="px-5 py-4">

  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
      item.status === "LUNAS"
        ? "bg-green-100 text-green-700 border-green-200"
        : "bg-yellow-100 text-yellow-700 border-yellow-200"
    }`}
  >
    {item.status === "ACTIVE"
      ? "Sedang Berjalan"
      : item.status === "LUNAS"
      ? "Lunas"
      : item.status}
  </span>

</td>

                        {/* ACTION */}
                        <td className="px-5 py-4 text-right">

                          <Link
                            href={`/nasabah/cicilan/${item.id_peminjaman}`}
                            className="h-10 inline-flex items-center justify-center rounded-lg bg-[#1a3c2e] px-4 text-sm font-medium text-white transition-all hover:bg-[#245240] hover:shadow-sm"
                          >
                            Lihat Cicilan
                          </Link>

                        </td>

                      </tr>
                    );
                  }
                )
              ) : (
                /* EMPTY */
                <tr>

                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center"
                  >
                    <p className="text-sm font-medium text-gray-500">
                      Belum ada data pinjaman.
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Data pinjaman Anda akan tampil di sini.
                    </p>
                  </td>

                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}