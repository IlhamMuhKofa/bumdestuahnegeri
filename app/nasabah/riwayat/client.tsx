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

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-5 sm:p-6 font-sans">

      <div className="mx-auto w-full max-w-6xl space-y-6">

        {/* TITLE */}
<div>
    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-800">
        Riwayat Transaksi
    </h1>

    <p className="mt-2 text-sm text-gray-500 leading-relaxed">
        Lihat seluruh aktivitas pembayaran, cicilan, dan setoran Anda.
    </p>
</div>

        {/* SEARCH */}
        <div className="flex
flex-col
gap-3
lg:flex-row
lg:items-center3">

          {/* SEARCH JENIS */}
          <div className="flex items-center w-full lg:flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2.5 shadow-sm gap-2">

            <Search className="w-4 h-4 text-gray-400 shrink-0" />

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
              className="text-sm text-gray-500 bg-transparent outline-none w-full placeholder:text-gray-400"
            />

          </div>

          {/* SEARCH TANGGAL */}
          <div className="flex items-center w-full lg:flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2.5 shadow-sm gap-2">

            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />

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
              className="text-sm text-gray-500 bg-transparent outline-none w-full placeholder:text-gray-400"
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
              className="flex items-center w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-sm transition-all duration-150"
            >

              <SlidersHorizontal className="w-4 h-4" />

              Filter Data

              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  filterOpen
                    ? "rotate-180"
                    : ""
                }`}
              />

            </button>

            {/* DROPDOWN */}
            {filterOpen && (

              <div className="absolute right-0 mt-2 w-full sm:w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-4">

                <p className="text-sm font-semibold text-gray-700 mb-3">
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
                        className="flex items-center gap-2.5 cursor-pointer"
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

        {/* TABLE */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

          <div className="overflow-x-auto">
            <table className="min-w-[950px] w-full text-sm">

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
                      className="text-white font-semibold text-center px-4 py-4"
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

              {filteredData.length ===
              0 ? (

                <tr>

                  <td
                    colSpan={6}
                  >

                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center gap-4">

                      <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">

                        <FileX className="w-10 h-10 text-green-400" />

                      </div>

                      <div>

                        <p className="text-gray-700 font-semibold text-base mb-1">
                          Belum Ada
                          Riwayat
                          Transaksi
                        </p>

                        <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
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

                filteredData.map(
                  (
                    item
                  ) => (

                    <tr
                      key={
                        item.id_riwayat
                      }
                      className="border-t transition-colors hover:bg-gray-50"
                    >

                      {/* TANGGAL */}
                      <td className="px-4 py-4 text-center text-gray-700">

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
                      <td className="px-4 py-4 text-center font-medium text-gray-800">

                        {
                          item.jenis_transaksi
                        }

                      </td>

                      {/* NOMINAL */}
                      <td className="px-4 py-4 text-center font-semibold text-gray-800">

                        Rp{" "}
                        {item.nominal.toLocaleString(
                          "id-ID"
                        )}

                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-4 text-center">

                        <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                          BERHASIL
                        </span>

                      </td>

                      {/* KETERANGAN */}
                      <td className="px-4 py-4 text-center text-gray-600">

                        {
                          item.keterangan
                        }

                      </td>

                      <td className="px-4 py-4 text-center">
                        {item.bukti_bayar ? (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => setPreview(item.bukti_bayar)}
                              className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                            >
                              <Eye className="h-4 w-4" />
                              Lihat
                            </button>
                            <a
                              href={item.bukti_bayar}
                              download
                              className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200"
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

        {/* FOOTER */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-400 px-1">

          <span>
            Menampilkan{" "}
            {
              filteredData.length
            }{" "}
            transaksi
          </span>

        </div>

      </div>

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPreview(null)}
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
