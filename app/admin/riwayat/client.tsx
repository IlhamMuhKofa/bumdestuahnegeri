"use client";

import { useMemo, useState } from "react";
import { Download, Eye } from "lucide-react";

type Props = {
  // Data untuk tabel halaman aktif
  data?: any[];

  // Seluruh data transaksi untuk summary + laporan
  allData?: any[];

  search?: string;
};

type Filter = "SEMUA" | "PINJAMAN" | "SIMPANAN";

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
  // UNTUK SUMMARY DAN PDF
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
  // SUMMARY SELURUH DATA
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
            font-family:
              Arial,
              Helvetica,
              sans-serif;

            color: #1f2937;
            background: white;
            font-size: 11px;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;

            padding-bottom: 14px;

            border-bottom:
              3px solid #1d4ed8;

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
            grid-template-columns:
              repeat(3, 1fr);

            gap: 10px;

            margin-bottom: 20px;
          }

          .summary-card {
            border:
              1px solid #dbe2ea;

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

            border:
              1px solid #1d4ed8;
          }

          td {
            padding: 7px;

            font-size: 9.5px;

            border:
              1px solid #dbe2ea;

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

            border-top:
              1px solid #e5e7eb;

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

        <!-- HEADER -->

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

            <div>
              Tanggal Cetak
            </div>

            <strong>
              ${tanggalCetak}
            </strong>

            <div>
              Total ${rows.length} transaksi
            </div>

          </div>

        </div>


        <!-- SUMMARY -->

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


        <!-- TABLE -->

        <div class="section-title">
          Rincian Transaksi
        </div>

        <table>

          <thead>

            <tr>

              <th style="width: 16%">
                Nama
              </th>

              <th style="width: 11%">
                Tanggal
              </th>

              <th style="width: 17%">
                Jenis
              </th>

              <th style="width: 13%">
                Nominal
              </th>

              <th style="width: 11%">
                Metode
              </th>

              <th style="width: 32%">
                Keterangan
              </th>

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
                              item
                                .anggota
                                ?.nama ||
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


        <!-- FOOTER -->

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

    printWindow.document.write(
      html
    );

    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

        <div>

          <h1 className="text-2xl font-bold text-gray-800">
            Laporan Transaksi
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Data seluruh transaksi pembayaran nasabah
          </p>

        </div>

      </div>


      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="mb-6 grid gap-4 md:grid-cols-3">

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
          ACTION
      ===================================================== */}

      <div className="mb-4 flex flex-wrap gap-2">

        <button
          onClick={() =>
            printPdf(
              filteredAllData,
              filter === "SEMUA"
                ? "Laporan Semua Transaksi"
                : `Laporan Transaksi ${filter}`
            )
          }
          className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
        >

          <Download className="h-4 w-4" />

          Download Laporan Transaksi

        </button>

      </div>


      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px]">

            <thead className="bg-blue-800">

              <tr className="text-sm text-white">

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
                    className="px-5 py-4 text-left font-semibold"
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
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    Belum ada riwayat transaksi
                  </td>

                </tr>

              ) : (

                filteredData.map(
                  (item) => (

                    <tr
                      key={
                        item.id_riwayat
                      }
                      className="border-b last:border-0 hover:bg-gray-50"
                    >

                      <td className="px-5 py-4 text-sm font-medium text-gray-800">
                        {
                          item
                            .anggota
                            ?.nama ||
                          "-"
                        }
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {new Date(
                          item.tanggal
                        ).toLocaleDateString(
                          "id-ID"
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {
                          item.jenis_transaksi
                        }
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                        {formatRupiah(
                          item.nominal
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {
                          item.metode_bayar ||
                          "-"
                        }
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {
                          item.keterangan ||
                          "-"
                        }
                      </td>

                      <td className="px-5 py-4 text-sm">

                        {item.bukti_bayar ? (

                          <div className="flex gap-2">

                            <button
                              onClick={() =>
                                setPreview(
                                  item.bukti_bayar
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                            >

                              <Eye className="h-4 w-4" />

                              Lihat

                            </button>

                            <a
                              href={
                                item.bukti_bayar
                              }
                              download
                              className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                            >

                              <Download className="h-4 w-4" />

                              Download

                            </a>

                          </div>

                        ) : (
                          "-"
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


      {/* =====================================================
          PREVIEW BUKTI PEMBAYARAN
      ===================================================== */}

      {preview && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() =>
            setPreview(null)
          }
        >

          <img
            src={preview}
            alt="Preview bukti pembayaran"
            className="max-h-[85vh] max-w-4xl rounded-xl object-contain"
          />

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

    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-xl font-bold text-gray-900">
        {value}
      </p>

    </div>

  );
}