"use client";

import { useState, useEffect } from "react";
import {
  Wallet,
  Clock3,
  BadgeCheck,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  SlidersHorizontal,
} from "lucide-react";

export default function PengajuanPinjamanPage({ data }: any) {
  const [activeTab, setActiveTab] = useState("Semua");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("terbaru");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const tabs = ["Semua", "Menunggu", "Diterima", "Ditolak", "Aktif"];

  const pending = data.filter((d: any) => d.status?.toUpperCase() === "PENDING");
  const approved = data.filter((d: any) => d.status?.toUpperCase() === "APPROVED");
  const rejected = data.filter((d: any) => d.status?.toUpperCase() === "REJECTED");
  const active = data.filter((d: any) => d.status?.toUpperCase() === "ACTIVE");

  const filteredData = (() => {
    if (activeTab === "Menunggu") return pending;
    if (activeTab === "Diterima") return approved;
    if (activeTab === "Ditolak") return rejected;
    if (activeTab === "Aktif") return active;
    return data;
  })();

  const searchedData = filteredData.filter((item: any) =>
    item.anggota?.nama?.toLowerCase().includes(search.toLowerCase())
  );

  const sortedData = [...searchedData].sort((a: any, b: any) => {
    if (sort === "az") return (a.anggota?.nama || "").localeCompare(b.anggota?.nama || "");
    if (sort === "za") return (b.anggota?.nama || "").localeCompare(a.anggota?.nama || "");
    if (sort === "terlama") return new Date(a.tanggal_pengajuan).getTime() - new Date(b.tanggal_pengajuan).getTime();
    return new Date(b.tanggal_pengajuan).getTime() - new Date(a.tanggal_pengajuan).getTime();
  });

  const totalData = sortedData.length;
  const totalPages = Math.ceil(totalData / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search, sort]);

  const totalAktif = active.length;
  const totalPending = pending.length;
  const totalApproved = approved.length;
  const totalRejected = rejected.length;

  const tabCount = (tab: string) => {
    if (tab === "Semua") return data.length;
    if (tab === "Menunggu") return totalPending;
    if (tab === "Diterima") return totalApproved;
    if (tab === "Ditolak") return totalRejected;
    if (tab === "Aktif") return totalAktif;
    return 0;
  };

  const statusBadge = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "pending")
      return (
        <span className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
          Menunggu
        </span>
      );
    if (s === "approved")
      return (
        <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
          Diterima
        </span>
      );
    if (s === "active")
      return (
        <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
          Aktif
        </span>
      );
    if (s === "rejected")
      return (
        <span className="inline-flex items-center rounded-full border border-red-200 bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
          Ditolak
        </span>
      );
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[30px]">
              Pengajuan Pinjaman
            </h1>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              Kelola dan pantau pengajuan pinjaman nasabah
            </p>
          </div>
        </div>

                    {/* SEARCH + SORT */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama nasabah..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#2553d8] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="relative">
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-10 appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-8 text-sm text-slate-700 outline-none transition-all focus:border-[#2553d8] focus:ring-2 focus:ring-blue-100 cursor-pointer"
                >
                  <option value="terbaru">Terbaru</option>
                  <option value="terlama">Terlama</option>
                  <option value="az">Nama A – Z</option>
                  <option value="za">Nama Z – A</option>
                </select>
                <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

          {/* Aktif */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pinjaman Aktif</p>
                <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">{totalAktif}</p>
                <p className="mt-1 text-xs font-medium text-green-600">Berjalan</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 transition-colors group-hover:bg-blue-100 transition-colors">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-300 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Pending */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Menunggu</p>
                <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">{totalPending}</p>
                <p className="mt-1 text-xs font-medium text-amber-600">Perlu ditinjau</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 transition-colors group-hover:bg-yellow-100 transition-colors">
                <Clock3 className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-300 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Approved */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Disetujui</p>
                <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">{totalApproved}</p>
                <p className="mt-1 text-xs font-medium text-blue-600">Approved</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 transition-colors group-hover:bg-blue-100 transition-colors">
                <BadgeCheck className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-300 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Rejected */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ditolak</p>
                <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">{totalRejected}</p>
                <p className="mt-1 text-xs font-medium text-red-600">Tidak lolos</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 group-hover:bg-red-100 transition-colors">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-red-300 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

        </div>

                  {/* TOOLBAR */}
          <div className=" space-y-3">

{/* TABS */}
<div className="flex w-full gap-1 rounded-xl bg-slate-100 p-1">
  {tabs.map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`relative flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
        activeTab === tab
          ? "bg-white text-[#2553d8] shadow-sm"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {tab}

      {tabCount(tab) > 0 && (
        <span
          className={`rounded-full px-1.5 py-0.5 text-xs font-semibold leading-none ${
            activeTab === tab
              ? "bg-blue-50 text-[#2553d8]"
              : "bg-slate-200 text-slate-500"
          }`}
        >
          {tabCount(tab)}
        </span>
      )}
    </button>
  ))}
</div>
          </div>

        {/* TABLE CARD */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blue-700 bg-[#2553d8]">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-white/95">Anggota</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-white/95">Tgl Pengajuan</th>
                  <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-white/95">Jumlah</th>
                  <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-white/95">Jangka</th>
                  <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-white/95">Agunan</th>
                  <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-white/95">Status</th>
                  <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-white/95">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                          <Search className="h-6 w-6 text-slate-300" />
                        </div>
                        <p className="text-sm font-medium text-slate-600">Tidak ada data ditemukan</p>
                        <p className="text-xs text-slate-400 mt-1">Coba ubah filter atau kata kunci pencarian</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentData.map((item: any, idx: number) => (
                    <tr
                      key={item.id_peminjaman}
                      className="group transition-colors duration-150 hover:bg-blue-50/50"
                    >
                      {/* Anggota */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50">
                            <span className="text-xs font-bold text-[#2553d8]">
                              {(item.anggota?.nama || "?")[0].toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-slate-800">
                            {item.anggota?.nama}
                          </span>
                        </div>
                      </td>

                      {/* Tanggal */}
                      <td className="px-4 py-4">
                        <span className="block text-sm text-slate-700">{item.tanggal_formatted}</span>
                        <span className="text-xs text-slate-400">{item.waktu_formatted}</span>
                      </td>

                      {/* Jumlah */}
                      <td className="px-4 py-4 text-right">
                        <span className="text-sm font-semibold text-slate-800">
                          Rp {item.jumlah_formatted}
                        </span>
                      </td>

                      {/* Jangka Waktu */}
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {item.jangka_waktu} bln
                        </span>
                      </td>

                      {/* Agunan */}
                      <td className="px-4 py-4 text-center">
                        <span className="text-sm text-slate-600">
                          {item.detail?.[0]?.jenis || "—"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 text-center">
                        {statusBadge(item.status)}
                      </td>

                      {/* Aksi */}
                      <td className="px-5 py-4 text-center">
                        <a
                          href={`/admin/pinjaman/${item.id_peminjaman}`}
                          className="inline-flex h-9 items-center justify-center rounded-lg border border-blue-200 px-3 text-xs font-semibold text-[#2553d8] transition-all duration-150 hover:border-[#2553d8] hover:bg-[#2553d8] hover:text-white"
                        >
                          Detail
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/70">
            <p className="text-xs text-slate-500">
              Menampilkan{" "}
              <span className="font-semibold text-slate-700">
                {totalData === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + itemsPerPage, totalData)}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-slate-700">{totalData}</span> data
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Sebelumnya
              </button>

              {Array.from({ length: totalPages || 1 }, (_, i) => i + 1)
                .filter((p) => {
                  if (totalPages <= 5) return true;
                  return p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1;
                })
                .reduce((acc: (number | string)[], p, i, arr) => {
                  if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-xs text-slate-400">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p as number)}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                        currentPage === p
                          ? "bg-[#2553d8] text-white"
                          : "text-slate-600 border border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Berikutnya
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}