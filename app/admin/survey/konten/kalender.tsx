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

  const rows =
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

  // 🔥 SENIN = AWAL
  const getDayIndex = (
    date: Date
  ) => {

    const day =
      date.getDay();

    return day === 0
      ? 6
      : day - 1;
  };

  // 🔥 BUILD 35 SLOT
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b">

        <h2 className="text-lg font-semibold text-gray-800">
          Kalender Survey
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
            className="w-8 h-8 rounded-lg border hover:bg-gray-100 transition"
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
            className="w-8 h-8 rounded-lg border hover:bg-gray-100 transition"
          >
            →
          </button>

        </div>

      </div>

      {/* GRID */}
      <div className="flex">

        {/* ROW */}
        <div className="w-[70px] border-r bg-gray-50">

          {rows.map(
            (_, i) => (
              <div
                key={i}
                className="h-[90px] border-b"
              />
            )
          )}

        </div>

        {/* KOLOM */}
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
                                item.tanggal_survey
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
                          className="relative h-[90px] border-b"
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
                                  event.id_survey
                                }
                                className="group absolute left-2 right-2"
                                style={{
                                  top:
                                    20 +
                                    eventIndex *
                                      34,
                                }}
                              >

                                {/* CARD EVENT */}
                                <div className="bg-orange-100 text-orange-700 p-2 rounded-xl text-xs shadow border border-orange-200">

                                  <p className="font-semibold truncate">
                                    Survey
                                  </p>

                                  <p className="text-[10px] truncate">
                                    {
                                      event
                                        ?.peminjaman
                                        ?.anggota
                                        ?.nama
                                    }
                                  </p>

                                </div>

                                {/* HOVER */}
                                <div className="hidden group-hover:block absolute z-50 top-full mt-2 left-0 w-64 bg-white border shadow-xl rounded-2xl p-4">

                                  <p className="font-semibold text-sm text-gray-800">
                                    {
                                      event
                                        ?.peminjaman
                                        ?.anggota
                                        ?.nama
                                    }
                                  </p>

                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(
                                      event.tanggal_survey
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
                                  </p>

                                  {event.lokasi && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      📍{" "}
                                      {
                                        event.lokasi
                                      }
                                    </p>
                                  )}

                                  <p className="text-xs mt-2 inline-block bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                    {
                                      event.status
                                    }
                                  </p>

                                  <Link
                                    href={`/admin/survey/${event.peminjaman.id_anggota}/${event.id_peminjaman}`}
                                    className="inline-block mt-4 text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg transition"
                                  >
                                    Lihat Jadwal
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