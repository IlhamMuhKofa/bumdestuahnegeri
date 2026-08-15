"use client";

import {
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";

import {
  Search,
  Calendar,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileX,
  Eye,
  Download,
} from "lucide-react";

type FilterOption =
  | "Cicilan"
  | "Setoran";

const FILTER_OPTIONS: FilterOption[] = [
  "Cicilan",
  "Setoran",
];

type Props = {
  data?: any[];
};

const ITEMS_PER_PAGE = 10;

export default function Riwayat({
  data = [],
}: Props) {

  const [
    searchJenis,
    setSearchJenis,
  ] = useState("");

  const [
    searchTanggal,
    setSearchTanggal,
  ] = useState("");

  const [
    filterOpen,
    setFilterOpen,
  ] = useState(false);

  const [
    selectedFilters,
    setSelectedFilters,
  ] = useState<
    FilterOption[]
  >([]);

  const [preview, setPreview] =
    useState<string | null>(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const dropdownRef =
    useRef<HTMLDivElement>(
      null
    );

  // CLOSE DROPDOWN
  useEffect(() => {

    function handleClickOutside(
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
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

  }, []);

  const toggleFilter = (
    option: FilterOption
  ) => {

    setSelectedFilters(
      (prev) =>
        prev.includes(option)
          ? prev.filter(
              (f) =>
                f !== option
            )
          : [
              ...prev,
              option,
            ]
    );
  };

  // FILTER DATA
  const filteredData =
    useMemo(() => {

      return data.filter(
        (item) => {

          const jenis =
            item.jenis_transaksi?.toLowerCase() ||
            "";

          const tanggal =
            new Date(
              item.tanggal
            ).toLocaleDateString(
              "id-ID"
            );

          const matchJenis =
            jenis.includes(
              searchJenis.toLowerCase()
            );

          const matchTanggal =
            tanggal.includes(
              searchTanggal
            );

          let matchFilter =
            true;

          if (
            selectedFilters.length >
            0
          ) {

            matchFilter =
              selectedFilters.some(
                (
                  filter
                ) => {

                  if (
                    filter ===
                    "Cicilan"
                  ) {
                    return jenis.includes("pinjaman");
                  }

                  if (
                    filter ===
                    "Setoran"
                  ) {
                    return jenis.includes("simpanan");
                  }

                  return false;
                }
              );
          }

          return (
            matchJenis &&
            matchTanggal &&
            matchFilter
          );
        }
      );

    }, [
      data,
      searchJenis,
      searchTanggal,
      selectedFilters,
    ]);

  // RESET KE HALAMAN 1 KETIKA FILTER / SEARCH BERUBAH
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchJenis,
    searchTanggal,
    selectedFilters,
  ]);

  // PAGINATION
  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredData.length /
        ITEMS_PER_PAGE
    )
  );

  const paginatedData =
    useMemo(() => {

      const startIndex =
        (currentPage - 1) *
        ITEMS_PER_PAGE;

      return filteredData.slice(
        startIndex,
        startIndex +
          ITEMS_PER_PAGE
      );

    }, [
      filteredData,
      currentPage,
    ]);

  // PENGAMAN JIKA DATA BERUBAH DAN CURRENT PAGE MELEBIHI TOTAL PAGE
  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(
        totalPages
      );
    }
  }, [
    currentPage,
    totalPages,
  ]);

  const startItem =
    filteredData.length === 0
      ? 0
      : (currentPage - 1) *
          ITEMS_PER_PAGE +
        1;

  const endItem =
    Math.min(
      currentPage *
        ITEMS_PER_PAGE,
      filteredData.length
    );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-5 font-sans sm:p-6">

      <div className="mx-auto w-full max-w-6xl space-y-6">

        {/* TITLE */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-800 sm:text-[30px]">
            Riwayat Transaksi
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Lihat seluruh aktivitas pembayaran, cicilan, dan setoran Anda.
          </p>
        </div>

        {/* SEARCH */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

          {/* SEARCH JENIS */}
          <div className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 shadow-sm lg:flex-1">

            <Search className="h-4 w-4 shrink-0 text-gray-400" />

            <input
              type="text"
              placeholder="Cari jenis transaksi..."
              value={
                searchJenis
              }
              onChange={(
                e
              ) =>
                setSearchJenis(
                  e.target.value
                )
              }
              className="w-full bg-transparent text-sm text-gray-500 outline-none placeholder:text-gray-400"
            />

          </div>

          {/* SEARCH TANGGAL */}
          <div className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 shadow-sm lg:flex-1">

            <Calendar className="h-4 w-4 shrink-0 text-gray-400" />

            <input
              type="text"
              placeholder="Cari tanggal..."
              value={
                searchTanggal
              }
              onChange={(
                e
              ) =>
                setSearchTanggal(
                  e.target.value
                )
              }
              className="w-full bg-transparent text-sm text-gray-500 outline-none placeholder:text-gray-400"
            />

          </div>

          {/* FILTER */}
          <div
            className="relative"
            ref={dropdownRef}
          >

            <button
              onClick={() =>
                setFilterOpen(
                  (
                    prev
                  ) =>
                    !prev
                )
              }
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#1a3c2e] px-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#142f24] active:scale-[0.98] sm:w-auto"
            >

              <SlidersHorizontal className="h-4 w-4" />

              Filter Data

              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  filterOpen
                    ? "rotate-180"
                    : ""
                }`}
              />

            </button>

            {/* DROPDOWN */}
            {filterOpen && (

              <div className="absolute right-0 z-20 mt-2 w-full rounded-xl border border-gray-200 bg-white p-4 shadow-lg sm:w-56">

                <p className="mb-3 text-sm font-semibold text-gray-700">
                  Filter
                </p>

                <div className="flex flex-col gap-2.5">

                  {FILTER_OPTIONS.map(
                    (
                      option
                    ) => (

                      <label
                        key={
                          option
                        }
                        className="flex cursor-pointer items-center gap-2.5"
                      >

                        <input
                          type="checkbox"
                          checked={selectedFilters.includes(
                            option
                          )}
                          onChange={() =>
                            toggleFilter(
                              option
                            )
                          }
                        />

                        <span className="text-sm text-gray-600">
                          {
                            option
                          }
                        </span>

                      </label>
                    )
                  )}

                </div>

              </div>
            )}

          </div>

        </div>

        {/* TABLE - DESKTOP */}
        <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[950px] text-sm">

              <thead>

                <tr className="bg-[#1a3c2e]">

                  {[
                    "Tanggal",
                    "Jenis Transaksi",
                    "Nominal",
                    "Status",
                    "Keterangan",
                    "Detail",
                  ].map(
                    (
                      col
                    ) => (

                      <th
                        key={
                          col
                        }
                        className="px-4 py-3.5 text-center text-sm font-semibold text-white/90"
                      >
                        {
                          col
                        }
                      </th>
                    )
                  )}

                </tr>

              </thead>

              <tbody>

                {paginatedData.length ===
                0 ? (

                  <tr>

                    <td
                      colSpan={6}
                    >

                      <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">

                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">

                          <FileX className="h-8 w-8 text-green-400" />

                        </div>

                        <div>

                          <p className="mb-1 text-base font-semibold text-gray-700">
                            Belum Ada
                            Riwayat
                            Transaksi
                          </p>

                          <p className="mx-auto max-w-xs text-sm leading-relaxed text-gray-400">
                            Transaksi
                            Anda akan
                            muncul di
                            sini
                          </p>

                        </div>

                      </div>

                    </td>

                  </tr>

                ) : (

                  paginatedData.map(
                    (
                      item
                    ) => (

                      <tr
                        key={
                          item.id_riwayat
                        }
                        className="border-t border-gray-100 transition-colors hover:bg-gray-50/70"
                      >

                        {/* TANGGAL */}
                        <td className="whitespace-nowrap px-4 py-4 text-center text-sm text-gray-700">

                          {new Date(
                            item.tanggal
                          ).toLocaleDateString(
                            "id-ID",
                            {
                              day:
                                "numeric",
                              month:
                                "long",
                              year:
                                "numeric",
                            }
                          )}

                        </td>

                        {/* JENIS */}
                        <td className="px-4 py-4 text-center text-sm font-medium text-gray-800">

                          {
                            item.jenis_transaksi
                          }

                        </td>

                        {/* NOMINAL */}
                        <td className="whitespace-nowrap px-4 py-4 text-center text-sm font-semibold text-gray-800">

                          Rp{" "}
                          {item.nominal.toLocaleString(
                            "id-ID"
                          )}

                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-4 text-center">

                          <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                            BERHASIL
                          </span>

                        </td>

                        {/* KETERANGAN */}
                        <td className="px-4 py-4 text-center text-sm text-gray-600">

                          {
                            item.keterangan
                          }

                        </td>

                        {/* DETAIL */}
                        <td className="px-4 py-4 text-center">

                          {item.bukti_bayar ? (

                            <div className="flex justify-center gap-2">

                              <button
                                onClick={() =>
                                  setPreview(
                                    item.bukti_bayar
                                  )
                                }
                                className="inline-flex h-9 items-center gap-1 rounded-lg bg-blue-50 px-3 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
                              >

                                <Eye className="h-4 w-4" />

                                Lihat

                              </button>

                              <a
                                href={
                                  item.bukti_bayar
                                }
                                download
                                className="inline-flex h-9 items-center gap-1 rounded-lg bg-gray-100 px-3 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200"
                              >

                                <Download className="h-4 w-4" />

                                Download

                              </a>

                            </div>

                          ) : (
                            "-"
                          )}

                        </td>

                      </tr>
                    )
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* LIST - MOBILE */}
        <div className="space-y-3 md:hidden">

          {paginatedData.length ===
          0 ? (

            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">

                <FileX className="h-8 w-8 text-green-400" />

              </div>

              <div>

                <p className="mb-1 text-base font-semibold text-gray-700">
                  Belum Ada Riwayat Transaksi
                </p>

                <p className="mx-auto max-w-xs text-sm leading-relaxed text-gray-400">
                  Transaksi Anda akan muncul di sini
                </p>

              </div>

            </div>

          ) : (

            paginatedData.map(
              (
                item
              ) => (

                <div
                  key={
                    item.id_riwayat
                  }
                  className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >

                  {/* TOP */}
                  <div className="mb-3 flex items-start justify-between gap-2">

                    <span className="text-xs text-gray-500">

                      {new Date(
                        item.tanggal
                      ).toLocaleDateString(
                        "id-ID",
                        {
                          day:
                            "numeric",
                          month:
                            "long",
                          year:
                            "numeric",
                        }
                      )}

                    </span>

                    <span className="inline-flex shrink-0 items-center rounded-full border border-green-200 bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                      BERHASIL
                    </span>

                  </div>

                  {/* JENIS + NOMINAL */}
                  <div className="mb-1 flex items-center justify-between gap-2">

                    <span className="text-sm font-semibold text-gray-800">
                      {
                        item.jenis_transaksi
                      }
                    </span>

                    <span className="shrink-0 text-sm font-semibold text-emerald-700">
                      Rp{" "}
                      {item.nominal.toLocaleString(
                        "id-ID"
                      )}
                    </span>

                  </div>

                  {/* KETERANGAN */}
                  {item.keterangan && (

                    <p className="mb-3 mt-1 text-xs text-gray-500">
                      {
                        item.keterangan
                      }
                    </p>

                  )}

                  {/* DETAIL / BUKTI */}
                  {item.bukti_bayar && (

                    <div className="flex gap-2 border-t border-gray-100 pt-3">

                      <button
                        onClick={() =>
                          setPreview(
                            item.bukti_bayar
                          )
                        }
                        className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-lg bg-blue-50 px-3 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
                      >

                        <Eye className="h-4 w-4" />

                        Lihat

                      </button>

                      <a
                        href={
                          item.bukti_bayar
                        }
                        download
                        className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-lg bg-gray-100 px-3 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200"
                      >

                        <Download className="h-4 w-4" />

                        Download

                      </a>

                    </div>

                  )}

                </div>
              )
            )
          )}

        </div>

        {/* PAGINATION */}
        <div className="flex flex-col gap-3 px-1 pt-1 text-sm sm:flex-row sm:items-center sm:justify-between">

          <span className="text-sm text-gray-500">
            Menampilkan{" "}
            <span className="font-medium text-gray-700">
              {startItem} - {endItem}
            </span>{" "}
            dari{" "}
            <span className="font-medium text-gray-700">
              {filteredData.length}
            </span>{" "}
            transaksi
          </span>

          {filteredData.length >
            0 && (
            <div className="flex items-center justify-end gap-2">

              <button
                type="button"
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      Math.max(
                        page - 1,
                        1
                      )
                  )
                }
                disabled={
                  currentPage === 1
                }
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >

                <ChevronLeft className="h-4 w-4" />

                Sebelumnya

              </button>

              <span className="px-1 text-sm font-medium text-gray-700">
                Halaman {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      Math.min(
                        page + 1,
                        totalPages
                      )
                  )
                }
                disabled={
                  currentPage ===
                  totalPages
                }
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >

                Berikutnya

                <ChevronRight className="h-4 w-4" />

              </button>

            </div>
          )}

        </div>

      </div>

      {/* PREVIEW */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() =>
            setPreview(null)
          }
        >

          <img
            src={preview}
            alt="Preview bukti pembayaran"
            className="max-h-[85vh] max-w-4xl rounded-xl object-contain"
          />

        </div>
      )}

    </div>
  );
}