"use client";

import { useState, useRef, useEffect, } from "react";

import {
  Plus,
  ChevronDown,
  Wallet,
  BadgeDollarSign,
  GraduationCap,
  ChevronRight,
  ChevronDownIcon,
  Target,
} from "lucide-react";

import Image from "next/image";
import { AnimatePresence, motion, } from "framer-motion";
import FormTambah from "./form_tambah/page";
import ModalBayar from "./pembayaran/wajib/ModalBayar";
import ModalTambah from "./form_tambah/page"



import { useRouter, useSearchParams } from "next/navigation";

// ─────────────────────────────────────────────
type JenisSimpanan =
  | "Wajib"
  | "Pendidikan";

type Props = {
  dataWajib: any[];
  dataPendidikan: any[];
  idAnggota: number;
};

type Tagihan = {
  id: number;
  bulan_ke: number;
  nominal: number;
  status: string;
};
// ─────────────────────────────────────────────

const statusClass = (status: string) =>
  status === "BERHASIL"
    ? "bg-green-100 text-green-700"
    : status === "MENUNGGU"
    ? "bg-yellow-100 text-yellow-700"
    : "bg-red-100 text-red-700";

export default function Pengajuan({
  dataWajib = [],
  dataPendidikan = [],
  idAnggota,
}: Props) {
  const [filterOpen, setFilterOpen] =
    useState(false);

  const searchParams =
    useSearchParams();

  const [selectedFilter, setSelectedFilter] =
    useState<JenisSimpanan>("Wajib");

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 6;

  useEffect(() => {
    const tab =
      searchParams.get("tab");

    setSelectedFilter(
      tab === "pendidikan"
        ? "Pendidikan"
        : "Wajib"
    );
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter]);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  const [openForm, setOpenForm] =
    useState(false);

  const [openModalBayar, setOpenModalBayar] =
    useState(false);

  const [openModalTambah, setOpenModalTambah] =
    useState(false);

  const [openTabungan, setOpenTabungan] =
    useState<number[]>([]);

  const router = useRouter();

  useEffect(() => {
    function handleOutside(
      e: MouseEvent
    ) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          e.target as Node
        )
      ) {
        setFilterOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutside
      );
  }, []);

  const formatTanggal = (
    date: string
  ) => {
    return new Date(date).toLocaleString(
      "id-ID",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  const filteredData =
    selectedFilter ===
      "Wajib"
      ? dataWajib
      : dataPendidikan;

  const semuaTagihan =
    filteredData.flatMap(
      (simpanan: any) =>
        simpanan.pembayaran
    );

  const paginationData =
    selectedFilter === "Wajib"
      ? semuaTagihan
      : filteredData;

  const totalData =
    paginationData.length;

  const totalPages =
    Math.ceil(
      totalData / itemsPerPage
    );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const paginatedData =
    paginationData.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  const toggleTabungan = (
    id: number
  ) => {
    setOpenTabungan((prev) =>
      prev.includes(id)
        ? prev.filter(
          (x) => x !== id
        )
        : [...prev, id]
    );
  };

  const tagihanModal =
    semuaTagihan
      .filter(
        (item: any) =>
          item.status !== "BERHASIL"
      )
      .map((item: any) => ({
        id: item.id,
        bulan_ke: item.bulan_ke,
        nominal: item.nominal,
        status: item.status,
      }));

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-5 sm:p-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">

        {/* TITLE */}
        <div className="mb-6">
          <div className="flex items-center gap-3">

            <div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-800">
                Simpanan
              </h1>

              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                Pantau perkembangan simpanan dan tabungan Anda dengan lebih mudah melalui layanan digital BUMDes
              </p>

            </div>

          </div>
        </div>

        {/* BANNER */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-[32px] bg-[#1a3c2e] shadow-xl">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.10),_transparent_35%)]" />

          <div className="absolute -top-20 -right-16 h-64 w-64 rounded-full bg-white/[0.04]" />

          <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-white/[0.03]" />

          <div className="relative
z-10
flex
flex-col
lg:flex-row
justify-between
min-h-[200px] sm:min-h-[220px]">

            {/* LEFT */}
            <div className="flex flex-1 flex-col justify-center px-5 py-6 sm:px-8 sm:py-10">

              <p className="mb-2 sm:mb-3 text-[10px] sm:text-xs font-semibold uppercase tracking-[2px] sm:tracking-[3px] text-green-300">
                BUMDes · Layanan Simpanan
              </p>

              <h2 className="max-w-lg text-2xl sm:text-3xl font-bold leading-tight text-white">
                Kelola{" "}
                <span className="text-yellow-400">
                  Simpanan Anda
                </span>{" "}
                dengan lebih nyaman
              </h2>

              <p className="mt-3 sm:mt-4 max-w-xl text-sm leading-relaxed text-gray-300">
                Mulai rencanakan masa depan finansial Anda bersama BUMDes.
              </p>

            </div>

            {/* RIGHT */}
            <div className="relative hidden w-[320px] shrink-0 sm:block">

              <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#1a3c2e] to-transparent" />

              <Image
                src="/img/hijab3.png"
                alt="banner"
                fill
                priority
                className="translate-y-2 scale-[1.12] object-contain object-bottom"
              />

            </div>

          </div>
        </div>

        {/* TOOLBAR */}
        <div className="mb-4
flex
flex-col
items-start
gap-4
lg:flex-row
lg:items-center
lg:justify-between">

          <p className="text-sm w-full text-gray-500">
            Kelola simpanan wajib dan tabungan pendidikan Anda melalui halaman ini.
          </p>

          <div className="flex
w-full
flex-col
gap-3
sm:flex-row
sm:justify-end">

            {/* FILTER */}
            <div
              className="relative"
              ref={dropdownRef}
            >

              <button
                onClick={() =>
                  setFilterOpen(
                    (v) => !v
                  )
                }
                className="flex
w-full
sm:w-auto
justify-center
items-center
gap-2
rounded-xl
border
border-gray-200
bg-white
px-4
py-2
text-sm
shadow-sm"
              >
                {selectedFilter}

                <ChevronDown className="h-4 w-4" />
              </button>

              {filterOpen && (
                <div className="absolute right-0 z-20 mt-2 w-48 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">

                  <p className="mb-3 text-xs font-semibold uppercase text-gray-400">
                    Jenis Simpanan
                  </p>

                  <div className="space-y-2">

                    {(
                      [
                        "Wajib",
                        "Pendidikan",
                      ] as JenisSimpanan[]
                    ).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {

                          setSelectedFilter(opt);

                          router.replace(
                            `/nasabah/simpanan?tab=${opt.toLowerCase()}`
                          );

                          setFilterOpen(false);

                        }}
                        className={`w-full rounded-xl px-3 py-2 text-left text-sm transition-all ${selectedFilter ===
                          opt
                          ? "bg-[#1a3c2e] text-white"
                          : "hover:bg-gray-100"
                          }`}
                      >
                        {opt}
                      </button>
                    ))}

                  </div>

                </div>
              )}
            </div>

            {/* BUTTON */}
            {selectedFilter === "Wajib" &&
              tagihanModal.length > 0 && (
                <button
                  onClick={() =>
                    setOpenModalBayar(true)
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#1a3c2e] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#244d3c]"
                >
                  <Wallet className="h-4 w-4" />
                  Bayar Simpanan
                </button>
              )}

            {/* TAB PENDIDIKAN */}
            {selectedFilter === "Pendidikan" && (
              <button
                onClick={() => setOpenForm(true)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#1a3c2e] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#244d3c]"
              >
                <Plus className="h-4 w-4" />
                Buat Tabungan
              </button>
            )}

          </div>
        </div>

        {/* ================================================= */}
        {/* WAJIB */}
        {/* ================================================= */}
        {selectedFilter ===
          "Wajib" ? (
          <>
            {/* TABLE - DESKTOP */}
            <div className="hidden md:block overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

              <div className="overflow-x-auto">
                <table className="min-w-[700px] w-full text-sm">

                  <thead>
                    <tr className="bg-[#1a3c2e] text-white">

                      <th className="p-4">
                        Tanggal
                      </th>

                      <th>Nominal</th>

                      <th>Status</th>

                      <th>Aksi</th>

                    </tr>
                  </thead>

                  <tbody>

                    {paginatedData.map(
                      (item: any) => (
                        <tr
                          key={
                            item.id
                          }
                          className="border-t text-center hover:bg-gray-50"
                        >

                          <td className="p-4">
                            {formatTanggal(
                              item.tanggal
                            )}
                          </td>


                          <td className="font-bold text-[#1a3c2e]">
                            Rp{" "}
                            {item.nominal?.toLocaleString(
                              "id-ID"
                            )}
                          </td>

                          <td>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(item.status)}`}
                            >
                              {item.status}
                            </span>
                          </td>

                          <td className="text-center">
                            {item.status === "BERHASIL" ? (
  <button
    onClick={() =>
      router.push(
        `/nasabah/simpanan/pembayaran/wajib/detail/${item.id}`
      )
    }
    className="rounded-xl border border-green-200 px-4 py-2 text-xs font-medium text-green-700 hover:bg-green-50"
  >
    Detail
  </button>
                            ) : (
                              <span className="text-gray-400">
                                -
                              </span>
                            )}
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>
              </div>

            </div>

            {/* LIST - MOBILE (pengganti tabel) */}
            <div className="md:hidden space-y-3">
              {paginatedData.map((item: any) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-xs text-gray-500">
                      {formatTanggal(item.tanggal)}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium shrink-0 ${statusClass(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-gray-500">
                      Nominal
                    </span>
                    <span className="font-bold text-[#1a3c2e] text-sm">
                      Rp {item.nominal?.toLocaleString("id-ID")}
                    </span>
                  </div>

                  {item.status === "BERHASIL" && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={() =>
                          router.push(
                            `/nasabah/simpanan/pembayaran/wajib/detail/${item.id}`
                          )
                        }
                        className="w-full rounded-xl border border-green-200 px-4 py-2 text-xs font-medium text-green-700 hover:bg-green-50"
                      >
                        Lihat Detail
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          /* ================================================= */
          /* PENDIDIKAN */
          /* ================================================= */
          <div className="space-y-5">

            {paginatedData.map(
              (tabungan: any) => {

                const progress =
                  tabungan.target_dana > 0
                    ? Math.min(
                      100,
                      Math.round(
                        (tabungan.total_terkumpul /
                          tabungan.target_dana) *
                        100
                      )
                    )
                    : 0;

                const isOpen =
                  openTabungan.includes(
                    tabungan.id_simpanan
                  );

                return (
                  <div
                    key={
                      tabungan.id_simpanan
                    }
                    className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
                  >

                    {/* HEADER */}
                    <div
                      onClick={() =>
                        toggleTabungan(
                          tabungan.id_simpanan
                        )
                      }
                      className="flex
flex-col
gap-5
sm:flex-row
sm:items-center
sm:justify-between
bg-white
p-4
sm:p-6
transition-all
hover:bg-gray-50
cursor-pointer"
                    >

                      <div className="flex flex-1 items-start gap-3 sm:gap-4">

                        {/* ICON */}
                        <div className="flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
                          <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 text-blue-700" />
                        </div>

                        {/* CONTENT */}
                        <div className="flex-1 min-w-0">

                          <div className="flex items-start justify-between gap-2">

                            <div className="min-w-0">

                              <h3 className="text-base sm:text-lg font-bold uppercase text-gray-800 break-words">
                                {tabungan.tujuan}
                              </h3>

                              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                                Dibuat :
                                {" "}
                                {formatTanggal(
                                  tabungan.created_at
                                )}
                              </p>

                            </div>

                          </div>

                        </div>

                      </div>

                      <div className="ml-4 shrink-0">
                        {isOpen ? (
                          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-500" />
                        )}
                      </div>

                    </div>

                    {/* PEMBAYARAN */}
                    {isOpen && (
                      <div className="border-t border-gray-100">

                        {/* TABLE - DESKTOP */}
                        <div className="hidden md:block overflow-x-auto">
                          <table className="min-w-[700px] w-full text-sm">

                            <thead>
                              <tr className="bg-[#1a3c2e] text-white">

                                <th className="p-4">
                                  Tanggal</th>

                                <th>Nominal</th>

                                <th>Status</th>

                                <th>Aksi</th>

                              </tr>
                            </thead>

                            <tbody>
                              {tabungan.pembayaran.length === 0 ? (
                                <tr>

                                  <td
                                    colSpan={4}
                                    className="py-8 text-center text-gray-500"
                                  >
                                    Belum ada riwayat pembayaran
                                  </td>

                                </tr>
                              ) : (
                                tabungan.pembayaran.map(
                                  (bayar: any) => (
                                    <tr
                                      key={bayar.id}
                                      className="border-t text-center hover:bg-gray-50"
                                    >

                                      <td className="p-4">
                                        {formatTanggal(
                                          bayar.tanggal
                                        )}
                                      </td>

                                      <td className="font-bold text-[#1a3c2e]">
                                        Rp{" "}
                                        {Number(
                                          bayar.nominal
                                        ).toLocaleString(
                                          "id-ID"
                                        )}
                                      </td>

                                      <td>
                                        <span
                                          className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(bayar.status)}`}
                                        >
                                          {bayar.status}
                                        </span>
                                      </td>

                                      <td>
                                        <button
                                          onClick={() =>
                                            router.push(
                                              `/nasabah/simpanan/pembayaran/pendidikan/detail/${bayar.id}`
                                            )
                                          }
                                          className="rounded-xl border border-gray-200 px-3 py-1 text-xs"
                                        >
                                          Detail
                                        </button>
                                      </td>

                                    </tr>
                                  )
                                )
                              )}
                            </tbody>

                          </table>
                        </div>

                        {/* LIST - MOBILE (pengganti tabel) */}
                        <div className="md:hidden p-4 space-y-3">
                          {tabungan.pembayaran.length === 0 ? (
                            <p className="py-6 text-center text-sm text-gray-500">
                              Belum ada riwayat pembayaran
                            </p>
                          ) : (
                            tabungan.pembayaran.map((bayar: any) => (
                              <div
                                key={bayar.id}
                                className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                              >
                                <div className="flex items-start justify-between gap-2 mb-3">
                                  <span className="text-xs text-gray-500">
                                    {formatTanggal(bayar.tanggal)}
                                  </span>

                                  <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-medium shrink-0 ${statusClass(bayar.status)}`}
                                  >
                                    {bayar.status}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between gap-2 mb-3">
                                  <span className="text-sm text-gray-500">
                                    Nominal
                                  </span>
                                  <span className="font-bold text-[#1a3c2e] text-sm">
                                    Rp {Number(bayar.nominal).toLocaleString("id-ID")}
                                  </span>
                                </div>

                                <button
                                  onClick={() =>
                                    router.push(
                                      `/nasabah/simpanan/pembayaran/pendidikan/detail/${bayar.id}`
                                    )
                                  }
                                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium"
                                >
                                  Lihat Detail
                                </button>
                              </div>
                            ))
                          )}
                        </div>

                      </div>
                    )}

                  </div>
                );
              }
            )}

          </div>
        )}

        {/* PAGINATION */}
        {totalData > 0 && (
          <div className="flex
flex-col
gap-4
sm:flex-row
sm:items-center
sm:justify-between mt-4 text-sm text-gray-500 px-1">

            <span className="text-sm text-gray-500">
              Menampilkan{" "}
              {startIndex + 1}
              {" - "}
              {Math.min(
                startIndex + itemsPerPage,
                totalData
              )}
              {" dari "}
              {totalData} data
            </span>

            <div className="flex items-center gap-2">

              <button
                onClick={() =>
                  setCurrentPage(
                    (prev) => prev - 1
                  )
                }
                disabled={currentPage === 1}
                className={`rounded-xl border px-3 py-2 text-xs font-medium ${currentPage === 1
                  ? "cursor-not-allowed border-gray-200 text-gray-300"
                  : "border-gray-300 hover:bg-gray-50"
                  }`}
              >
                ‹ Sebelumnya
              </button>

              <span className="px-2 text-sm font-medium text-gray-600">
                {currentPage} / {totalPages || 1}
              </span>

              <button
                onClick={() =>
                  setCurrentPage(
                    (prev) => prev + 1
                  )
                }
                disabled={
                  currentPage === totalPages ||
                  totalPages === 0
                }
                className={`rounded-xl border px-3 py-2 text-xs font-medium ${currentPage === totalPages ||
                  totalPages === 0
                  ? "cursor-not-allowed border-gray-200 text-gray-300"
                  : "border-gray-300 hover:bg-gray-50"
                  }`}
              >
                Berikutnya ›
              </button>

            </div>

          </div>
        )}

        {/* EMPTY */}
        {filteredData.length ===
          0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">

              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                <Wallet className="h-8 w-8 text-gray-400" />
              </div>

              <p className="mb-1 font-semibold text-gray-700">
                Belum ada data
              </p>

              <p className="text-sm text-gray-400">
                Data simpanan akan muncul di sini.
              </p>

            </div>
          )}

      </div>

      {/* MODAL */}
      <AnimatePresence>
        {openForm && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto px-4 py-8"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >

            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() =>
                setOpenForm(false)
              }
            />

            <motion.div
              className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[32px] bg-white shadow-[0_20px_80px_rgba(0,0,0,0.25)]"
            >

              <button
                onClick={() =>
                  setOpenForm(false)
                }
                className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/90 text-gray-600 shadow-md"
              >
                ✕
              </button>

              <div className="max-h-[90vh] overflow-y-auto">

                <FormTambah
                  onClose={() =>
                    setOpenForm(false)
                  }
                  idAnggota={
                    idAnggota
                  }
                />

              </div>

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>


      <ModalBayar
        open={openModalBayar}
        onClose={() =>
          setOpenModalBayar(false)
        }
        tagihan={tagihanModal}
      />

      {openModalTambah && (
        <ModalTambah
          onClose={() => setOpenModalTambah(false)}
          idAnggota={idAnggota}
        />
      )}

    </div>
  );
}