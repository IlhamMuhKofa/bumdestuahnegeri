"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  Pencil,
  Trash2,
  Plus,
  MapPin,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Event = {
  id_event: number;
  judul: string;
  gambar_event: string;
  tanggal: string;
  lokasi: string;
  status: string;
};

type Peserta = {
  id_event_peserta: number;
  nama: string;
  email: string;
  tanggal_daftar: string;
  event: {
    judul: string;
  };
};

export default function AdminEvent() {
  const [tab, setTab] = useState<"event" | "peserta">("event");
  const [events, setEvents] = useState<Event[]>([]);
  const [peserta, setPeserta] = useState<Peserta[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/event")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort(
          (a: Event, b: Event) =>
            new Date(a.tanggal).getTime() -
            new Date(b.tanggal).getTime()
        );
        setEvents(sorted);
      });
  }, []);

  useEffect(() => {
    fetch("/api/event-peserta")
      .then((res) => res.json())
      .then((data) => setPeserta(data));
  }, []);

  const formatDateTime = (date: string) => {
    const d = new Date(date);
    const bulan = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

    return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()} • ${d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/event/${id}`, { method: "DELETE" });
    const result = await res.json();

    if (result.success) {
      setEvents((prev) => prev.filter((e) => e.id_event !== id));
    }
  };

  const handleFeature = async (id: number) => {
    await fetch("/api/event", {
      method: "PATCH",
      body: JSON.stringify({ id }),
    });

    setEvents((prev) =>
      prev.map((e) => ({
        ...e,
        status: e.id_event === id ? "featured" : "published",
      }))
    );
  };

  const featured = events.filter((e) => e.status === "featured");
  const regular = events.filter((e) => e.status !== "featured");

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ================= BANNER ================= */}
      <div className="bg-white border-b rounded-2xl">
        <div className="max-w-7xl mx-auto px-6 py-6">

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Manajemen Event
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Kelola event dan peserta dengan mudah
              </p>
            </div>

            {tab === "event" && (
              <button
                onClick={() => router.push("/admin/event/tambah")}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                <Plus size={16} />
                Tambah Event
              </button>
            )}
          </div>

          {/* TAB */}
          <div className="flex gap-6 mt-6 border-b">
            {["event", "peserta"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t as any)}
                className={`pb-3 text-sm font-medium relative ${
                  tab === t
                    ? "text-indigo-600"
                    : "text-gray-500 hover:text-indigo-500"
                }`}
              >
                {t === "event" ? "Kelola Event" : "Data Peserta"}
                {tab === t && (
                  <span className="absolute left-0 bottom-0 w-full h-[2px] bg-indigo-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto py-6">
        <div className="bg-white rounded-2xl shadow-sm border p-6">

          {/* ================= EVENT ================= */}
          {tab === "event" && (
            <>
              {/* FEATURED */}
              {featured.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
                    <Star size={16} className="text-yellow-500" />
                    Event Utama
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featured.map((item) => (
                      <div
                        key={item.id_event}
                        className="group bg-white rounded-2xl border-2 border-yellow-300 shadow-md overflow-hidden flex flex-col"
                      >
                        <div className="relative h-48">
                          <img
                            src={item.gambar_event}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                          <div className="absolute top-3 left-3 bg-yellow-400 text-white text-xs px-3 py-1 rounded-full">
                            Utama
                          </div>
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-semibold text-sm text-gray-800 line-clamp-2">
                            {item.judul}
                          </h3>

                          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <MapPin size={12} />
                            {item.lokasi}
                          </p>

                          <p className="text-xs text-gray-400 mt-1 mb-4">
                            <Calendar size={12} className="inline mr-1" />
                            {formatDateTime(item.tanggal)}
                          </p>

                          <div className="mt-auto flex gap-2">
                            <button
                              onClick={() => router.push(`/admin/event/edit/${item.id_event}`)}
                              className="
      flex-1 text-xs font-medium
      border border-blue-200
      text-blue-600
      py-2 rounded-lg
      bg-blue-50
      hover:bg-blue-100
      transition-all duration-200
    "
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id_event)}
                              className="
      flex-1 text-xs font-medium
      border border-red-200
      text-red-600
      py-2 rounded-lg
      bg-red-50
      hover:bg-red-100
      transition-all duration-200
    "
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* REGULAR */}
              <div>
                <h2 className="text-sm font-semibold text-gray-600 mb-4">
                  Semua Event
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regular.map((item) => (
                    <div
                      key={item.id_event}
                      className="group bg-white rounded-2xl border shadow-sm hover:shadow-lg overflow-hidden flex flex-col"
                    >
                      <div className="h-48">
                        <img
                          src={item.gambar_event}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-semibold text-sm text-gray-800 line-clamp-2">
                          {item.judul}
                        </h3>

                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <MapPin size={12} />
                          {item.lokasi}
                        </p>

                        <p className="text-xs text-gray-400 mt-1 mb-4">
                          <Calendar size={12} className="inline mr-1" />
                          {formatDateTime(item.tanggal)}
                        </p>

                        <div className="mt-auto flex gap-2">
                          <button
                            onClick={() => router.push(`/admin/event/edit/${item.id_event}`)}
                            className="
      flex-1 text-xs font-medium
      border border-blue-200
      text-blue-600
      py-2 rounded-lg
      bg-blue-50
      hover:bg-blue-100
      transition-all duration-200
    "
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(item.id_event)}
                            className="
      flex-1 text-xs font-medium
      border border-red-200
      text-red-600
      py-2 rounded-lg
      bg-red-50
      hover:bg-red-100
      transition-all duration-200
    "
                          >
                            Hapus
                          </button>
                        </div>

                        <button
                          onClick={() => handleFeature(item.id_event)}
                          className="mt-3 text-xs bg-green-700 hover:bg-green-800 text-white py-2 rounded"
                        >
                          Jadikan Utama
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ================= PESERTA ================= */}
          {tab === "peserta" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm ">
                <thead className="bg-blue-800 text-white">
                  <tr>
                    <th className="p-4 text-left">No</th>
                    <th className="p-4 text-left">Nama</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Event</th>
                    <th className="p-4 text-left">Tanggal</th>
                  </tr>
                </thead>

                <tbody>
                  {peserta.map((p, i) => (
                    <tr key={p.id_event_peserta} className="border-t hover:bg-gray-50">
                      <td className="p-4">{i + 1}</td>
                      <td className="p-4 font-medium">{p.nama}</td>
                      <td className="p-4">{p.email}</td>
                      <td className="p-4">{p.event?.judul}</td>
                      <td className="p-4 text-gray-500">
                        {formatDateTime(p.tanggal_daftar)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}