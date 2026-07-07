"use client";

import { useMemo, useState } from "react";
import { Download, Eye } from "lucide-react";

type Props = {
  data?: any[];
};

type Filter = "SEMUA" | "PINJAMAN" | "SIMPANAN";

export default function ClientPage({
  data = [],
}: Props) {
  const [filter, setFilter] = useState<Filter>("SEMUA");
  const [preview, setPreview] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    if (filter === "SEMUA") return data;

    return data.filter((item) => {
      const kategori = item.kategori || "";
      const jenis = item.jenis_transaksi || "";

      return kategori === filter || jenis.includes(filter);
    });
  }, [data, filter]);

  const summary = useMemo(() => {
    return {
      total: filteredData.length,
      pinjaman: filteredData
        .filter((item) => (item.kategori || item.jenis_transaksi).includes("PINJAMAN"))
        .reduce((sum, item) => sum + (item.nominal || 0), 0),
      simpanan: filteredData
        .filter((item) => (item.kategori || item.jenis_transaksi).includes("SIMPANAN"))
        .reduce((sum, item) => sum + (item.nominal || 0), 0),
    };
  }, [filteredData]);

  const formatRupiah = (value?: number) =>
    "Rp " + (value || 0).toLocaleString("id-ID");

  const printPdf = (rows: any[], title: string) => {
    const totalPinjaman = rows
      .filter((item) => (item.kategori || item.jenis_transaksi).includes("PINJAMAN"))
      .reduce((sum, item) => sum + (item.nominal || 0), 0);
    const totalSimpanan = rows
      .filter((item) => (item.kategori || item.jenis_transaksi).includes("SIMPANAN"))
      .reduce((sum, item) => sum + (item.nominal || 0), 0);

    const html = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #111827; }
            h1 { margin: 0; font-size: 22px; }
            h2 { margin: 6px 0 0; font-size: 16px; color: #166534; }
            .muted { color: #6b7280; font-size: 12px; }
            .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 24px 0; }
            .box { border: 1px solid #d1d5db; border-radius: 8px; padding: 12px; }
            .box strong { display: block; margin-top: 6px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th { background: #166534; color: white; text-align: left; }
            th, td { border: 1px solid #d1d5db; padding: 8px; vertical-align: top; }
          </style>
        </head>
        <body>
          <h1>BUMDes Tuah Negri</h1>
          <h2>${title}</h2>
          <p class="muted">Tanggal cetak: ${new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}</p>
          <div class="summary">
            <div class="box">Total Transaksi<strong>${rows.length}</strong></div>
            <div class="box">Total Pinjaman<strong>${formatRupiah(totalPinjaman)}</strong></div>
            <div class="box">Total Simpanan<strong>${formatRupiah(totalSimpanan)}</strong></div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Tanggal</th>
                <th>Jenis</th>
                <th>Nominal</th>
                <th>Metode</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              ${rows
                .map(
                  (item) => `
                    <tr>
                      <td>${item.anggota?.nama || "-"}</td>
                      <td>${new Date(item.tanggal).toLocaleDateString("id-ID")}</td>
                      <td>${item.jenis_transaksi}</td>
                      <td>${formatRupiah(item.nominal)}</td>
                      <td>${item.metode_bayar || "-"}</td>
                      <td>${item.keterangan || "-"}</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
          <script>window.print()</script>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow?.document.write(html);
    printWindow?.document.close();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Laporan Transaksi
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Data seluruh transaksi pembayaran nasabah
          </p>
        </div>

        {/* <div className="flex flex-wrap gap-2">
          {(["SEMUA", "PINJAMAN", "SIMPANAN"] as Filter[]).map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                filter === item
                  ? "bg-blue-700 text-white"
                  : "border bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item === "SEMUA" ? "Semua" : item[0] + item.slice(1).toLowerCase()}
            </button>
          ))}
        </div> */}
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <Summary label="Total Transaksi" value={`${summary.total}`} />
        <Summary label="Total Pinjaman" value={formatRupiah(summary.pinjaman)} />
        <Summary label="Total Simpanan" value={formatRupiah(summary.simpanan)} />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => printPdf(data, "Laporan Semua Transaksi")}
          className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-900"
        >
          Download Laporan Transaksi
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-blue-800">
              <tr className="text-sm text-white">
                {["Nama", "Tanggal", "Jenis Transaksi", "Jumlah", "Metode", "Keterangan", "Detail"].map((col) => (
                  <th key={col} className="px-5 py-4 text-left font-semibold">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                    Belum ada riwayat transaksi
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id_riwayat} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-5 py-4 text-sm font-medium text-gray-800">
                      {item.anggota?.nama || "-"}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {new Date(item.tanggal).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">
                      {item.jenis_transaksi}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                      {formatRupiah(item.nominal)}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">
                      {item.metode_bayar || "-"}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {item.keterangan || "-"}
                    </td>
                    <td className="px-5 py-4 text-sm">
                      {item.bukti_bayar ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setPreview(item.bukti_bayar)}
                            className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                          >
                            <Eye className="h-4 w-4" />
                            Lihat
                          </button>
                          <a
                            href={item.bukti_bayar}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPreview(null)}
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

function Summary({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
