"use client";

import { useState } from "react";

import Nasabah from "../survey/konten/nasabah";
import Kalender from "../survey/konten/kalender";

type TabType =
  | "nasabah"
  | "kalender";

type Props = {
  dataPeminjaman?: any[];
  dataSurvey?: any[];
};

export default function ClientPage({
  dataPeminjaman = [],
  dataSurvey = [],
}: Props) {

  const [
    activeTab,
    setActiveTab,
  ] = useState<TabType>(
    "nasabah"
  );

  return (
    <div className="w-full min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="border-b bg-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-7">

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Jadwal Survey
          </h1>

          <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-2xl leading-relaxed">
            Kelola pengajuan nasabah dan jadwalkan survey
            lapangan secara terstruktur sebelum proses
            pencairan pinjaman dilakukan.
          </p>

        </div>

      </div>

      {/* TAB */}
      <div className="bg-white border-b">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

          <div className="flex gap-8">

            {/* TAB NASABAH */}
            <button
              onClick={() =>
                setActiveTab(
                  "nasabah"
                )
              }
              className={`
                relative
                py-4
                text-sm
                sm:text-base
                font-medium
                transition
                ${
                  activeTab ===
                  "nasabah"
                    ? "text-blue-700"
                    : "text-gray-500 hover:text-gray-500"
                }
              `}
            >

              Pengajuan Nasabah

              {activeTab ===
                "nasabah" && (
                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-blue-700 rounded-full" />
              )}

            </button>

            {/* TAB KALENDER */}
            <button
              onClick={() =>
                setActiveTab(
                  "kalender"
                )
              }
              className={`
                relative
                py-4
                text-sm
                sm:text-base
                font-medium
                transition
                ${
                  activeTab ===
                  "kalender"
                    ? "text-blue-700"
                    : "text-gray-500 hover:text-gray-500"
                }
              `}
            >

              Kalender Survey

              {activeTab ===
                "kalender" && (
                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-blue-700 rounded-full" />
              )}

            </button>

          </div>

        </div>

      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6">

        {activeTab ===
        "nasabah" ? (
          <Nasabah data={dataPeminjaman} />
        ) : (
          <Kalender data={dataSurvey}/>
        )}

      </div>

    </div>
  );
}