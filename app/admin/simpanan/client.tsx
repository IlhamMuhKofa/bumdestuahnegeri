"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Search,
  Wallet,
  GraduationCap,
  Clock3,
  ChevronRight,
  BadgeCheck,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";

type Props = {
  data: any[];
  search?: string;
};

export default function Client({
  data,
  search = "",
}: Props) {

  const [sort, setSort] = useState("terbaru");

  return (
    <div className="min-h-screen bg-gray-50/50 p-2">

      <div className="mx-auto max-w-7xl space-y-7">

        {/* =======================================================
            HEADER
        ======================================================= */}
        <div className="flex items-start justify-between">

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Data Simpanan Nasabah
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Kelola simpanan wajib dan tabungan pendidikan seluruh nasabah
            </p>
          </div>

        </div>


{/* =======================================================
    SEARCH + SORT
======================================================= */}
<div className="flex items-center gap-3">

  {/* SEARCH */}
  <div className="relative flex-1 max-w-full">

    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

    <input
      type="text"
      placeholder="Cari nama nasabah..."
      defaultValue={search}
      className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-gray-400"
    />

  </div>

  {/* SORT */}
  <div className="relative">

    <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />

    <select
      value={sort}
      onChange={(e) => setSort(e.target.value)}
      className="pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all appearance-none cursor-pointer text-gray-600"
    >
      <option value="terbaru">
        Terbaru
      </option>

      <option value="terlama">
        Terlama
      </option>

      <option value="az">
        Nama A – Z
      </option>

      <option value="za">
        Nama Z – A
      </option>
    </select>

    <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />

  </div>

</div>


        {/* =======================================================
            SUMMARY CARDS
        ======================================================= */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* =====================================================
              SIMPANAN WAJIB
          ===================================================== */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Simpanan Wajib
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {
                    data.filter(
                      (x) => x.total_wajib > 0
                    ).length
                  }
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 transition-colors group-hover:bg-green-100">

                <Wallet className="h-5 w-5 text-green-600" />

              </div>

            </div>

            <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl bg-gradient-to-r from-green-500 to-green-300 opacity-0 transition-opacity group-hover:opacity-100" />

          </div>


          {/* =====================================================
              TABUNGAN PENDIDIKAN
          ===================================================== */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Tabungan Pendidikan
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {
                    data.filter(
                      (x) => x.total_pendidikan > 0
                    ).length
                  }
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 transition-colors group-hover:bg-purple-100">

                <GraduationCap className="h-5 w-5 text-purple-600" />

              </div>

            </div>

            <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl bg-gradient-to-r from-purple-500 to-purple-300 opacity-0 transition-opacity group-hover:opacity-100" />

          </div>


          {/* =====================================================
              MENUNGGU VERIFIKASI
          ===================================================== */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Menunggu Verifikasi
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {
                    data.filter(
                      (x) => x.pending > 0
                    ).length
                  }
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 transition-colors group-hover:bg-amber-100">

                <Clock3 className="h-5 w-5 text-amber-600" />

              </div>

            </div>

            <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl bg-gradient-to-r from-amber-500 to-amber-300 opacity-0 transition-opacity group-hover:opacity-100" />

          </div>

        </div>


        {/* =======================================================
            TABLE CARD
        ======================================================= */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full">

              {/* =================================================
                  TABLE HEADER
              ================================================= */}
              <thead>

                <tr className="border-b border-gray-100 bg-blue-800">

                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white">
                    Nasabah
                  </th>

                  <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white">
                    Simpanan Wajib
                  </th>

                  <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-white">
                    Pendidikan
                  </th>

                  <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-white">
                    Pending
                  </th>

                  <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-white">
                    Status
                  </th>

                  <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-white">
                    Detail
                  </th>

                </tr>

              </thead>


              {/* =================================================
                  TABLE BODY
              ================================================= */}
              <tbody className="divide-y divide-gray-50">

                {data.length > 0 ? (

                  data.map(
                    (item: any) => (

                      <tr
                        key={item.id_anggota}
                        className="group transition-colors duration-150 hover:bg-blue-50/40"
                      >

                        {/* =================================================
                            NASABAH
                        ================================================= */}
                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">

                              <span className="text-xs font-bold text-blue-700">
                                {item.nama
                                  ?.charAt(0)
                                  ?.toUpperCase()}
                              </span>

                            </div>

                            <div className="min-w-0">

                              <span className="block text-sm font-medium text-gray-800">
                                {item.nama}
                              </span>

                              <span className="block text-xs text-gray-400">
                                {item.email}
                              </span>

                            </div>

                          </div>

                        </td>


                        {/* =================================================
                            SIMPANAN WAJIB
                        ================================================= */}
                        <td className="px-4 py-4">

                          <span className="text-sm font-semibold text-gray-800">
                            Rp{" "}
                            {item.total_wajib?.toLocaleString(
                              "id-ID"
                            )}
                          </span>

                        </td>


                        {/* =================================================
                            PENDIDIKAN
                        ================================================= */}
                        <td className="px-4 py-4">

                          <span className="text-sm font-semibold text-gray-800">
                            Rp{" "}
                            {item.total_pendidikan?.toLocaleString(
                              "id-ID"
                            )}
                          </span>

                        </td>


                        {/* =================================================
                            PENDING
                        ================================================= */}
                        <td className="px-4 py-4 text-center">

                          {item.pending > 0 ? (

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">

                              <Clock3 className="h-3.5 w-3.5" />

                              {item.pending} pembayaran

                            </span>

                          ) : (

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-4 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200">

                              <BadgeCheck className="h-3.5 w-3.5" />

                              Tidak ada

                            </span>

                          )}

                        </td>


                        {/* =================================================
                            STATUS
                        ================================================= */}
                        <td className="px-4 py-4 text-center">

                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-4 py-1 text-xs font-medium text-green-700 ring-1 ring-green-200">

                            Aktif

                          </span>

                        </td>


                        {/* =================================================
                            DETAIL
                        ================================================= */}
                        <td className="px-5 py-4 text-center">

                          <Link
                            href={`/admin/simpanan/${item.id_anggota}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-all duration-150 hover:border-blue-700 hover:bg-blue-700 hover:text-white"
                          >

                            Kelola

                          </Link>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  /* =================================================
                     EMPTY STATE
                  ================================================= */
                  <tr>

                    <td
                      colSpan={6}
                      className="py-16"
                    >

                      <div className="flex flex-col items-center justify-center text-center">

                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">

                          <Wallet className="h-6 w-6 text-gray-300" />

                        </div>

                        <p className="text-sm font-medium text-gray-500">
                          Belum ada data simpanan
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Data simpanan nasabah akan muncul di sini
                        </p>

                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}