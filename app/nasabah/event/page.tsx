"use client";

import React, { useEffect, useState } from "react";
import { MapPin, ChevronDown, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";

const HalamanEvent = () => {
  const [showAll, setShowAll] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [myEvents, setMyEvents] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/event")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort(
          (a: any, b: any) =>
            new Date(a.tanggal).getTime() -
            new Date(b.tanggal).getTime()
        );
        setEvents(sorted);
      });
  }, []);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((session) => {
        if (!session?.user) return;
        return fetch(`/api/event-peserta/peserta?id_anggota=${session.user.id}`);
      })
      .then((res) => res?.json())
      .then((data) => {
        if (!data) return;
        setMyEvents(data.map((d: any) => Number(d.id_event)));
      });
  }, []);

  const formatTanggal = (date: string) => {
    const d = new Date(date);
    const bulan = [
      "Jan","Feb","Mar","Apr","Mei","Jun",
      "Jul","Agu","Sep","Okt","Nov","Des"
    ];

    return {
      day: d.getDate(),
      month: bulan[d.getMonth()],
      time: d.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const featured = events.find((e) => e.status === "featured");
  const others = events.filter((e) => e.id_event !== featured?.id_event);
  const displayedEvents = showAll ? others : others.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-5 py-10">

        {/* HEADER */}
        <div className="text-left mb-14">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Event & Kegiatan
          </h1>
          <p className="text-gray-500 text-sm">
            Ikuti berbagai kegiatan menarik yang tersedia
          </p>
        </div>

        {/* FEATURED */}
        {featured && (
          <div className="mb-14 group">
            <div className="relative overflow-hidden rounded-3xl shadow-lg h-[360px] md:h-[420px] cursor-pointer">

              <img
                src={featured.gambar_event}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              <div className="absolute bottom-0 p-6 text-white max-w-2xl">
                <span className="text-xs bg-green-600 px-3 py-1 rounded-full">
                  Event Utama
                </span>

                <h2 className="text-2xl font-bold mt-3 line-clamp-2">
                  {featured.judul}
                </h2>

                <p className="text-sm mt-2 text-gray-200 line-clamp-2">
                  {featured.deskripsi_event}
                </p>

                <div className="flex items-center gap-2 text-xs mt-3 text-gray-300">
                  <CalendarDays className="w-4 h-4" />
                  {formatTanggal(featured.tanggal).day}{" "}
                  {formatTanggal(featured.tanggal).month}
                </div>
              </div>

              {/* BUTTON */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                {myEvents.includes(featured.id_event) ? (
                  <button className="bg-white/80 text-gray-800 px-6 py-3 rounded-xl text-sm font-medium">
                    ✔ Sudah Terdaftar
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      router.push(`/nasabah/event/${featured.id_event}`)
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-sm shadow"
                  >
                    Daftar Event
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

        {/* LIST */}
        <div className="space-y-5 mb-10">
          {displayedEvents.map((event) => {
            const tgl = formatTanggal(event.tanggal);
            const isRegistered = myEvents.includes(event.id_event);

            return (
              <div
                key={event.id_event}
                className="group bg-white rounded-2xl border shadow-sm hover:shadow-lg transition p-5 flex flex-col md:flex-row gap-5 items-start md:items-center"
              >

                {/* DATE MINI */}
                <div className="flex items-center gap-3 md:w-40">
                  <div className="bg-yellow-300 rounded-xl px-3 py-2 text-center">
                    <div className="text-lg font-bold text-gray-800">
                      {tgl.day}
                    </div>
                    <div className="text-xs text-gray-500">
                      {tgl.month}
                    </div>
                  </div>

                  <div className="text-md text-gray-800">
                    {tgl.time}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-base mb-1 line-clamp-2">
                    {event.judul}
                  </h3>

                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                    {event.deskripsi_event}
                  </p>

                  <div className="flex items-center gap-3 flex-wrap">
                    {isRegistered ? (
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        ✔ Terdaftar
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          router.push(`/nasabah/event/${event.id_event}`)
                        }
                        className="text-xs bg-gray-800 hover:bg-gray-900 text-white px-4 py-1.5 rounded-lg"
                      >
                        Daftar
                      </button>
                    )}

                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      {event.lokasi}
                    </div>
                  </div>
                </div>

                {/* IMAGE */}
                <div className="w-full md:w-28 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={event.gambar_event}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>

              </div>
            );
          })}
        </div>

        {/* LOAD MORE */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow"
          >
            {showAll ? "Lebih Sedikit" : "Lihat Semua"}
            <ChevronDown
              className={`w-4 h-4 transition ${
                showAll ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

      </div>
    </div>
  );
};

export default HalamanEvent;