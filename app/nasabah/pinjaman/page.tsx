"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, ChevronDown, ClipboardList } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FormPengajuan from "@/app/nasabah/pinjaman/form_pinjaman/formpengajuan";
import { AnimatePresence, motion } from "framer-motion";

type StatusFilter =
  | "ACTIVE"
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

const FILTER_OPTIONS: StatusFilter[] = [
  "ACTIVE",
  "PENDING",
  "APPROVED",
  "REJECTED",
];

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
  const [openForm, setOpenForm] = useState(false);
  const [pengajuan, setPengajuan] = useState<any[]>([]);
  const [surat, setSurat] = useState<Surat | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // ✅ FETCH DATA
  const fetchPengajuan = async () => {
    try {
      const res = await fetch("/api/nasabah/peminjaman");
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

  const filteredPengajuan =
  selectedFilters.length === 0
    ? pengajuan
    : pengajuan.filter((item) =>
        selectedFilters.includes(
          item.status?.toUpperCase()
        )
      );

  const totalData = filteredPengajuan.length;
  const totalPages = Math.ceil(totalData / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData =
  filteredPengajuan.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const statusLabel = (status?: string) => {
    const s = status?.toUpperCase();
    if (s === "PENDING") return "Menunggu";
    if (s === "APPROVED") return "Disetujui";
    if (s === "REJECTED") return "Ditolak";
    if (s === "ACTIVE") return "Aktif";
    return "-";
  };

  const statusClass = (status?: string) => {
    const s = status?.toUpperCase();
    if (s === "PENDING") return "bg-yellow-100 text-yellow-700";
    if (s === "APPROVED") return "bg-blue-100 text-blue-700";
    if (s === "ACTIVE") return "bg-green-100 text-green-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="bg-gray-50 px-4 py-5 sm:p-6">
      <div className="mx-auto w-full max-w-6xl">

        {/* TITLE */}
        <div className="mb-6">

          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl tracking-tight text-gray-800">
                Pinjaman
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-gray-500">
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

              <p className="mb-2 sm:mb-3 text-[10px] sm:text-xs font-semibold uppercase tracking-[2px] sm:tracking-[3px] text-green-300">
                BUMDes · Layanan Pinjaman
              </p>

              <h2 className="max-w-lg text-2xl sm:text-3xl font-bold leading-tight text-white">
                Kelola{" "}
                <span className="text-yellow-400">
                  Pinjaman Anda
                </span>{" "}
                dengan lebih nyaman
              </h2>

              <p className="mt-3 sm:mt-4 max-w-xl text-sm leading-relaxed text-gray-300">
                Tenang, prosesnya mudah dan cepat. Kami siap membantu kebutuhan usaha maupun pribadi Anda.
              </p>

              {/* badge */}
              <div className="mt-4 sm:mt-5 flex flex-wrap gap-2">

                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
                  Simpel tanpa ribet
                </span>

                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
                  Cepat & jelas
                </span>

                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
                  Transparan
                </span>

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
<div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">

  {/* HEADER */}
  <div className="mb-4 sm:mb-5 flex items-start justify-between gap-3">
    <div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
        Dokumen Persyaratan
      </h3>
      <p className="mt-1 text-xs sm:text-sm text-gray-500">
        Unduh dan lengkapi dokumen sebelum mengajukan pinjaman.
      </p>
    </div>

    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 shrink-0">
      Wajib
    </span>
  </div>

  {/* CONTENT */}
  <div className="grid gap-4 md:grid-cols-1">

    {surat ? (
      <a
        href={surat.file_url}
        target="_blank"
        rel="noreferrer"
        download
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
          <div className="
            flex h-10 w-10 shrink-0 items-center justify-center
            rounded-lg bg-[#1a3c2e]/10 text-[#1a3c2e]
          ">
            📄
          </div>

          <div className="min-w-0">
            <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
              SP2K Pencairan
            </p>
            <p className="text-xs text-gray-500 truncate">
              SP2K Pencairan.pdf
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="
          flex items-center gap-1 sm:gap-2 shrink-0
          text-xs sm:text-sm font-medium text-[#1a3c2e]
          opacity-80 transition group-hover:opacity-100
        ">
          <span className="hidden sm:inline">Download</span>
          <span className="transition group-hover:translate-x-1">
            →
          </span>
        </div>
      </a>
    ) : (
      <div className="
        flex flex-col items-center justify-center
        rounded-xl border border-dashed border-gray-300
        p-6 text-center
      ">
        <div className="mb-2 text-2xl">📂</div>
        <p className="text-sm font-medium text-gray-500">
          Dokumen belum tersedia
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Silakan hubungi admin
        </p>
      </div>
    )}

  </div>
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
                className="flex w-full sm:w-auto items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-all"
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
            <button
              onClick={() => setOpenForm(true)}
              className="flex w-full sm:w-auto items-center justify-center gap-2 bg-[#1a3c2e] hover:bg-green-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Buat Pengajuan
            </button>

          </div>
        </div>

        {/* ── Table - DESKTOP ── */}
        <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
             <table className="min-w-[900px] w-full text-sm">
            <thead>
              <tr className="bg-[#1a3c2e]">
                {["Tanggal", "Jenis Pengajuan", "Jumlah", "Jangka Waktu", "Jenis Agunan", "Status"].map((col) => (
                  <th key={col} className="text-white/90 font-semibold text-center px-4 py-4">
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
                    <td className="px-4 py-3 text-center">
                      <span className="block font-medium">
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
                    <td className="px-4 py-3 text-center">Pinjaman</td>
                    <td className="px-4 py-3 text-center">
                      Rp {item.total_pinjaman.toLocaleString()}
                    </td>

                    {/* JANGKA WAKTU */}
                    <td className="px-4 py-3 text-center">
                      {item.jangka_waktu} bulan
                    </td>

                    {/* AGUNAN */}
                    <td className="px-4 py-3 text-center">
                      {item.detail?.[0]?.jenis || "-"}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${statusClass(item.status)}`}
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
                className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4"
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
                    className={`px-2.5 py-1 text-xs rounded-full font-medium shrink-0 ${statusClass(item.status)}`}
                  >
                    {statusLabel(item.status)}
                  </span>
                </div>

                {/* JENIS + JUMLAH */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-semibold text-gray-800 text-sm">
                    Pinjaman
                  </span>
                  <span className="font-bold text-emerald-700 text-sm shrink-0">
                    Rp {item.total_pinjaman.toLocaleString()}
                  </span>
                </div>

                {/* DETAIL: jangka waktu & agunan */}
                <div className="grid grid-cols-2 gap-2 pt-3 mt-1 border-t border-gray-100 text-xs">
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
              className={`px-3 py-1.5 rounded-lg border text-xs ${currentPage === 1
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 hover:bg-gray-100"
                }`}
            >
              ‹ Sebelumnya
            </button>

            {/* PAGE NUMBER */}
            <span className="px-3 py-1.5 text-xs font-medium">
              Halaman {currentPage} / {totalPages || 1}
            </span>

            {/* NEXT */}
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-1.5 rounded-lg border text-xs ${currentPage === totalPages || totalPages === 0
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 hover:bg-gray-100"
                }`}
            >
              Berikutnya ›
            </button>

          </div>
        </div>
      </div>
      <AnimatePresence>
        {openForm && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay blur */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpenForm(false)}
            />

            {/* Modal content */}
            <motion.div
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl"
              initial={{ y: 30, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.95 }}
            >
              <FormPengajuan />

              {/* Tombol close */}
              <button
                onClick={() => setOpenForm(false)}
                className="absolute top-4 right-4 bg-white border rounded-full p-2 shadow"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}