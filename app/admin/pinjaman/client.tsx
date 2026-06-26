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
  const itemsPerPage = 7;

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
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Menunggu
        </span>
      );
    if (s === "approved")
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          Diterima
        </span>
      );
    if (s === "active")
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700 ring-1 ring-green-200">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Aktif
        </span>
      );
    if (s === "rejected")
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-red-50 text-red-700 ring-1 ring-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          Ditolak
        </span>
      );
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-2">
      <div className="max-w-7xl mx-auto space-y-7">

        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Pengajuan Pinjaman
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Kelola dan pantau pengajuan pinjaman nasabah
            </p>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">

          {/* Aktif */}
          <div className="group relative bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pinjaman Aktif</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{totalAktif}</p>
                <p className="mt-1 text-xs text-green-600 font-medium">Berjalan</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-300 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Pending */}
          <div className="group relative bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Menunggu</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{totalPending}</p>
                <p className="mt-1 text-xs text-amber-600 font-medium">Perlu ditinjau</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 group-hover:bg-amber-100 transition-colors">
                <Clock3 className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-300 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Approved */}
          <div className="group relative bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Disetujui</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{totalApproved}</p>
                <p className="mt-1 text-xs text-blue-600 font-medium">Approved</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors">
                <BadgeCheck className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-300 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Rejected */}
          <div className="group relative bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ditolak</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{totalRejected}</p>
                <p className="mt-1 text-xs text-red-500 font-medium">Tidak lolos</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 group-hover:bg-red-100 transition-colors">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-red-300 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

        </div>

                  {/* TOOLBAR */}
          <div className=" border-b border-gray-100 space-y-4">

            {/* TABS */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                  {tabCount(tab) > 0 && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full font-semibold leading-none ${
                        activeTab === tab
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {tabCount(tab)}
                    </span>
                  )}
                </button>
              ))}
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
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-gray-400"
                />
              </div>

              <div className="relative">
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all appearance-none cursor-pointer text-gray-600"
                >
                  <option value="terbaru">Terbaru</option>
                  <option value="terlama">Terlama</option>
                  <option value="az">Nama A – Z</option>
                  <option value="za">Nama Z – A</option>
                </select>
                <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-blue-800">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Anggota</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Tgl Pengajuan</th>
                  <th className="px-4 py-3.5 text-right text-xs font-semibold text-white uppercase tracking-wider">Jumlah</th>
                  <th className="px-4 py-3.5 text-center text-xs font-semibold text-white uppercase tracking-wider">Jangka</th>
                  <th className="px-4 py-3.5 text-center text-xs font-semibold text-white uppercase tracking-wider">Agunan</th>
                  <th className="px-4 py-3.5 text-center text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-center text-xs font-semibold text-white uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                          <Search className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">Tidak ada data ditemukan</p>
                        <p className="text-xs text-gray-400 mt-1">Coba ubah filter atau kata kunci pencarian</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentData.map((item: any, idx: number) => (
                    <tr
                      key={item.id_peminjaman}
                      className="group hover:bg-blue-50/40 transition-colors duration-150"
                    >
                      {/* Anggota */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-blue-700">
                              {(item.anggota?.nama || "?")[0].toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-800">
                            {item.anggota?.nama}
                          </span>
                        </div>
                      </td>

                      {/* Tanggal */}
                      <td className="px-4 py-4">
                        <span className="block text-sm text-gray-800">{item.tanggal_formatted}</span>
                        <span className="text-xs text-gray-400">{item.waktu_formatted}</span>
                      </td>

                      {/* Jumlah */}
                      <td className="px-4 py-4 text-right">
                        <span className="text-sm font-semibold text-gray-800">
                          Rp {item.jumlah_formatted}
                        </span>
                      </td>

                      {/* Jangka Waktu */}
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-medium text-gray-600">
                          {item.jangka_waktu} bln
                        </span>
                      </td>

                      {/* Agunan */}
                      <td className="px-4 py-4 text-center">
                        <span className="text-sm text-gray-600">
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
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-700 hover:text-white hover:border-green-700 transition-all duration-150"
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
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-500">
              Menampilkan{" "}
              <span className="font-semibold text-gray-700">
                {totalData === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + itemsPerPage, totalData)}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-gray-700">{totalData}</span> data
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
                    <span key={`ellipsis-${i}`} className="px-2 text-xs text-gray-400">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p as number)}
                      className={`w-8 h-8 text-xs font-semibold rounded-lg transition-all ${
                        currentPage === p
                          ? "bg-blue-700 text-white"
                          : "text-gray-600 border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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