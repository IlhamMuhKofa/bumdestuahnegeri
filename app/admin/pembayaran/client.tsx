"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Eye } from "lucide-react";
import { konfirmasiPembayaran } from "@/app/admin/cicilan/konten/[id_anggota]/[id_peminjaman]/action";

type Props = {
  pinjaman?: any[];
  simpanan?: any[];
};

type Tab = "PINJAMAN" | "SIMPANAN";

type RekapItem = {
  id: number;
  idJadwal?: number;
  nama?: string;
  nominal?: number;
  metode: string;
  status: string;
  keterangan: string;
  bukti?: string | null;
  tanggal: string | Date;
};

export default function ClientPage({
  pinjaman = [],
  simpanan = [],
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("PINJAMAN");
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const data: RekapItem[] =
    activeTab === "PINJAMAN"
      ? pinjaman.map((item) => ({
          id: item.id_pembayaran,
          idJadwal: item.id_jadwal,
          nama: item.jadwal?.peminjaman?.anggota?.nama,
          nominal: item.jumlah,
          metode: item.metode_bayar,
          status: item.status,
          keterangan: `Pembayaran ${item.metode_bayar === "CASH" ? "Cash" : "Transfer"} cicilan ke-${item.jadwal?.cicilan_ke}`,
          bukti: item.bukti_bayar,
          tanggal: item.tanggal_bayar,
        }))
      : simpanan.map((item) => ({
          id: item.id_pembayaran_simpanan,
          nama: item.simpanan?.anggota?.nama,
          nominal: item.nominal_bayar,
          metode: item.metode_bayar || "-",
          status: item.status,
          keterangan: `Pembayaran ${item.metode_bayar === "CASH" ? "Cash" : "Transfer"} setoran ke-${item.bulan_ke}`,
          bukti: item.bukti_bayar,
          tanggal: item.tanggal_bayar,
        }));

  const formatRupiah = (value?: number) =>
    "Rp " + (value || 0).toLocaleString("id-ID");

  const handleVerify = async (idJadwal: number) => {
    try {
      setLoadingId(idJadwal);
      await konfirmasiPembayaran(idJadwal);
      router.refresh();
    } catch (error: any) {
      alert(error.message || "Gagal verifikasi pembayaran");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Rekap Pembayaran
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Pembayaran pinjaman dan simpanan seluruh status
          </p>
        </div>

        <button
          onClick={() => router.push("/admin/pembayaran/form")}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-green-700"
        >
          + Tambah Pembayaran
        </button>
      </div>

      <div className="mb-6 flex gap-2 rounded-2xl border bg-white p-2">
        {[
          ["PINJAMAN", "Pembayaran Pinjaman"],
          ["SIMPANAN", "Pembayaran Simpanan"],
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() => setActiveTab(value as Tab)}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold ${
              activeTab === value
                ? "bg-blue-700 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {data.length === 0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center text-gray-500">
          Belum ada data pembayaran
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.map((item) => (
            <div
              key={`${activeTab}-${item.id}`}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-gray-800">
                    {item.nama || "-"}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(item.tanggal).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <Row label="Nominal" value={formatRupiah(item.nominal)} strong />
                <Row label="Metode" value={item.metode} />
                <Row label="Keterangan" value={item.keterangan} />
              </div>

              <div className="mt-5 flex gap-2">
                {item.bukti ? (
                  <>
                    <button
                      onClick={() => setPreview(item.bukti || null)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      <Eye className="h-4 w-4" />
                      Lihat Bukti
                    </button>
                    <a
                      href={item.bukti}
                      download
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </>
                ) : (
                  <span className="text-xs text-red-500">
                    Bukti belum tersedia
                  </span>
                )}
              </div>

              {activeTab === "PINJAMAN" && item.status === "MENUNGGU" && item.idJadwal && (
                <button
                  onClick={() => handleVerify(item.idJadwal!)}
                  disabled={loadingId === item.idJadwal}
                  className="mt-4 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-300"
                >
                  {loadingId === item.idJadwal ? "Memproses..." : "Verifikasi Pembayaran"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

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

function Row({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className={`text-right ${strong ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
        {value}
      </span>
    </div>
  );
}

function statusClass(status: string) {
  if (status === "BERHASIL") return "bg-green-100 text-green-700";
  if (status === "DITOLAK") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
}
