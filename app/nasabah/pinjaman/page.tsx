"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, ChevronDown, ClipboardList } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type StatusFilter =
  | "ACTIVE"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"

const FILTER_OPTIONS: StatusFilter[] = [
  "ACTIVE",
  "PENDING",
  "APPROVED",
  "REJECTED",
];

// Design System — halaman Pinjaman
const UI = {
  pageTitle: "text-2xl sm:text-[30px] font-bold tracking-tight text-gray-800",
  pageDescription: "text-sm leading-relaxed text-gray-500",
  sectionTitle: "text-base sm:text-lg font-semibold text-gray-900",
  body: "text-sm text-gray-700",
  secondary: "text-xs text-gray-500",
  button:
    "h-10 px-4 rounded-lg text-sm font-medium inline-flex items-center justify-center transition-all",
  smallButton:
    "h-8 px-3 rounded-lg text-xs font-medium inline-flex items-center justify-center transition-all",
  status:
    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
  card: "rounded-2xl border border-gray-200 bg-white shadow-sm",
} as const;

type Surat = {
  id_surat: number;
  kode: string;
  nama_file: string;
  file_url: string;
};

export default function Pengajuan() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<StatusFilter[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [pengajuan, setPengajuan] = useState<any[]>([]);
  const [surat, setSurat] = useState<Surat | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // ✅ FETCH DATA
  const fetchPengajuan = async () => {
    try {
      const res = await fetch("/api/peminjaman");
      const result = await res.json();

      console.log("DATA NASABAH:", result); // debug

      setPengajuan(result.data || []);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  // fecth surat
  const fetchSurat = async () => {
  try {
    const res = await fetch("/api/surat");
    const result = await res.json();

    setSurat(result);
  } catch (err) {
    console.error("Gagal ambil surat:", err);
  }
};

const handleDownload = async () => {
  if (!surat) return;

  try {
    const response = await fetch(surat.file_url);

    if (!response.ok) {
      throw new Error("Gagal mengambil file");
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download =
      surat.nama_file || "SP2K Pencairan.pdf";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Gagal download surat:", error);
  }
};

useEffect(() => {
  fetchPengajuan();
  fetchSurat();
}, []);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const toggleFilter = (opt: StatusFilter) => {
    setSelectedFilters((prev) =>
      prev.includes(opt) ? prev.filter((f) => f !== opt) : [...prev, opt]
    );
  };

  const normalizeStatus = (status?: string): StatusFilter | undefined => {
    const s = status?.toUpperCase();

    if (s === "ACTIVE") return "ACTIVE";
    if (s === "PENDING") return "PENDING";
    if (s === "APPROVED" || s === "DITERIMA" || s === "DISETUJUI") return "APPROVED";
    if (s === "REJECTED" || s === "DITOLAK") return "REJECTED";

    return undefined;
  };

  const statusLabel = (status?: string) => {
    const s = normalizeStatus(status);

    if (s === "ACTIVE") return "Aktif";
    if (s === "PENDING") return "Menunggu";
    if (s === "APPROVED") return "Diterima";
    if (s === "REJECTED") return "Ditolak";
    if (s === "LATE") return "Telat";

    return "-";
  };

  const statusClass = (status?: string) => {
    const s = normalizeStatus(status);

    if (s === "ACTIVE") return "bg-green-100 text-green-700";
    if (s === "PENDING") return "bg-yellow-100 text-yellow-700";
    if (s === "APPROVED") return "bg-blue-100 text-blue-700";
    if (s === "REJECTED" || s === "LATE") return "bg-red-100 text-red-700";

    return "bg-gray-100 text-gray-600";
  };

  const filteredPengajuan =
    selectedFilters.length === 0
      ? pengajuan
      : pengajuan.filter((item) =>
          selectedFilters.includes(
            normalizeStatus(item.status) as StatusFilter
          )
        );

  const totalData = filteredPengajuan.length;
  const totalPages = Math.ceil(totalData / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredPengajuan.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="bg-gray-50 px-4 py-5 sm:p-6">
      {/* Design System v1:
          Page title 30/24px • section 18/16px • body/table 14px • secondary/badge 12px
          Buttons 40px • small buttons 32px • card radius 16px • hero radius 24px */}

      <div className="mx-auto w-full max-w-6xl">

        {/* TITLE */}
        <div className="mb-6">

          <div className="flex items-center gap-3">
            <div>
              <h1 className={UI.pageTitle}>
                Pinjaman
              </h1>

              <p className={`mt-2 ${UI.pageDescription}`}>
                Pantau perkembangan pinjaman dan angsuran Anda dengan lebih mudah melalui layanan digital BUMDes
              </p>
            </div>

          </div>

        </div>

        {/* BANNER */}
        <div className="relative mb-6 overflow-hidden rounded-2xl sm:rounded-[32px] bg-[#1a3c2e] shadow-xl">

          {/* background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.10),_transparent_35%)]" />

          <div className="absolute -top-20 -right-16 h-64 w-64 rounded-full bg-white/[0.04]" />

          <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-white/[0.03]" />

          <div className="relative z-10 flex flex-col lg:flex-row justify-between min-h-[200px] sm:min-h-[220px]">

            {/* LEFT */}
            <div className="flex flex-1 flex-col justify-center px-5 py-6 sm:px-8 sm:py-8 lg:py-10">

              <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-green-300">
                BUMDes · Layanan Pinjaman
              </p>

              <h2 className="max-w-lg text-2xl sm:text-[30px] font-bold leading-tight text-white">
                Kelola{" "}
                <span className="text-yellow-400">
                  Pinjaman Anda
                </span>{" "}
                dengan lebih nyaman
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-300">
                Tenang, prosesnya mudah dan cepat. Kami siap membantu kebutuhan usaha maupun pribadi Anda.
              </p>

              {/* badge */}
              <div className="mt-4 sm:mt-5 flex flex-wrap gap-2">

                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                  Simpel tanpa ribet
                </span>

                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                  Cepat & jelas
                </span>

                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                  Transparan
                </span>

              </div>
 {/* BUTTON SIMULASI */}
<div className="mt-4 sm:mt-5 flex flex-wrap gap-2">
<Link
  href="/nasabah/pinjaman/simulasi"
  className="
    inline-flex w-fit items-center
    h-10
    rounded-lg
    border border-white/20
    bg-white/10
    px-4
    text-sm font-medium text-white
    backdrop-blur-sm
    transition-all duration-200
    hover:border-white/30
    hover:bg-white/20
    active:scale-[0.98]
  "
>
  Cek Angsuran Disini !
</Link>
</div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative hidden w-[320px] shrink-0 sm:block">

              {/* fade */}
              <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#1a3c2e] to-transparent" />

              <Image
                src="/img/hijab3.png"
                alt="banner"
                fill
                priority
                className="object-contain object-bottom scale-[1.12] translate-y-2"
              />
            </div>

          </div>
        </div>

{/* DOKUMEN PERSYARATAN */}
<div className={`mb-6 ${UI.card} p-4 sm:p-6`}>

  {/* HEADER */}
  <div className="mb-4 sm:mb-5 flex items-start justify-between gap-3">
    <div>
      <h3 className={UI.sectionTitle}>
        Dokumen Persyaratan
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Unduh dan lengkapi dokumen sebelum mengajukan pinjaman.
      </p>
    </div>

    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 shrink-0">
      Wajib
    </span>
  </div>

{/* CONTENT */}

{surat ? (
  <div
    className="
      group flex items-center justify-between gap-3
      rounded-xl border border-gray-200 bg-white
      p-3.5 sm:p-4
      transition-all duration-200
      hover:border-[#1a3c2e]/40
      hover:shadow-md
      hover:-translate-y-[2px]
    "
  >

    {/* LEFT */}
    <div className="flex items-center gap-3 min-w-0">

      {/* ICON */}
      <div className="
        flex h-10 w-10 shrink-0 items-center justify-center
        rounded-lg bg-[#1a3c2e]/10 text-[#1a3c2e]
      ">
        📄
      </div>

      {/* DOCUMENT INFO */}
      <div className="min-w-0">

        <p className="font-semibold text-gray-900 text-sm truncate">
          SP2K Pencairan
        </p>

        <p className="text-xs text-gray-500 truncate">
          {surat.nama_file || "SP2K Pencairan.pdf"}
        </p>

      </div>

    </div>

    {/* RIGHT / DOWNLOAD */}
    <button
      type="button"
      onClick={handleDownload}
      className="
        flex h-8 items-center gap-2 shrink-0
        text-sm font-medium text-[#1a3c2e]
        opacity-80 transition
        hover:opacity-100
        cursor-pointer
      "
    >

      <span className="hidden sm:inline">
        Download
      </span>

      <span className="transition group-hover:translate-x-1">
        →
      </span>

    </button>

  </div>

) : (

  /* DOCUMENT BELUM TERSEDIA */

  <div className="
    flex flex-col items-center justify-center
    rounded-xl border border-dashed border-gray-300
    p-6 text-center
  ">

    {/* ICON */}
    <div className="mb-2 text-2xl">
      📂
    </div>

    {/* TITLE */}
    <p className="text-sm font-medium text-gray-500">
      Dokumen belum tersedia
    </p>

    {/* DESCRIPTION */}
    <p className="text-xs text-gray-400 mt-1">
      Silakan hubungi admin
    </p>

  </div>

)}
</div>

        {/* ── Toolbar ── */}
        <div className="mb-4
flex
flex-col
items-start
gap-4
lg:flex-row
lg:items-center
lg:justify-between">
          <p className="text-sm text-gray-500">
            Daftar pengajuan Anda akan tampil di bawah ini.
          </p>

          <div className="flex
w-full
flex-col
gap-3
sm:flex-row
sm:justify-end">

            {/* Filter Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setFilterOpen((v) => !v)}
                className={`${UI.button} w-full sm:w-auto gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 shadow-sm`}
              >
                <span>Filter</span>
                {selectedFilters.length > 0 && (
                  <span className="bg-[#1a3c2e] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {selectedFilters.length}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`} />
              </button>

              {filterOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Status Pengajuan
                  </p>
                  <div className="flex flex-col gap-2.5">
                    {FILTER_OPTIONS.map((opt) => (
                      <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
                        <div
                          onClick={() => toggleFilter(opt)}
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${selectedFilters.includes(opt)
                              ? "bg-[#1a3c2e] border-[#1a3c2e]"
                              : "border-gray-300 group-hover:border-green-600"
                            }`}
                        >
                          {selectedFilters.includes(opt) && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                              <path d="M1.5 5l2.5 2.5 4.5-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
<span
  onClick={() => toggleFilter(opt)}
  className="text-sm text-gray-600 select-none"
>
  {opt === "ACTIVE" && "Aktif"}
  {opt === "PENDING" && "Menunggu"}
  {opt === "APPROVED" && "Diterima"}
  {opt === "REJECTED" && "Ditolak"}
</span>
                      </label>
                    ))}
                  </div>
                  {selectedFilters.length > 0 && (
                    <button
                      onClick={() => setSelectedFilters([])}
                      className="mt-3 w-full text-xs text-red-400 hover:text-red-600 transition-colors"
                    >
                      Reset
                    </button>
                  )}
                </div>
              )}
            </div>
            {/* ✅ BUTTON BARU (SELALU MUNCUL) */}
<Link
  href="/nasabah/pinjaman/form_pinjaman"
  className={`${UI.button} w-full sm:w-auto gap-2 bg-[#1a3c2e] hover:bg-green-900 text-white`}
>
  <Plus className="w-4 h-4" />
  Buat Pengajuan
</Link>

          </div>
        </div>

        {/* ── Table - DESKTOP ── */}
        <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
             <table className="min-w-[900px] w-full text-sm">
            <thead>
              <tr className="bg-[#1a3c2e]">
                {["Tanggal", "Jenis Pengajuan", "Jumlah", "Jangka Waktu", "Jenis Agunan", "Status"].map((col) => (
                  <th key={col} className="text-white/90 text-sm font-semibold text-center px-4 py-3.5">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPengajuan.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-6">
                      <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                        <ClipboardList className="w-8 h-8 text-gray-300" />
                      </div>

                      <div>
                        <p className="text-gray-700 font-semibold text-sm mb-1">
                          Belum ada pengajuan
                        </p>
                        <p className="text-gray-400 text-xs leading-relaxed max-w-xs">
                          Pengajuan pinjaman akan muncul di sini.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                currentData.map((item: any) => (
                  <tr key={item.id_peminjaman} className="border-b">
                    <td className="px-4 py-3.5 text-center text-sm">
                      <span className="block text-sm font-medium text-gray-800">
                        {new Date(item.tanggal_pengajuan).toLocaleDateString("id-ID", {
                          weekday: "long",
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(item.tanggal_pengajuan).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center text-sm">Pinjaman</td>
                    <td className="px-4 py-3.5 text-center text-sm">
                      Rp {item.total_pinjaman.toLocaleString()}
                    </td>

                    {/* JANGKA WAKTU */}
                    <td className="px-4 py-3.5 text-center text-sm">
                      {item.jangka_waktu} bulan
                    </td>

                    {/* AGUNAN */}
                    <td className="px-4 py-3.5 text-center text-sm">
                      {item.detail?.[0]?.jenis || "-"}
                    </td>

                    <td className="px-4 py-3.5 text-center text-sm">
                      <span
                        className={`${UI.status} ${statusClass(item.status)}`}
                      >
                        {statusLabel(item.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>

        {/* ── List - MOBILE (pengganti tabel) ── */}
        <div className="md:hidden space-y-3">

          {filteredPengajuan.length === 0 ? (

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm flex flex-col items-center justify-center py-14 px-6 text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                <ClipboardList className="w-8 h-8 text-gray-300" />
              </div>

              <div>
                <p className="text-gray-700 font-semibold text-sm mb-1">
                  Belum ada pengajuan
                </p>
                <p className="text-gray-400 text-xs leading-relaxed max-w-xs">
                  Pengajuan pinjaman akan muncul di sini.
                </p>
              </div>
            </div>

          ) : (

            currentData.map((item: any) => (
              <div
                key={item.id_peminjaman}
                className={`${UI.card} p-4`}
              >
                {/* TOP: tanggal + status */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="text-xs text-gray-500 leading-relaxed">
                    <span className="block">
                      {new Date(item.tanggal_pengajuan).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="block text-[11px] text-gray-400">
                      {new Date(item.tanggal_pengajuan).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <span
                    className={`${UI.status} shrink-0 ${statusClass(item.status)}`}
                  >
                    {statusLabel(item.status)}
                  </span>
                </div>

                {/* JENIS + JUMLAH */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-semibold text-gray-800">
                    Pinjaman
                  </span>
                  <span className="text-sm font-semibold text-emerald-700 shrink-0">
                    Rp {item.total_pinjaman.toLocaleString()}
                  </span>
                </div>

                {/* DETAIL: jangka waktu & agunan */}
                <div className="grid grid-cols-2 gap-3 pt-3 mt-1 border-t border-gray-100 text-xs">
                  <div>
                    <p className="text-gray-400 mb-0.5">Jangka Waktu</p>
                    <p className="text-gray-700 font-medium">{item.jangka_waktu} bulan</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-0.5">Jenis Agunan</p>
                    <p className="text-gray-700 font-medium truncate">
                      {item.detail?.[0]?.jenis || "-"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}

        </div>

        {/* Pagination */}
        <div className="flex
flex-col
gap-4
sm:flex-row
sm:items-center
sm:justify-between
mt-4
px-1">

          {/* INFO */}
          <span className="text-sm text-gray-500">
            Menampilkan {totalData === 0 ? 0 : startIndex + 1} -{" "}
            {Math.min(startIndex + itemsPerPage, totalData)} dari {totalData} pengajuan
          </span>

          {/* BUTTON */}
          <div className="flex gap-2">

            {/* PREV */}
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className={`${UI.smallButton} border ${currentPage === 1
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 hover:bg-gray-100"
                }`}
            >
              ‹ Sebelumnya
            </button>

            {/* PAGE NUMBER */}
            <span className="h-8 px-3 text-xs font-medium inline-flex items-center">
              Halaman {currentPage} / {totalPages || 1}
            </span>

            {/* NEXT */}
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`${UI.smallButton} border ${currentPage === totalPages || totalPages === 0
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
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