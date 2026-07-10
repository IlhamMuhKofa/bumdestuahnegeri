"use client";

import Link from "next/link";

import {
  Search,
  Wallet,
  GraduationCap,
  Clock3,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";

type Props = {
  data: any[];
  search?: string;
};

export default function Client({
  data,
  search = "",
}: Props) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="mx-auto max-w-7xl space-y-6">

        {/* =======================================================
            HEADER
        ======================================================= */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h1 className="text-3xl font-bold text-gray-800">
              Data Simpanan Nasabah
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Kelola simpanan wajib dan tabungan pendidikan seluruh nasabah
            </p>

          </div>

          {/* SEARCH */}
          <form action="/admin/simpanan" className="relative w-full lg:w-96">

            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              name="q"
              defaultValue={search}
              placeholder="Cari nama nasabah..."
              className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-[#1a3c2e]"
            />

          </form>

        </div>

        {/* =======================================================
            SUMMARY CARD
        ======================================================= */}
        <div className="grid gap-4 md:grid-cols-3">

          {/* TOTAL SIMPANAN WAJIB */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-gray-500">
                  Simpanan Wajib
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-800">
                  {
                    data.filter(
                      (x) =>
                        x.total_wajib > 0
                    ).length
                  }
                </h2>

              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">

                <Wallet className="h-6 w-6 text-green-700" />

              </div>

            </div>

          </div>

          {/* TOTAL PENDIDIKAN */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-gray-500">
                  Tabungan Pendidikan
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-800">
                  {
                    data.filter(
                      (x) =>
                        x.total_pendidikan > 0
                    ).length
                  }
                </h2>

              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100">

                <GraduationCap className="h-6 w-6 text-purple-700" />

              </div>

            </div>

          </div>

          {/* MENUNGGU VERIFIKASI */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-gray-500">
                  Menunggu Verifikasi
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-800">
                  {
                    data.filter(
                      (x) =>
                        x.pending > 0
                    ).length
                  }
                </h2>

              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">

                <Clock3 className="h-6 w-6 text-orange-700" />

              </div>

            </div>

          </div>

        </div>

        {/* =======================================================
            TABLE
        ======================================================= */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

          <table className="w-full text-sm">

            <thead>
              <tr className="bg-blue-800 text-white">

                <th className="px-6 py-4 text-left">
                  Nasabah
                </th>

                <th className="px-6 py-4 text-left">
                  Simpanan Wajib
                </th>

                <th className="px-6 py-4 text-left">
                  Pendidikan
                </th>

                <th className="px-6 py-4 text-center">
                  Pending
                </th>

                <th className="px-6 py-4 text-center">
                  Status
                </th>

                <th className="px-6 py-4 text-center">
                  Detail
                </th>

              </tr>
            </thead>

            <tbody>

              {data.length > 0 ? (
                data.map(
                  (item: any) => (
                    <tr
                      key={
                        item.id_anggota
                      }
                      className="border-t transition-all hover:bg-gray-50"
                    >

                      {/* NASABAH */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-lg font-bold text-blue-700">

                            {item.nama
                              ?.charAt(0)
                              ?.toUpperCase()}

                          </div>

                          <div>

                            <h3 className="font-semibold text-gray-800">
                              {item.nama}
                            </h3>

                            <p className="text-xs text-gray-500">
                              {item.email}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* WAJIB */}
                      <td className="px-6 py-5 font-semibold text-gray-700">

                        Rp{" "}
                        {item.total_wajib?.toLocaleString(
                          "id-ID"
                        )}

                      </td>

                      {/* PENDIDIKAN */}
                      <td className="px-6 py-5 font-semibold text-gray-700">

                        Rp{" "}
                        {item.total_pendidikan?.toLocaleString(
                          "id-ID"
                        )}

                      </td>

                      {/* PENDING */}
                      <td className="px-6 py-5 text-center">

                        {item.pending > 0 ? (
                          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">

                            <Clock3 className="h-3.5 w-3.5" />

                            {item.pending} pembayaran

                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">

                            <BadgeCheck className="h-3.5 w-3.5" />

                            Tidak ada

                          </div>
                        )}

                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-5 text-center">

                        <div className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Aktif
                        </div>

                      </td>

                      {/* DETAIL */}
                      <td className="px-6 py-5 text-center">

                        <Link
                          href={`/admin/simpanan/${item.id_anggota}`}
                          className="inline-flex items-center gap-2 rounded-2xl bg-blue-700 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-blue-800"
                        >

                          Kelola

                          <ChevronRight className="h-4 w-4" />

                        </Link>

                      </td>

                    </tr>
                  )
                )
              ) : (
                <tr>

                  <td
                    colSpan={6}
                    className="py-20"
                  >

                    <div className="flex flex-col items-center justify-center text-center">

                      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-100">

                        <Wallet className="h-9 w-9 text-gray-400" />

                      </div>

                      <h3 className="text-lg font-bold text-gray-700">
                        Belum ada data simpanan
                      </h3>

                      <p className="mt-1 text-sm text-gray-400">
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
  );
}
