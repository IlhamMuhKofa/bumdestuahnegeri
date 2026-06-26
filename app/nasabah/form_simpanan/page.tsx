"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, ChevronDown, ClipboardList } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FormPengajuan from "@/app/nasabah/pinjaman/form_pinjaman/formpengajuan";
import { AnimatePresence, motion } from "framer-motion";

// ─────────────────────────────────────────────
// 🖼️  Ganti path di bawah dengan gambar Anda
const BANNER_IMAGE_SRC = "/images/banner-illustration.png";
// ─────────────────────────────────────────────



type JenisPengajuan = "Wajib" | "Sukarela" | "Pendidikan" | "Berjangka";
const FILTER_OPTIONS: JenisPengajuan[] = ["Wajib", "Sukarela", "Pendidikan", "Berjangka"];

export default function Pengajuan() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<JenisPengajuan[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const toggleFilter = (opt: JenisPengajuan) => {
    setSelectedFilters((prev) =>
      prev.includes(opt) ? prev.filter((f) => f !== opt) : [...prev, opt]
    );
  };

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Simpanan</h1>

        {/* ── Banner ── */}
        <div className="relative rounded-2xl overflow-hidden mb-6 bg-[#1a3c2e] min-h-[160px]">
          {/* Subtle radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#2d6a4f55_0%,_transparent_65%)]" />
          {/* Decorative circles */}
          <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute -right-2 top-10 w-28 h-28 rounded-full bg-white/5" />

          <div className="relative z-10 flex items-stretch justify-between">
            {/* Left — text */}
            <div className="flex-1 px-7 py-7">
              <p className="text-green-400 text-xs font-semibold tracking-widest uppercase mb-2">
                BUMDes · Layanan Keuangan
              </p>
              <h2 className="text-white text-xl font-bold leading-snug mb-2">
                Hai, sepertinya Anda belum{" "}
                {/* <br className="hidden sm:block" /> */}
                <span className="text-yellow-400">mengajukan simpanan</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
                Tenang, prosesnya mudah dan cepat. Kami siap membantu kebutuhan usaha maupun pribadi Anda.
              </p>
              {/* Pills */}
              <div className="flex flex-wrap gap-2 mt-4">
                {["Simpel tanpa ribet", "Cepat & jelas", "Transparan"].map((tag) => (
                  <span key={tag} className="bg-white/10 text-white/80 text-xs font-medium px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — custom image */}
            <div className="relative hidden sm:block w-56 shrink-0 self-stretch">
              <Image
                src="/img/hijab3.png"
                alt="Banner illustration"
                fill
                className="object-cover -translate-x-10"
                priority
              />
            </div>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between mb-4 gap-3">
          <p className="text-sm text-gray-500">
            Daftar pengajuan Anda akan tampil di bawah ini.
          </p>

          <div className="flex items-center gap-4">

          {/* Filter Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setFilterOpen((v) => !v)}
              className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-all"
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
                  Jenis Setoran
                </p>
                <div className="flex flex-col gap-2.5">
                  {FILTER_OPTIONS.map((opt) => (
                    <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
                      <div
                        onClick={() => toggleFilter(opt)}
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedFilters.includes(opt)
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
                      <span onClick={() => toggleFilter(opt)} className="text-sm text-gray-600 select-none">
                        {opt}
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
      className="flex items-center gap-1.5 bg-[#1a3c2e] hover:bg-green-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all"
    >
      <Plus className="w-4 h-4" />
      Buat Setoran
    </button>

          </div>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1a3c2e]">
                {["Tanggal", "Jenis simpanan", "Nominal", "Status", "Aksi"].map((col) => (
                  <th key={col} className="text-white/90 font-semibold text-center px-4 py-4">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5}>
                  <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-6">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                      <ClipboardList className="w-8 h-8 text-gray-300" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-semibold text-sm mb-1">
                        Belum ada pengajuan
                      </p>
                      <p className="text-gray-400 text-xs leading-relaxed max-w-xs">
                        Pengajuan pinjaman, angsuran, atau setoran yang Anda buat akan muncul di sini.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-400 px-1">
          <span>Menampilkan 0 pengajuan</span>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-300 cursor-not-allowed text-xs">
              ‹ Sebelumnya
            </button>
            <button disabled className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-300 cursor-not-allowed text-xs">
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