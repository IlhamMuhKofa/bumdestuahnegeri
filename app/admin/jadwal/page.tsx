"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Data = {
  id_peminjaman: number;
  id_anggota: number;
  nama: string;
  jumlah: number;
  tenor: number;
  cicilan_ke: number;
  status: "baru" | "aktif" | "telat";
};

const AdminJadwal = () => {
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const [mainTab, setMainTab] = useState("cicilan");
  const [subTab, setSubTab] = useState("baru");

  useEffect(() => {
    setCurrentPage(
      Math.max(Number(new URLSearchParams(window.location.search).get("page") || 1), 1)
    );
  }, []);

  // =========================
  // 🔥 FETCH API
  // =========================
  useEffect(() => {
    setLoading(true);
    fetch(`/api/jadwal?page=${currentPage}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res.data || []);
        setTotalPages(res.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [currentPage]);

  // =========================
  // 🔥 FILTER
  // =========================
  const filtered = data.filter((item) => item.status === subTab);

  // =========================
  // 🔥 FORMAT RUPIAH
  // =========================
  const formatRupiah = (num: number) => {
    return "Rp " + num.toLocaleString("id-ID");
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Manajemen Jadwal Angsuran
        </h1>
        <p className="text-gray-500 text-sm">
          Monitoring cicilan dan pengelolaan pembayaran nasabah
        </p>
      </div>

      {/* TAB UTAMA */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setMainTab("cicilan")}
          className={`px-4 py-2 rounded-xl text-sm ${
            mainTab === "cicilan"
              ? "bg-green-600 text-white shadow"
              : "bg-white border"
          }`}
        >
          Cicilan
        </button>

        <button
          onClick={() => setMainTab("survey")}
          className={`px-4 py-2 rounded-xl text-sm ${
            mainTab === "survey"
              ? "bg-green-600 text-white shadow"
              : "bg-white border"
          }`}
        >
          Survey
        </button>
      </div>

      {/* CICILAN TAB */}
      {mainTab === "cicilan" && (
        <>
          {/* SUB TAB */}
          <div className="flex gap-3 mb-6">
            {["baru", "aktif", "telat"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSubTab(tab)}
                className={`px-4 py-1.5 rounded-full text-sm capitalize ${
                  subTab === tab
                    ? tab === "telat"
                      ? "bg-red-500 text-white"
                      : tab === "aktif"
                      ? "bg-green-500 text-white"
                      : "bg-blue-500 text-white"
                    : "bg-white border"
                }`}
              >
                {tab === "baru"
                  ? "Pengajuan Baru"
                  : tab === "aktif"
                  ? "Aktif"
                  : "Telat"}
              </button>
            ))}
          </div>

          {/* EMPTY STATE */}
          {filtered.length === 0 && (
            <div className="text-center text-gray-400 mt-10">
              Tidak ada data
            </div>
          )}

          {/* CARD LIST */}
          <div className="space-y-4">
            {filtered.map((item) => {
              const progress =
                (item.cicilan_ke / item.tenor) * 100;

              return (
                <div
                  key={item.id_peminjaman}
                  className="bg-white rounded-2xl p-5 shadow-sm border hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">

                    {/* LEFT */}
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        {item.nama || "-"}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {formatRupiah(item.jumlah)}
                      </p>

                      <p className="text-xs text-gray-400">
                        Tenor {item.tenor} bulan
                      </p>
                    </div>

                    {/* PROGRESS */}
                    <div className="flex-1 md:px-6">
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div
                          className={`h-2 rounded-full ${
                            item.status === "telat"
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <p className="text-xs text-center mt-1 text-gray-500">
                        {item.cicilan_ke} / {item.tenor} cicilan
                      </p>
                    </div>

                    {/* ACTION */}
                    <div className="flex items-center">
                      {item.status === "baru" && (
                        <button
                          onClick={() => router.push(`/admin/cicilan/konten/${item.id_anggota}/${item.id_peminjaman}`)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          Buat Jadwal
                        </button>
                      )}

                      {item.status === "aktif" && (
                        <button
                          onClick={() => router.push(`/admin/cicilan/konten/${item.id_anggota}/${item.id_peminjaman}`)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          Detail
                        </button>
                      )}

                      {item.status === "telat" && (
                        <button
                          onClick={() => router.push(`/admin/cicilan/konten/${item.id_anggota}/${item.id_peminjaman}`)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          Hubungi
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              router.push(`/admin/jadwal?page=${page}`);
            }}
          />
        </>
      )}

      {/* SURVEY TAB */}
      {mainTab === "survey" && (
        <div className="text-gray-400 mt-10">
          Fitur survey akan dikembangkan
        </div>
      )}
    </div>
  );
};

export default AdminJadwal;

function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-3 text-sm sm:flex-row">
      <p className="text-gray-500">
        Halaman {currentPage} dari {totalPages}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-lg border bg-white px-3 py-2 font-semibold text-gray-600 disabled:bg-gray-100 disabled:text-gray-400"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-9 rounded-lg px-3 py-2 font-semibold ${
                page === currentPage
                  ? "bg-blue-700 text-white"
                  : "border bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          )
        )}
        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-lg border bg-white px-3 py-2 font-semibold text-gray-600 disabled:bg-gray-100 disabled:text-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
}
