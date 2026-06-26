"use client";

import { useState } from "react";
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

  return (
    <div className="w-full bg-gray-50 border-b">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Jadwal Cicilan
        </h1>

        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Kelola dan pantau jadwal pembayaran cicilan
          dengan mudah dan terstruktur
        </p>
      </div>

      {/* TAB MENU */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex gap-6 border-b">

          {/* TAB NASABAH */}
          <button
            onClick={() =>
              setActiveTab("nasabah")
            }
            className={`
              pb-3
              text-sm
              sm:text-base
              font-medium
              transition
              relative
              ${
                activeTab ===
                "nasabah"
                  ? "text-blue-700"
                  : "text-gray-500 hover:text-gray-500"
              }
            `}
          >
            Nasabah

            {activeTab ===
              "nasabah" && (
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-blue-700 rounded-full" />
            )}
          </button>

          {/* TAB KALENDER */}
          <button
            onClick={() =>
              setActiveTab("kalender")
            }
            className={`
              pb-3
              text-sm
              sm:text-base
              font-medium
              transition
              relative
              ${
                activeTab ===
                "kalender"
                  ? "text-blue-700"
                  : "text-gray-500 hover:text-gray-500"
              }
            `}
          >
            Kalender Tagihan

            {activeTab ===
              "kalender" && (
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-blue-700 rounded-full" />
            )}
          </button>

        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6">

        {activeTab ===
        "nasabah" ? (
          <Nasabah
            data={nasabah}
          />
        ) : (
<Kalender data={jadwal} />
        )}

      </div>

    </div>
  );
}