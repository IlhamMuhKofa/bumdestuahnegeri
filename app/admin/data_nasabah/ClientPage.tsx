"use client";

import { useState } from "react";

export default function ClientPage({ nasabah }: any) {
  const [tab, setTab] = useState("semua");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("terbaru");

  // ✅ PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // 🔥 STATUS LOGIC
  const getStatus = (user: any) => {
    if (user.status === "disabled") return "nonaktif";

    const hasApproved = user.peminjaman?.some(
      (p: any) => p.status === "APPROVED"
    );

    if (hasApproved) return "aktif";

    return "new";
  };

  // 🔥 FILTER TAB
  const filteredNasabah = nasabah.filter((item: any) => {
    const status = getStatus(item);

    if (tab === "aktif") return status === "aktif";
    if (tab === "calon") return status === "new";
    if (tab === "nonaktif") return status === "nonaktif";

    return true;
  });

  // 🔥 SEARCH
  const searchedNasabah = filteredNasabah.filter((item: any) =>
    item.nama?.toLowerCase().includes(search.toLowerCase())
  );

  // 🔥 SORT
  const sortedNasabah = [...searchedNasabah].sort((a: any, b: any) => {
    if (sort === "az") return (a.nama || "").localeCompare(b.nama || "");
    if (sort === "za") return (b.nama || "").localeCompare(a.nama || "");
    if (sort === "terlama")
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // ✅ PAGINATION LOGIC
  const totalData = sortedNasabah.length;
  const totalPages = Math.ceil(totalData / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedNasabah.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalNasabah = nasabah.length;
const totalAktif = nasabah.filter(
  (n: any) => getStatus(n) === "aktif"
).length;

const totalPendaftar = nasabah.filter(
  (n: any) => getStatus(n) === "new"
).length;

const totalNonaktif = nasabah.filter(
  (n: any) => getStatus(n) === "nonaktif"
).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Data Nasabah
          </h1>
          <button className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#244d3c]">
            + Tambah Nasabah
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-4">
          {[
            { label: "Semua", value: "semua" },
            { label: "Aktif", value: "aktif" },
            { label: "Pendaftar", value: "calon" },
            { label: "Non Aktif", value: "nonaktif" },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => {
                setTab(t.value);
                setCurrentPage(1); // reset page
              }}
              className={`px-4 py-2 rounded-lg text-sm ${
                tab === t.value
                  ? "bg-blue-700 text-white"
                  : "bg-white border text-gray-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* SEARCH + SORT */}
        <div className="flex justify-between items-center mb-6 gap-3">
          <input
            type="text"
            placeholder="Cari nama nasabah..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // reset page
            }}
            className="w-full max-full px-4 py-2 border rounded-lg"
          />

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setCurrentPage(1); // reset page
            }}
            className="px-4 py-2 border rounded-lg text-sm"
          >
            <option value="terbaru">📅 Terbaru</option>
            <option value="terlama">📅 Terlama</option>
            <option value="az">🔤 Nama A - Z</option>
            <option value="za">🔤 Nama Z - A</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Nama</th>
                {/* <th className="px-4 py-3 text-left">Jenis Kelamin</th> */}
                <th className="px-4 py-3 text-left">No HP</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Alamat</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                currentData.map((user: any) => {
                  const status = getStatus(user);

                  return (
                    <tr key={user.id} className="border-t">
                      <td className="px-4 py-3">{user.nama}</td>
                      {/* <td className="px-4 py-3">
                        {user.jenis_kelamin || "-"}
                      </td> */}
                      <td className="px-4 py-3">{user.no_hp || "-"}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{user.alamat || "-"}</td>

                      <td className="px-4 py-3">
                        {status === "aktif" && (
                          <span className="px-4 py-1 text-xs rounded-xl bg-green-100 text-green-700">
                            Aktif
                          </span>
                        )}
                        {status === "nonaktif" && (
                          <span className="px-2 py-1 text-xs rounded-xl bg-red-100 text-red-700">
                            Non Aktif
                          </span>
                        )}
                        {status === "new" && (
                          <span className="px-4 py-1 text-xs rounded-xl bg-yellow-100 text-yellow-700">
                            New
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-center">
<a
  href={`/admin/data_nasabah/${user.id}`}
  className="
    inline-flex
    items-center
    justify-center
    px-3
    py-2
    rounded-lg
    bg-blue-50
    text-blue-700
    hover:bg-blue-100
    font-medium
    transition
  "
>
  Detail
</a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ PAGINATION UI */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500 px-1">

          {/* INFO */}
          <span>
            Menampilkan {totalData === 0 ? 0 : startIndex + 1} -{" "}
            {Math.min(startIndex + itemsPerPage, totalData)} dari {totalData} data
          </span>

          {/* BUTTON */}
          <div className="flex gap-2">

            {/* PREV */}
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded-lg border text-xs ${
                currentPage === 1
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              ‹ Sebelumnya
            </button>

            {/* PAGE */}
            <span className="px-3 py-1.5 text-xs font-medium">
              Halaman {currentPage} / {totalPages || 1}
            </span>

            {/* NEXT */}
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-1.5 rounded-lg border text-xs ${
                currentPage === totalPages || totalPages === 0
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