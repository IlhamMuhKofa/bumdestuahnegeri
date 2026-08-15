"use client";

import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";

import Nasabah from "../cicilan/konten/nasabah";
import Kalender from "../cicilan/konten/kalender";

type Props = {
  nasabah: any;
  jadwal: any;
};

export default function Cicilan({
  nasabah,
  jadwal,
}: Props) {
  const [activeTab, setActiveTab] = useState<
    "nasabah" | "kalender"
  >("nasabah");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("terbaru");

  // =====================================================
  // SEARCH + SORT NASABAH
  // =====================================================
  const filteredNasabah = useMemo(() => {
    if (!Array.isArray(nasabah)) return [];

    let result = [...nasabah];

    // SEARCH
    if (search.trim()) {
      const keyword = search.toLowerCase();

      result = result.filter((item: any) =>
        item.nama
          ?.toLowerCase()
          .includes(keyword)
      );
    }

    // SORT
    result.sort((a: any, b: any) => {
      switch (sort) {
        case "terlama":
          return (
            new Date(a.terakhir).getTime() -
            new Date(b.terakhir).getTime()
          );

        case "az":
          return (a.nama || "").localeCompare(
            b.nama || "",
            "id"
          );

        case "za":
          return (b.nama || "").localeCompare(
            a.nama || "",
            "id"
          );

        case "terbaru":
        default:
          return (
            new Date(b.terakhir).getTime() -
            new Date(a.terakhir).getTime()
          );
      }
    });

    return result;
  }, [nasabah, search, sort]);

  return (
    <div className="min-h-screen bg-gray-50/50 p-2">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Jadwal Cicilan
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola dan pantau jadwal pembayaran cicilan
            nasabah
          </p>
        </div>


        {/* =====================================================
            TABS
        ====================================================== */}
        <div className="w-full rounded-xl bg-gray-100 p-1">

          <div className="flex w-full gap-1">

            {/* NASABAH */}
            <button
              onClick={() =>
                setActiveTab("nasabah")
              }
              className={`
                flex flex-1
                items-center
                justify-center
                rounded-lg
                px-3
                py-2
                text-sm
                font-medium
                transition-all
                duration-200
                ${
                  activeTab === "nasabah"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              Nasabah
            </button>


            {/* KALENDER */}
            <button
              onClick={() =>
                setActiveTab("kalender")
              }
              className={`
                flex flex-1
                items-center
                justify-center
                rounded-lg
                px-3
                py-2
                text-sm
                font-medium
                transition-all
                duration-200
                ${
                  activeTab === "kalender"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              Kalender Tagihan
            </button>

          </div>

        </div>


        {/* =====================================================
            SEARCH + SORT
        ====================================================== */}
        {activeTab === "nasabah" && (
          <div className="flex items-center gap-3">

            {/* SEARCH */}
            <div className="relative flex-1 max-w-full">

              <Search
                className="
                  absolute left-3 top-1/2
                  -translate-y-1/2
                  h-4 w-4
                  text-gray-400
                "
              />

              <input
                type="text"
                placeholder="Cari nama nasabah..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="
                  w-full
                  pl-9 pr-4 py-2
                  text-sm
                  border border-gray-200
                  rounded-xl
                  bg-gray-50
                  focus:bg-white
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500/20
                  focus:border-blue-400
                  transition-all
                  placeholder:text-gray-400
                "
              />

            </div>


            {/* SORT */}
            <div className="relative">

              <SlidersHorizontal
                className="
                  absolute left-3 top-1/2
                  -translate-y-1/2
                  h-4 w-4
                  text-gray-400
                  pointer-events-none
                "
              />

              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value)
                }
                className="
                  pl-9 pr-8 py-2
                  text-sm
                  border border-gray-200
                  rounded-xl
                  bg-gray-50
                  focus:bg-white
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500/20
                  focus:border-blue-400
                  transition-all
                  appearance-none
                  cursor-pointer
                  text-gray-600
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
                  absolute right-2.5 top-1/2
                  -translate-y-1/2
                  h-3.5 w-3.5
                  text-gray-400
                  pointer-events-none
                "
              />

            </div>

          </div>
        )}


        {/* =====================================================
            CONTENT
        ====================================================== */}
        <div className="w-full">

          {activeTab === "nasabah" ? (
            <Nasabah
              data={filteredNasabah}
            />
          ) : (
            <Kalender
              data={jadwal}
            />
          )}

        </div>
      </div>
    </div>
  );
}