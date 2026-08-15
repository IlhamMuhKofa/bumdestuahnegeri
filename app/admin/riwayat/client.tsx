"use client";

import { useMemo, useState } from "react";
import {
  Download,
  Eye,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Loader2,
} from "lucide-react";

type Props = {
  data?: any[];
  allData?: any[];
  search?: string;
};

type Filter =
  | "SEMUA"
  | "PINJAMAN"
  | "SIMPANAN";

export default function ClientPage({
  data = [],
  allData = [],
  search = "",
}: Props) {
  const [filter, setFilter] =
    useState<Filter>("SEMUA");

  const [preview, setPreview] =
    useState<string | null>(null);

  // =====================================================
  // DATA TABEL
  // =====================================================

  const filteredData = useMemo(() => {
    if (filter === "SEMUA") {
      return data;
    }

    return data.filter((item) => {
      const kategori =
        item.kategori || "";

      const jenis =
        item.jenis_transaksi || "";

      return (
        kategori === filter ||
        jenis.includes(filter)
      );
    });
  }, [data, filter]);

  // =====================================================
  // DATA SELURUH TRANSAKSI
  // =====================================================

  const filteredAllData = useMemo(() => {
    if (filter === "SEMUA") {
      return allData;
    }

    return allData.filter((item) => {
      const kategori =
        item.kategori || "";

      const jenis =
        item.jenis_transaksi || "";

      return (
        kategori === filter ||
        jenis.includes(filter)
      );
    });
  }, [allData, filter]);

  // =====================================================
  // SUMMARY
  // =====================================================

  const summary = useMemo(() => {
    return {
      total:
        filteredAllData.length,

      pinjaman:
        filteredAllData
          .filter((item) =>
            (
              item.kategori ||
              item.jenis_transaksi ||
              ""
            ).includes("PINJAMAN")
          )
          .reduce(
            (sum, item) =>
              sum +
              (item.nominal || 0),
            0
          ),

      simpanan:
        filteredAllData
          .filter((item) =>
            (
              item.kategori ||
              item.jenis_transaksi ||
              ""
            ).includes("SIMPANAN")
          )
          .reduce(
            (sum, item) =>
              sum +
              (item.nominal || 0),
            0
          ),
    };
  }, [filteredAllData]);

  // =====================================================
  // FORMAT RUPIAH
  // =====================================================

  const formatRupiah = (
    value?: number
  ) =>
    "Rp " +
    (value || 0).toLocaleString(
      "id-ID"
    );

  // =====================================================
  // CETAK / PDF
  // =====================================================

  const printPdf = (
    rows: any[],
    title: string
  ) => {
    const totalPinjaman =
      rows
        .filter((item) =>
          (
            item.kategori ||
            item.jenis_transaksi ||
            ""
          ).includes("PINJAMAN")
        )
        .reduce(
          (sum, item) =>
            sum +
            (item.nominal || 0),
          0
        );

    const totalSimpanan =
      rows
        .filter((item) =>
          (
            item.kategori ||
            item.jenis_transaksi ||
            ""
          ).includes("SIMPANAN")
        )
        .reduce(
          (sum, item) =>
            sum +
            (item.nominal || 0),
          0
        );

    const tanggalCetak =
      new Date().toLocaleDateString(
        "id-ID",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      );

    const html = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>

        <style>
          * {
            box-sizing: border-box;
          }

          @page {
            size: A4;
            margin: 16mm 14mm 16mm 14mm;
          }

          body {
            margin: 0;
            padding: 20px;
            font-family: Arial, Helvetica, sans-serif;
            color: #1f2937;
            background: white;
            font-size: 11px;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 14px;
            border-bottom: 3px solid #1d4ed8;
            margin-bottom: 18px;
          }

          .brand {
            font-size: 21px;
            font-weight: 800;
            color: #111827;
            margin-bottom: 4px;
          }

          .report-title {
            font-size: 14px;
            font-weight: 700;
            color: #1d4ed8;
          }

          .report-info {
            text-align: right;
            color: #6b7280;
            font-size: 10px;
            line-height: 1.6;
          }

          .summary {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-bottom: 20px;
          }

          .summary-card {
            border: 1px solid #dbe2ea;
            border-radius: 10px;
            padding: 12px 14px;
            background: #f8fafc;
          }

          .summary-label {
            font-size: 10px;
            color: #64748b;
            font-weight: 600;
            margin-bottom: 5px;
          }

          .summary-value {
            font-size: 15px;
            font-weight: 800;
            color: #111827;
          }

          .section-title {
            font-size: 12px;
            font-weight: 700;
            margin-bottom: 8px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
          }

          thead {
            display: table-header-group;
          }

          tr {
            page-break-inside: avoid;
          }

          th {
            background: #1d4ed8;
            color: white;
            font-size: 10px;
            font-weight: 700;
            padding: 8px 7px;
            text-align: left;
            border: 1px solid #1d4ed8;
          }

          td {
            padding: 7px;
            font-size: 9.5px;
            border: 1px solid #dbe2ea;
            vertical-align: top;
            word-wrap: break-word;
          }

          tbody tr:nth-child(even) {
            background: #f8fafc;
          }

          .nominal {
            font-weight: 700;
            white-space: nowrap;
          }

          .footer {
            margin-top: 18px;
            padding-top: 10px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            font-size: 9px;
            color: #6b7280;
          }

          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }

            .no-print {
              display: none !important;
            }
          }
        </style>
      </head>

      <body>

        <div class="header">
          <div>
            <div class="brand">
              BUMDes Tuah Negri
            </div>

            <div class="report-title">
              ${title}
            </div>
          </div>

          <div class="report-info">
            <div>Tanggal Cetak</div>

            <strong>
              ${tanggalCetak}
            </strong>

            <div>
              Total ${rows.length} transaksi
            </div>
          </div>
        </div>

        <div class="summary">

          <div class="summary-card">
            <div class="summary-label">
              TOTAL TRANSAKSI
            </div>

            <div class="summary-value">
              ${rows.length}
            </div>
          </div>

          <div class="summary-card">
            <div class="summary-label">
              TOTAL PINJAMAN
            </div>

            <div class="summary-value">
              ${formatRupiah(
                totalPinjaman
              )}
            </div>
          </div>

          <div class="summary-card">
            <div class="summary-label">
              TOTAL SIMPANAN
            </div>

            <div class="summary-value">
              ${formatRupiah(
                totalSimpanan
              )}
            </div>
          </div>

        </div>

        <div class="section-title">
          Rincian Transaksi
        </div>

        <table>

          <thead>
            <tr>
              <th style="width: 16%">Nama</th>
              <th style="width: 11%">Tanggal</th>
              <th style="width: 17%">Jenis</th>
              <th style="width: 13%">Nominal</th>
              <th style="width: 11%">Metode</th>
              <th style="width: 32%">Keterangan</th>
            </tr>
          </thead>

          <tbody>

            ${
              rows.length > 0
                ? rows
                    .map(
                      (item) => `
                        <tr>

                          <td>
                            ${
                              item.anggota?.nama ||
                              "-"
                            }
                          </td>

                          <td>
                            ${new Date(
                              item.tanggal
                            ).toLocaleDateString(
                              "id-ID"
                            )}
                          </td>

                          <td>
                            ${
                              item.jenis_transaksi ||
                              "-"
                            }
                          </td>

                          <td class="nominal">
                            ${formatRupiah(
                              item.nominal
                            )}
                          </td>

                          <td>
                            ${
                              item.metode_bayar ||
                              "-"
                            }
                          </td>

                          <td>
                            ${
                              item.keterangan ||
                              "-"
                            }
                          </td>

                        </tr>
                      `
                    )
                    .join("")
                : `
                  <tr>
                    <td
                      colspan="6"
                      style="
                        text-align:center;
                        padding:20px;
                      "
                    >
                      Tidak ada transaksi.
                    </td>
                  </tr>
                `
            }

          </tbody>

        </table>

        <div class="footer">
          <span>
            BUMDes Tuah Negri
          </span>

          <span>
            Laporan Transaksi
          </span>
        </div>

        <script>
          window.onload = function () {
            window.print();
          };
        </script>

      </body>
      </html>
    `;

    const printWindow =
      window.open(
        "",
        "_blank"
      );

    if (!printWindow) {
      return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-2">
      <div className="max-w-7xl mx-auto space-y-7">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Laporan Transaksi
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Data seluruh transaksi pembayaran nasabah
            </p>
          </div>

          {/* DOWNLOAD */}
          <button
            onClick={() =>
              printPdf(
                filteredAllData,
                filter === "SEMUA"
                  ? "Laporan Semua Transaksi"
                  : `Laporan Transaksi ${filter}`
              )
            }
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-xl
              bg-blue-700
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition-all
              hover:bg-blue-800
              hover:shadow-md
            "
          >
            <Download className="h-4 w-4" />

            Download Laporan
          </button>

        </div>


        {/* =====================================================
            SUMMARY / SCORECARD
        ===================================================== */}

        <div className="grid gap-4 md:grid-cols-3">

          <Summary
            label="Total Transaksi"
            value={`${summary.total}`}
          />

          <Summary
            label="Total Pinjaman"
            value={formatRupiah(
              summary.pinjaman
            )}
          />

          <Summary
            label="Total Simpanan"
            value={formatRupiah(
              summary.simpanan
            )}
          />

        </div>


        {/* =====================================================
            TABLE CARD
        ===================================================== */}

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          {/* SEARCH + FILTER */}
          <div className="border-b border-gray-100 p-4">

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

              {/* SEARCH */}
              <div className="relative w-full lg:max-w-full">

                <Search
                  className="
                    absolute
                    left-3
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  defaultValue={search}
                  placeholder="Cari transaksi..."
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    py-2
                    pl-9
                    pr-4
                    text-sm
                    outline-none
                    transition-all
                    placeholder:text-gray-400
                    focus:border-blue-400
                    focus:bg-white
                    focus:ring-2
                    focus:ring-blue-500/20
                  "
                />

              </div>


              {/* FILTER */}
              <div className="relative">

                <SlidersHorizontal
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <select
                  value={filter}
                  onChange={(e) =>
                    setFilter(
                      e.target.value as Filter
                    )
                  }
                  className="
                    appearance-none
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    py-2
                    pl-9
                    pr-9
                    text-sm
                    text-gray-600
                    outline-none
                    transition-all
                    focus:border-blue-400
                    focus:bg-white
                    focus:ring-2
                    focus:ring-blue-500/20
                  "
                >
                  <option value="SEMUA">
                    Semua Transaksi
                  </option>

                  <option value="PINJAMAN">
                    Pinjaman
                  </option>

                  <option value="SIMPANAN">
                    Simpanan
                  </option>
                </select>

                <ArrowUpDown
                  className="
                    pointer-events-none
                    absolute
                    right-2.5
                    top-1/2
                    h-3.5
                    w-3.5
                    -translate-y-1/2
                    text-gray-400
                  "
                />

              </div>

            </div>

          </div>


          {/* TABLE */}
          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px] text-sm">

              <thead>

                <tr className="bg-blue-800">

                  {[
                    "Nama",
                    "Tanggal",
                    "Jenis Transaksi",
                    "Jumlah",
                    "Metode",
                    "Keterangan",
                    "Detail",
                  ].map((col) => (

                    <th
                      key={col}
                      className="
                        px-5
                        py-3.5
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-white
                      "
                    >
                      {col}
                    </th>

                  ))}

                </tr>

              </thead>

              <tbody>

                {filteredData.length === 0 ? (

                  <tr>

                    <td
                      colSpan={7}
                      className="px-5 py-16 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                          <Eye className="h-6 w-6 text-gray-400" />
                        </div>

                        <p className="text-sm font-semibold text-gray-600">
                          Belum ada riwayat transaksi
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Data transaksi akan muncul di sini
                        </p>

                      </div>

                    </td>

                  </tr>

                ) : (

                  filteredData.map(
                    (item) => (

                      <tr
                        key={
                          item.id_riwayat
                        }
                        className="
                          border-t
                          border-gray-100
                          transition-colors
                          hover:bg-blue-50/40
                        "
                      >

                        {/* NAMA */}
                        <td className="px-5 py-4">

                          <p className="text-sm font-semibold text-gray-800">
                            {
                              item
                                .anggota
                                ?.nama ||
                              "-"
                            }
                          </p>

                        </td>


                        {/* TANGGAL */}
                        <td className="px-5 py-4">

                          <p className="text-sm font-medium text-gray-700">
                            {new Date(
                              item.tanggal
                            ).toLocaleDateString(
                              "id-ID"
                            )}
                          </p>

                        </td>


                        {/* JENIS */}
                        <td className="px-5 py-4">

                          <span className="
                            inline-flex
                            rounded-full
                            bg-blue-50
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            text-blue-700
                          ">
                            {
                              item.jenis_transaksi ||
                              "-"
                            }
                          </span>

                        </td>


                        {/* NOMINAL */}
                        <td className="px-5 py-4">

                          <p className="text-sm font-bold text-gray-800">
                            {formatRupiah(
                              item.nominal
                            )}
                          </p>

                        </td>


                        {/* METODE */}
                        <td className="px-5 py-4">

                          <span className="
                            text-sm
                            text-gray-600
                          ">
                            {
                              item.metode_bayar ||
                              "-"
                            }
                          </span>

                        </td>


                        {/* KETERANGAN */}
                        <td className="px-5 py-4">

                          <p className="
                            max-w-xs
                            truncate
                            text-sm
                            text-gray-600
                          ">
                            {
                              item.keterangan ||
                              "-"
                            }
                          </p>

                        </td>


                        {/* DETAIL */}
                        <td className="px-5 py-4">

                          {item.bukti_bayar ? (

                            <div className="flex items-center gap-2">

                              <button
                                onClick={() =>
                                  setPreview(
                                    item.bukti_bayar
                                  )
                                }
                                className="
                                  inline-flex
                                  items-center
                                  gap-1.5
                                  rounded-lg
                                  border
                                  border-blue-200
                                  bg-white
                                  px-3
                                  py-1.5
                                  text-xs
                                  font-semibold
                                  text-blue-700
                                  transition-all
                                  hover:border-blue-700
                                  hover:bg-blue-700
                                  hover:text-white
                                "
                              >
                                <Eye className="h-3.5 w-3.5" />

                                Lihat
                              </button>


                              <a
                                href={
                                  item.bukti_bayar
                                }
                                download
                                className="
                                  inline-flex
                                  items-center
                                  gap-1.5
                                  rounded-lg
                                  bg-gray-100
                                  px-3
                                  py-1.5
                                  text-xs
                                  font-semibold
                                  text-gray-700
                                  transition
                                  hover:bg-gray-200
                                "
                              >
                                <Download className="h-3.5 w-3.5" />

                                Download
                              </a>

                            </div>

                          ) : (

                            <span className="text-xs text-gray-400">
                              Tidak tersedia
                            </span>

                          )}

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>


      {/* =====================================================
          PREVIEW
      ===================================================== */}

      {preview && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/70
            p-4
          "
          onClick={() =>
            setPreview(null)
          }
        >

          <div
            className="relative max-h-[90vh] max-w-4xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <img
              src={preview}
              alt="Preview bukti pembayaran"
              className="
                max-h-[85vh]
                max-w-full
                rounded-xl
                bg-white
                object-contain
                shadow-2xl
              "
            />

          </div>

        </div>

      )}

    </div>
  );
}


// =========================================================
// SUMMARY COMPONENT
// =========================================================

function Summary({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-100
        bg-white
        p-5
        shadow-sm
        transition-all
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-gray-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-800">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}