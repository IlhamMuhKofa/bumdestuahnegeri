"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import {
  ArrowLeft,
  User,
  FileText,
  Clock,
  Banknote,
  CalendarDays,
  ShieldAlert,
  Eye,
  X,
  TrendingUp,
} from "lucide-react";

export default function DetailPengajuan() {
  const [data, setData] = useState<any>(null);
  const router = useRouter();
  const params = useParams();
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/peminjaman/${params.id}`)
      .then((res) => res.json())
      .then((res) => setData(res.data));
  }, [params?.id]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-[3px] border-blue-100 border-t-blue-800 rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Memuat data pengajuan...</p>
        </div>
      </div>
    );
  }

  const detail = data.detail?.[0];

const handleAction = async (
  status: "APPROVED" | "REJECTED"
) => {
  const isApprove = status === "APPROVED";

  const result = await Swal.fire({
    title: isApprove
      ? "Setujui Pengajuan?"
      : "Tolak Pengajuan?",
    text: isApprove
      ? "Pengajuan pinjaman akan disetujui dan proses selanjutnya akan dimulai."
      : "Pengajuan pinjaman akan ditolak. Tindakan ini tidak dapat dibatalkan.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: isApprove
      ? "Ya, Setujui"
      : "Ya, Tolak",
    cancelButtonText: "Batal",
    reverseButtons: true,
    confirmButtonColor: isApprove
      ? "#15803d"
      : "#dc2626",
    cancelButtonColor: "#6b7280",
    heightAuto: false,
  });

  if (!result.isConfirmed) return;

  try {
    const res = await fetch(`/api/peminjaman/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(
        data.error || "Gagal memperbarui status pengajuan."
      );
      return;
    }

    toast.success(
      isApprove
        ? "Pengajuan berhasil disetujui."
        : "Pengajuan berhasil ditolak."
    );

    router.push("/admin/pinjaman");
  } catch (err) {
    console.error(err);

    toast.error("Terjadi kesalahan.");
  }
};

  const statusMap: Record<string, { label: string; cls: string }> = {
    PENDING:  { label: "Menunggu",  cls: "bg-amber-50 text-amber-700 border border-amber-200" },
    APPROVED: { label: "Disetujui", cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
    REJECTED: { label: "Ditolak",   cls: "bg-red-50 text-red-600 border border-red-200" },
  };
  const statusInfo = statusMap[data.status] ?? {
    label: data.status,
    cls: "bg-gray-100 text-gray-600",
  };

  const isPending = data.status === "PENDING";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .dp-root { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      <div className="dp-root min-h-screen bg-slate-50">

        {/* ── BREADCRUMB ── */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-2 text-sm">
            <button
              onClick={() => router.push("/admin/pinjaman")}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-800 transition"
            >
              <ArrowLeft size={16} />
              Kembali
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-slate-400">Daftar Pinjaman</span>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-700">Detail Pengajuan</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-4">

          {/* ── HERO HEADER ── */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl p-6 md:p-8 shadow-lg text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                  <FileText size={30} />
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Pengajuan Pinjaman</p>
                  <h1 className="text-2xl md:text-3xl font-bold">{data.anggota?.nama}</h1>
                  <p className="text-blue-200 text-sm mt-1">
                    ID #{String(params?.id).padStart(5, "0")}
                  </p>
                </div>
              </div>
              <span className={`self-start md:self-auto px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.cls}`}>
                {statusInfo.label}
              </span>
            </div>
          </div>

          {/* ── SUMMARY CARDS ── */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <Banknote className="text-blue-800 shrink-0" size={20} />
                <div>
                  <p className="text-xs text-slate-500">Jumlah Pinjaman</p>
                  <p className="font-semibold text-slate-800">
                    Rp {data.total_pinjaman?.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <Clock className="text-blue-800 shrink-0" size={20} />
                <div>
                  <p className="text-xs text-slate-500">Jangka Waktu</p>
                  <p className="font-semibold text-slate-800">{data.jangka_waktu} Bulan</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-blue-800 shrink-0" size={20} />
                <div>
                  <p className="text-xs text-slate-500">Penghasilan</p>
                  <p className="font-semibold text-slate-800">
                    Rp {detail?.nilai_perolehan?.toLocaleString("id-ID") ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── DETAIL INFORMASI ── */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-lg font-bold text-slate-800">Informasi Pengajuan</h2>
              <p className="text-sm text-slate-500 mt-1">Detail lengkap data pengajuan pinjaman.</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-400">
                    Tanggal Pengajuan
                  </label>
                  <div className="flex items-center gap-2 mt-2 text-slate-800">
                    <CalendarDays size={16} className="text-slate-400 shrink-0" />
                    <span className="font-medium text-sm leading-snug">
                      {new Date(data.tanggal_pengajuan).toLocaleString("id-ID", {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase text-slate-400">
                    Jenis Agunan
                  </label>
                  <div className="flex items-center gap-2 mt-2 text-slate-800">
                    <ShieldAlert size={16} className="text-slate-400 shrink-0" />
                    <span className="font-medium">{detail?.jenis ?? "—"}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-400">
                  Rencana Usaha
                </label>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                  {detail?.keterangan || "Tidak ada keterangan."}
                </p>
              </div>
            </div>
          </div>

          {/* ── LAMPIRAN BERKAS ── */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-lg font-bold text-slate-800">Lampiran Berkas</h2>
              <p className="text-sm text-slate-500 mt-1">
                Dokumen pendukung yang dilampirkan nasabah.
              </p>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-4">

              {/* Foto Agunan */}
              <FilePreviewCard
                label="Foto Agunan"
                file={detail?.foto_agunan}
                type="image"
                onPreview={() => {
                  setPreviewFile(detail.foto_agunan);
                  setPreviewType("image");
                }}
              />

              {/* Surat Usaha */}
              <FilePreviewCard
                label="Surat Usaha"
                file={detail?.foto_surat}
                type={detail?.foto_surat?.includes(".pdf") ? "pdf" : "image"}
                onPreview={() => {
                  setPreviewFile(detail.foto_surat);
                  setPreviewType(detail.foto_surat?.includes(".pdf") ? "pdf" : "image");
                }}
              />

            </div>
          </div>

          {/* ── ACTION CARD ── */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800">Keputusan Pengajuan</h3>
            <p className="text-sm text-slate-500 mt-1 mb-5">
              Setujui atau tolak pengajuan pinjaman nasabah. Tindakan ini bersifat permanen.
            </p>

            <div className="grid md:grid-cols-2 gap-3">
              <button
                onClick={() => handleAction("APPROVED")}
                disabled={!isPending}
                className={`h-12 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-semibold transition ${
                  !isPending ? "opacity-40 cursor-not-allowed" : ""
                }`}
              >
                Setujui Pengajuan
              </button>

              <button
                onClick={() => handleAction("REJECTED")}
                disabled={!isPending}
                className={`h-12 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold transition ${
                  !isPending ? "opacity-40 cursor-not-allowed" : ""
                }`}
              >
                Tolak Pengajuan
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── PREVIEW MODAL ── */}
      {previewFile && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => { setPreviewFile(null); setPreviewType(null); }}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700">
                {previewType === "pdf" ? "Preview Dokumen" : "Preview Gambar"}
              </h3>
              <button
                onClick={() => { setPreviewFile(null); setPreviewType(null); }}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition flex items-center justify-center"
              >
                <X size={15} />
              </button>
            </div>
            <div className="p-4 bg-slate-50 flex justify-center">
              {previewType === "pdf" ? (
                <iframe src={previewFile} className="w-full h-[560px] rounded-lg" title="Preview" />
              ) : (
                <img
                  src={previewFile}
                  className="max-h-[560px] object-contain rounded-lg"
                  alt="Preview"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── File Preview Card ── */
function FilePreviewCard({
  label,
  file,
  type,
  onPreview,
}: {
  label: string;
  file?: string;
  type: "image" | "pdf";
  onPreview: () => void;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-slate-400 mb-2">{label}</p>
      <div
        className="rounded-2xl border border-slate-200 overflow-hidden relative bg-slate-50 group"
        style={{ height: 180 }}
      >
        {file ? (
          <>
            {type === "pdf" ? (
              <iframe src={file} className="w-full h-full" title={label} />
            ) : (
              <img src={file} className="w-full h-full object-cover" alt={label} />
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <button
                onClick={onPreview}
                className="flex items-center gap-2 bg-white text-slate-800 text-xs font-semibold px-4 py-2 rounded-xl shadow-md hover:bg-slate-50 transition"
              >
                <Eye size={14} />
                Preview
              </button>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
            {type === "pdf" ? (
              <FileText size={28} strokeWidth={1.5} />
            ) : (
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            )}
            <p className="text-xs text-slate-400">Tidak ada file</p>
          </div>
        )}
      </div>
    </div>
  );
}