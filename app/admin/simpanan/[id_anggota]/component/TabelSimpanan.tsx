"use client";

import {
  BadgeCheck,
  Clock3,
  Eye,
  XCircle,
} from "lucide-react";

import { useEffect, useState } from "react";


type Pembayaran = {
  id: number;
  bulan_ke?: number | null;
  tanggal: Date | string;
  nominal: number;
  status: string;
  metode: string;
  bukti_bayar: string | null;
  catatan?: string | null;
};

type Simpanan = {
  id_simpanan: number;

  pembayaran: Pembayaran[];
};

type Props = {
  title: string;

  data: Simpanan[];

  onApprove?: (
    id: number
  ) => void;

  onReject?: (
    id: number
  ) => void;

  onDetail: (
    pembayaran: any
  ) => void;

  onBayarCash?: (
    tagihan: any
  ) => void;
};

export default function TabelSimpanan({
  title,
  data,
  onApprove,
  onReject,
  onBayarCash,
  onDetail,
}: Props) {
  const semuaPembayaran =
    data.flatMap(
      (simpanan) =>
        simpanan.pembayaran
    );

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 6;
  const totalData =
    semuaPembayaran.length;

  const totalPages =
    Math.ceil(
      totalData / itemsPerPage
    );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const paginatedPembayaran =
    semuaPembayaran.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);


  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

      {/* HEADER */}
      <div className="border-b border-gray-100 px-6 py-5">

        <h2 className="text-lg font-bold text-gray-800">
          {title}
        </h2>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead>

            <tr className="bg-gray-50">

              <th className="px-6 py-4 text-left">
                Tanggal
              </th>

              <th className="px-6 py-4 text-left">
                Nominal
              </th>

              <th className="px-6 py-4 text-left">
                Metode
              </th>

              <th className="px-6 py-4 text-center">
                Status
              </th>

              <th className="px-6 py-4 text-center">
                Bukti
              </th>

              <th className="px-6 py-4 text-center">
                Aksi
              </th>

            </tr>

          </thead>

          <tbody>

            {paginatedPembayaran.length > 0 ? (

              paginatedPembayaran.map(
                (bayar) => (
                  <tr
                    key={bayar.id}
                    className="border-t hover:bg-gray-50"
                  >

                    {/* TANGGAL */}
                    <td className="px-6 py-5">
                      {new Date(
                        bayar.tanggal
                      ).toLocaleDateString(
                        "id-ID"
                      )}
                    </td>

                    {/* NOMINAL */}
                    <td className="px-6 py-5 font-semibold">

                      Rp{" "}
                      {(
                        bayar.nominal ?? 0
                      ).toLocaleString(
                        "id-ID"
                      )}

                    </td>

                    {/* METODE */}
                    <td className="px-6 py-5">

                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">

                        {bayar.metode}

                      </span>

                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-5 text-center">

                      {bayar.status === "BERHASIL" ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          <BadgeCheck className="h-3.5 w-3.5" />
                          Berhasil
                        </span>

                      ) : bayar.status === "MENUNGGU" ? (

                        <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                          <Clock3 className="h-3.5 w-3.5" />
                          Menunggu Verifikasi
                        </span>

                      ) : bayar.status === "BELUM_BAYAR" ? (

                        <span className="inline-flex items-center gap-2 rounded-full bg-red-300 px-3 py-1 text-xs font-semibold text-gray-700">
                          <Clock3 className="h-3.5 w-3.5" />
                          Belum Bayar
                        </span>

                      ) : (

                        <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                          <XCircle className="h-3.5 w-3.5" />
                          Ditolak
                        </span>

                      )}

                    </td>

                    {/* BUKTI */}
                    <td className="px-6 py-5 text-center">

                      {bayar.bukti_bayar ? (
                        <a
                          href={
                            bayar.bukti_bayar
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                        >

                          <Eye className="h-4 w-4" />

                          Lihat

                        </a>
                      ) : (
                        "-"
                      )}

                    </td>

                    {/* AKSI */}
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center">

                        {bayar.metode === "TRANSFER" &&
                          bayar.status === "MENUNGGU" ? (

                          <div className="flex items-center justify-center gap-2">

                            <button
                              onClick={() =>
                                onApprove?.(bayar.id)
                              }
                              className="rounded-xl bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() =>
                                onReject?.(bayar.id)
                              }
                              className="rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                            >
                              Tolak
                            </button>

                          </div>

                        ) : bayar.status === "BERHASIL" ? (

                          <button
                            onClick={() =>
                              onDetail?.(bayar)
                            }
                            className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                          >
                            Detail
                          </button>

                        ) : (

                          <span className="text-gray-400">
                            -
                          </span>

                        )}

                      </div>
                    </td>

                  </tr>
                )
              )

            ) : (

              <tr>

                <td
                  colSpan={6}
                  className="py-16 text-center text-gray-400"
                >
                  Belum ada data pembayaran
                </td>

              </tr>

            )}

          </tbody>

        </table>

        {/* PAGINATION */}
        <div className="flex items-center justify-between border-t px-6 py-4 text-sm text-gray-500">

          <span>
            Menampilkan{" "}
            {totalData === 0
              ? 0
              : startIndex + 1}
            {" - "}
            {Math.min(
              startIndex + itemsPerPage,
              totalData
            )}
            {" dari "}
            {totalData} pembayaran
          </span>

          <div className="flex items-center gap-2">

            <button
              onClick={() =>
                setCurrentPage((prev) => prev - 1)
              }
              disabled={currentPage === 1}
              className={`rounded-lg border px-3 py-1.5 text-xs ${currentPage === 1
                ? "cursor-not-allowed border-gray-200 text-gray-300"
                : "border-gray-300 hover:bg-gray-100"
                }`}
            >
              ‹ Sebelumnya
            </button>

            <span className="px-2 text-xs font-medium">
              Halaman {currentPage} / {totalPages || 1}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => prev + 1)
              }
              disabled={
                currentPage === totalPages ||
                totalPages === 0
              }
              className={`rounded-lg border px-3 py-1.5 text-xs ${currentPage === totalPages ||
                totalPages === 0
                ? "cursor-not-allowed border-gray-200 text-gray-300"
                : "border-gray-300 hover:bg-gray-100"
                }`}
            >
              Berikutnya ›
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}