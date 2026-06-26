"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const days = [
  "Sen",
  "Sel",
  "Rab",
  "Kam",
  "Jum",
  "Sab",
  "Min",
];

type Props = {
  data: any[];
};

export default function Kalender({
  data,
}: Props) {
  const [cursor, setCursor] =
    useState(new Date());

  const year =
    cursor.getFullYear();

  const month =
    cursor.getMonth();

  const hours =
    Array.from(
      { length: 5 },
      (_, i) => i
    );

  const monthLabel =
    cursor.toLocaleDateString(
      "id-ID",
      {
        month: "long",
        year: "numeric",
      }
    );

  // monday first
  const getDayIndex = (
    date: Date
  ) => {
    const day =
      date.getDay();

    return day === 0
      ? 6
      : day - 1;
  };

  // build 35 slot (5 minggu)
  const weeks =
    useMemo(() => {
      const first =
        new Date(
          year,
          month,
          1
        );

      const offset =
        getDayIndex(
          first
        );

      const start =
        new Date(
          year,
          month,
          1 - offset
        );

      const result = [];

      for (
        let i = 0;
        i < 35;
        i++
      ) {
        const d =
          new Date(start);

        d.setDate(
          start.getDate() + i
        );

        result.push(d);
      }

      return result;
    }, [
      year,
      month,
    ]);

  const getEventTop = (
    weekIndex: number
  ) => {
    return (
      40 +
      weekIndex * 80 +
      4
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b">

        <h2 className="text-lg font-semibold text-gray-800">
          Kalender Cicilan
        </h2>

        <div className="flex items-center gap-4">

          <button
            onClick={() =>
              setCursor(
                new Date(
                  year,
                  month - 1,
                  1
                )
              )
            }
          >
            ←
          </button>

          <span className="text-sm text-gray-500">
            {monthLabel}
          </span>

          <button
            onClick={() =>
              setCursor(
                new Date(
                  year,
                  month + 1,
                  1
                )
              )
            }
          >
            →
          </button>

        </div>

      </div>

      {/* GRID */}
      <div className="flex">

        {/* ROW TANGGAL */}
        <div className="w-[70px] border-r bg-gray-50">
          {hours.map(
            (_, i) => (
              <div
                key={i}
                className="h-[80px] border-b"
              />
            )
          )}
        </div>

        {/* KOLOM HARI */}
        <div className="grid grid-cols-7 flex-1">

          {days.map(
            (
              day,
              colIndex
            ) => {

              const dayDates =
                weeks.filter(
                  (d) =>
                    getDayIndex(
                      d
                    ) ===
                    colIndex
                );

              return (
                <div
                  key={day}
                  className="border-r relative"
                >

                  {/* HEADER */}
                  <div className="h-[40px] flex items-center justify-center text-sm font-medium text-gray-600 border-b bg-gray-50">
                    {day}
                  </div>

                  {/* SLOT */}
                  {dayDates.map(
                    (
                      slotDate,
                      weekIndex
                    ) => {

                      const events =
                        data.filter(
                          (
                            item
                          ) => {

                            const d =
                              new Date(
                                item.jatuh_tempo
                              );

                            return (
                              d.toDateString() ===
                              slotDate.toDateString()
                            );
                          }
                        );

                      return (
                        <div
                          key={
                            weekIndex
                          }
                          className="relative h-[80px] border-b"
                        >

                          {/* TANGGAL */}
                          <div className="absolute top-1 left-2 text-[11px] text-gray-400">
                            {slotDate.getDate()}
                          </div>

                          {/* EVENTS */}
                          {events.map(
                            (
                              event,
                              eventIndex
                            ) => (
                              <div
                                key={
                                  event.id_jadwal
                                }
                                className="group absolute left-2 right-2"
                                style={{
                                  top:
                                    eventIndex *
                                    32,
                                }}
                              >

                                <div className="bg-blue-100 text-blue-700 p-2 rounded-xl text-xs shadow border border-green-200">

                                  <p className="font-semibold">
                                    Cicilan ke-
                                    {
                                      event.cicilan_ke
                                    }
                                  </p>

                                  <p className="text-[10px] truncate">
                                    {
                                      event
                                        .peminjaman
                                        ?.anggota
                                        ?.nama
                                    }
                                  </p>

                                </div>

                                {/* HOVER */}
                                <div className="hidden group-hover:block absolute z-50 top-full mt-2 left-0 w-56 bg-white border shadow-xl rounded-xl p-4">

                                  <p className="font-semibold text-sm">
                                    {
                                      event
                                        .peminjaman
                                        ?.anggota
                                        ?.nama
                                    }
                                  </p>

                                  <p className="text-xs text-gray-500 mt-1">
                                    Cicilan ke-
                                    {
                                      event.cicilan_ke
                                    }
                                  </p>

                                  <p className="text-xs text-gray-500">
                                    {
                                      event.status
                                    }
                                  </p>

                                  <Link
                                    href={`/admin/cicilan/konten/${event.peminjaman.id_anggota}`}
                                    className="inline-block mt-3 text-xs bg-blue-600 text-white px-3 py-2 rounded-lg"
                                  >
                                    Lihat
                                  </Link>

                                </div>

                              </div>
                            )
                          )}

                        </div>
                      );
                    }
                  )}

                </div>
              );
            }
          )}

        </div>

      </div>

    </div>
  );
}