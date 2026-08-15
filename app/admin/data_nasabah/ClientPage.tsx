"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronRight,
  Users,
} from "lucide-react";

export default function ClientPage({ nasabah }: any) {
  const [tab, setTab] = useState("semua");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("terbaru");

  const router = useRouter();

  // =====================================================
  // PAGINATION
  // =====================================================

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // =====================================================
  // STATUS LOGIC
  // =====================================================

  const getStatus = (user: any) => {
    if (user.status === "disabled") {
      return "nonaktif";
    }

    const hasApproved = user.peminjaman?.some(
      (p: any) => p.status === "ACTIVE"
    );

    if (hasApproved) {
      return "ACTIVE";
    }

    return "new";
  };

  // =====================================================
  // FILTER TAB
  // =====================================================

  const filteredNasabah = nasabah.filter((item: any) => {
    const status = getStatus(item);

    if (tab === "ACTIVE") {
      return status === "ACTIVE";
    }

    if (tab === "calon") {
      return status === "new";
    }

    if (tab === "nonaktif") {
      return status === "nonaktif";
    }

    return true;
  });

  // =====================================================
  // SEARCH
  // =====================================================

  const searchedNasabah = filteredNasabah.filter(
    (item: any) =>
      item.nama
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  // =====================================================
  // SORT
  // =====================================================

  const sortedNasabah = [...searchedNasabah].sort(
    (a: any, b: any) => {
      if (sort === "az") {
        return (a.nama || "").localeCompare(
          b.nama || ""
        );
      }

      if (sort === "za") {
        return (b.nama || "").localeCompare(
          a.nama || ""
        );
      }

      if (sort === "terlama") {
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );
      }

      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    }
  );

  // =====================================================
  // PAGINATION LOGIC
  // =====================================================

  const totalData = sortedNasabah.length;

  const totalPages = Math.ceil(
    totalData / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const currentData = sortedNasabah.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // =====================================================
  // TAB COUNT
  // =====================================================

  const tabCount = (value: string) => {
    if (value === "semua") {
      return nasabah.length;
    }

    return nasabah.filter(
      (item: any) => {
        const status = getStatus(item);

        if (value === "ACTIVE") {
          return status === "ACTIVE";
        }

        if (value === "calon") {
          return status === "new";
        }

        if (value === "nonaktif") {
          return status === "nonaktif";
        }

        return true;
      }
    ).length;
  };

  // =====================================================
  // PAGINATION HANDLER
  // =====================================================

  const goToPage = (page: number) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    setCurrentPage(page);
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return {
          label: "Aktif",
          className:
            "bg-emerald-50 text-emerald-700 border border-emerald-100",
        };

      case "nonaktif":
        return {
          label: "Non Aktif",
          className:
            "bg-red-50 text-red-700 border border-red-100",
        };

      case "new":
        return {
          label: "New",
          className:
            "bg-yellow-50 text-yellow-700 border border-yellow-100",
        };

      default:
        return {
          label: status,
          className:
            "bg-gray-50 text-gray-600 border border-gray-100",
        };
    }
  };

  // =====================================================
  // PAGINATION NUMBER
  // =====================================================

  const getPageNumbers = () => {
    const pages: number[] = [];

    if (totalPages <= 5) {
      for (
        let i = 1;
        i <= totalPages;
        i++
      ) {
        pages.push(i);
      }

      return pages;
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-2">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Data Nasabah
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Kelola dan pantau data seluruh nasabah
            </p>
          </div>

          <button
            onClick={() =>
              router.push(
                "/admin/data_nasabah/tambah"
              )
            }
            className="
              inline-flex
              items-center
              justify-center
              rounded-xl
              bg-blue-700
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition-all
              hover:bg-blue-800
              hover:shadow-md
            "
          >
            + Tambah Nasabah
          </button>

        </div>

                {/* =====================================================
            SEARCH + FILTER
        ===================================================== */}

        <div className="flex items-center gap-3">

          {/* SEARCH */}

          <div className="relative flex-1">

            <Search
              className="
                absolute
                left-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              placeholder="Cari nama nasabah..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                py-2
                pl-9
                pr-4
                text-sm
                text-gray-700
                outline-none
                transition-all
                placeholder:text-gray-400
                focus:border-blue-400
                focus:bg-white
                focus:ring-2
                focus:ring-blue-500/20
              "
            />

          </div>

          {/* SORT */}

          <div className="relative">

            <SlidersHorizontal
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-gray-400
              "
            />

            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setCurrentPage(1);
              }}
              className="
                appearance-none
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                py-2
                pl-9
                pr-9
                text-sm
                text-gray-600
                outline-none
                transition-all
                focus:border-blue-400
                focus:bg-white
                focus:ring-2
                focus:ring-blue-500/20
                cursor-pointer
              "
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

            <ArrowUpDown
              className="
                pointer-events-none
                absolute
                right-2.5
                top-1/2
                h-3.5
                w-3.5
                -translate-y-1/2
                text-gray-400
              "
            />

          </div>

        </div>

        {/* =====================================================
            TABS
        ===================================================== */}

        <div className="flex w-full gap-1 rounded-xl bg-gray-100 p-1">

          {[
            {
              label: "Semua",
              value: "semua",
            },
            {
              label: "Aktif",
              value: "ACTIVE",
            },
            {
              label: "Pendaftar",
              value: "calon",
            },
            {
              label: "Non Aktif",
              value: "nonaktif",
            },
          ].map((t) => {

            const count =
              tabCount(t.value);

            const active =
              tab === t.value;

            return (
              <button
                key={t.value}
                onClick={() => {
                  setTab(t.value);
                  setCurrentPage(1);
                }}
                className={`
                  relative
                  flex
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                  font-medium
                  transition-all
                  duration-200
                  ${
                    active
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }
                `}
              >
                {t.label}

                {count > 0 && (
                  <span
                    className={`
                      rounded-full
                      px-1.5
                      py-0.5
                      text-xs
                      font-semibold
                      leading-none
                      ${
                        active
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-200 text-gray-500"
                      }
                    `}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}

        </div>

        {/* =====================================================
            TABLE
        ===================================================== */}

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              {/* HEADER */}

              <thead>
                <tr className="bg-blue-800 text-white">

                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide">
                    Nasabah
                  </th>

                  <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide">
                    No HP
                  </th>

                  <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide">
                    Email
                  </th>

                  <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide">
                    Status
                  </th>

                  <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide">
                    Aksi
                  </th>

                </tr>
              </thead>

              {/* BODY */}

              <tbody>

                {currentData.length === 0 ? (

                  <tr>

                    <td
                      colSpan={5}
                      className="py-16"
                    >

                      <div className="flex flex-col items-center justify-center text-center">

                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                          <Users className="h-6 w-6 text-gray-400" />
                        </div>

                        <h3 className="text-sm font-semibold text-gray-700">
                          Tidak ada data
                        </h3>

                        <p className="mt-1 text-xs text-gray-400">
                          Data nasabah tidak ditemukan
                        </p>

                      </div>

                    </td>

                  </tr>

                ) : (

                  currentData.map(
                    (user: any) => {

                      const status =
                        getStatus(user);

                      const statusStyle =
                        getStatusStyle(
                          status
                        );

                      return (
                        <tr
                          key={user.id}
                          className="
                            border-t
                            border-gray-100
                            transition-colors
                            hover:bg-blue-50/40
                          "
                        >

                          {/* NASABAH */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div
                                className="
                                  flex
                                  h-9
                                  w-9
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-full
                                  bg-blue-100
                                  text-sm
                                  font-bold
                                  text-blue-700
                                "
                              >
                                {user.nama
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "?"}
                              </div>

                              <div className="min-w-0">

                                <p className="font-medium text-gray-800">
                                  {user.nama}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* NO HP */}

                          <td className="px-4 py-4 text-center">

                            <span className="text-sm text-gray-600">
                              {user.no_hp ||
                                "-"}
                            </span>

                          </td>

                          {/* EMAIL */}

                          <td className="px-4 py-4 text-center">

                            <span className="text-sm text-gray-600">
                              {user.email ||
                                "-"}
                            </span>

                          </td>

                          {/* STATUS */}

                          <td className="px-4 py-4 text-center">

                            <span
                              className={`
                                inline-flex
                                items-center
                                rounded-full
                                px-3
                                py-1
                                text-xs
                                font-semibold
                                ${statusStyle.className}
                              `}
                            >
                              {statusStyle.label}
                            </span>

                          </td>

                          {/* AKSI */}

                          <td className="px-5 py-4 text-center">

                            <a
                              href={`/admin/data_nasabah/${user.id}`}
                              className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-lg
                                border
                                border-blue-200
                                px-3
                                py-1.5
                                text-xs
                                font-semibold
                                text-blue-700
                                transition-all
                                hover:border-blue-700
                                hover:bg-blue-700
                                hover:text-white
                              "
                            >
                              Detail
                            </a>

                          </td>

                        </tr>
                      );
                    }
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* =====================================================
            PAGINATION
        ===================================================== */}

        <div className="flex flex-col gap-3 px-1 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">

          {/* INFO */}

          <span>
            Menampilkan{" "}
            <span className="font-medium text-gray-700">
              {totalData === 0
                ? 0
                : startIndex + 1}
              -
              {Math.min(
                startIndex +
                  itemsPerPage,
                totalData
              )}
            </span>{" "}
            dari{" "}
            <span className="font-medium text-gray-700">
              {totalData}
            </span>{" "}
            data
          </span>

          {/* BUTTONS */}

          <div className="flex items-center gap-1.5">

            {/* PREVIOUS */}

            <button
              onClick={() =>
                goToPage(
                  currentPage - 1
                )
              }
              disabled={
                currentPage === 1 ||
                totalPages === 0
              }
              className="
                rounded-lg
                border
                border-gray-200
                px-3
                py-2
                text-xs
                font-medium
                text-gray-500
                transition
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:text-gray-300
              "
            >
              ‹ Sebelumnya
            </button>

            {/* PAGE NUMBERS */}

            {getPageNumbers().map(
              (page) => (
                <button
                  key={page}
                  onClick={() =>
                    goToPage(page)
                  }
                  className={`
                    flex
                    h-8
                    min-w-8
                    items-center
                    justify-center
                    rounded-lg
                    border
                    text-xs
                    font-medium
                    transition
                    ${
                      currentPage ===
                      page
                        ? "border-blue-700 bg-blue-700 text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }
                  `}
                >
                  {page}
                </button>
              )
            )}

            {/* NEXT */}

            <button
              onClick={() =>
                goToPage(
                  currentPage + 1
                )
              }
              disabled={
                currentPage ===
                  totalPages ||
                totalPages === 0
              }
              className="
                rounded-lg
                border
                border-gray-200
                px-3
                py-2
                text-xs
                font-medium
                text-gray-500
                transition
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:text-gray-300
              "
            >
              Berikutnya ›
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}