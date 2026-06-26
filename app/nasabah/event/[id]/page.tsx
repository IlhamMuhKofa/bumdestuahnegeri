"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const DetailEvent = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 USER REAL (ambil dari API anggota)
  const [user, setUser] = useState<any>(null);

  const [form, setForm] = useState({
    id_event: "",
    id_anggota: "",
    nama: "",
    email: "",
  });

  // ===== GET EVENT =====
  useEffect(() => {
    if (!id) return;

    fetch(`/api/event/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data);
      });
  }, [id]);

  // ===== GET USER LOGIN =====
useEffect(() => {
  fetch("/api/auth/session")
    .then((res) => res.json())
    .then((session) => {
      if (!session) {
        setLoading(false);
        return;
      }

      const user = session.user;

      setUser(user);

      setForm({
        id_event: id,
        id_anggota: user.id, // ⚠️ pastikan ini ada di session
        nama: user.name,
        email: user.email,
      });

      setLoading(false);
    })
    .catch(() => setLoading(false));
}, [id]);

  // ===== FORMAT =====
  const formatTanggal = (date: string) => {
    return new Date(date).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/event-peserta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const result = await res.json();

    if (!result.success) {
      alert(result.message);
      return;
    }

    alert("Berhasil daftar!");
    router.push("/nasabah/event");
  };

  if (loading || !event) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-6">

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">

          {/* GAMBAR */}
          <div className="h-64 md:h-full">
            <img
              src={event.gambar_event}
              className="w-full h-full object-cover"
            />
          </div>

          {/* FORM */}
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">
              {event.judul}
            </h1>

            <p className="text-gray-500 mb-2">
              📍 {event.lokasi}
            </p>

            <p className="text-gray-500 mb-6">
              🗓 {formatTanggal(event.tanggal)}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* NAMA */}
              <div>
                <label className="block text-sm mb-1">Nama</label>
                <input
                  type="text"
                  value={form.nama}
                  readOnly
                  className="w-full border px-3 py-2 rounded bg-gray-100"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  readOnly
                  className="w-full border px-3 py-2 rounded bg-gray-100"
                />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
              >
                Daftar Event
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailEvent;