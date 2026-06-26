"use client";

import { useState } from "react";
import {
  ClipboardList,
  FileSearch,
} from "lucide-react";

import Cicilan from "./konten/cicilan";
import Survey from "./konten/survey/client";

type Props = {
  peminjaman: any[];
  survey: any[];
};

export default function ClientPage({
  peminjaman,
  survey,
}: Props) {
  const [
    activeTab,
    setActiveTab,
  ] = useState<
    "cicilan" | "survey"
  >("cicilan");

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="px-5 md:px-10 pt-8">

        <div className="max-w-2xl mx-auto text-center">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 mb-4">
            <ClipboardList className="w-8 h-8 text-green-700" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Tagihan & Jadwal
          </h1>

          <p className="mt-3 text-gray-500 leading-relaxed max-w-lg mx-auto">
            Pantau tagihan pinjaman dan jadwal survey Anda
            dengan mudah dalam satu halaman yang terintegrasi.
          </p>

        </div>

      </div>

      {/* TAB */}
      <div className="px-5 md:px-10 mt-8">

        <div className="max-w-full mx-full">

          <div className="rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">

            <div className="grid grid-cols-2 gap-1">

              <button
                onClick={() =>
                  setActiveTab(
                    "cicilan"
                  )
                }
                className={`flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-medium transition-all duration-200 ${
                  activeTab ===
                  "cicilan"
                    ? "bg-[#1a3c2e] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <ClipboardList className="h-4 w-4" />
                Tagihan
              </button>

              <button
                onClick={() =>
                  setActiveTab(
                    "survey"
                  )
                }
                className={`flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-medium transition-all duration-200 ${
                  activeTab ===
                  "survey"
                    ? "bg-[#1a3c2e] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FileSearch className="h-4 w-4" />
                Survey
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* CONTENT */}
      <div className="mt-8">

        {activeTab ===
        "cicilan" ? (
          <Cicilan
            data={
              peminjaman
            }
          />
        ) : (
          <Survey
            data={
              survey
            }
          />
        )}

      </div>

    </div>
  );
}