"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, CalendarDays, MapPin } from "lucide-react";

const TambahEvent = () => {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    judul: "",
    deskripsi_event: "",
    tanggal: "",
    lokasi: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Upload gambar dulu!");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/event/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      alert("Upload gambar gagal!");
      return null;
    }

    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const imageUrl = await handleUpload();
      if (!imageUrl) {
        setLoading(false);
        return;
      }

      const res = await fetch("/api/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          gambar_event: imageUrl,
        }),
      });

      if (!res.ok) {
        alert("Gagal menambahkan event");
        setLoading(false);
        return;
      }

      alert("Event berhasil ditambahkan!");
      router.push("/admin/event");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-3xl">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Tambah Event
          </h1>
          <p className="text-sm text-gray-500">
            Lengkapi informasi event dengan detail yang jelas
          </p>
        </div>

        {/* CARD */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border p-6 space-y-6"
        >

          {/* JUDUL */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Judul Event
            </label>
            <input
              type="text"
              name="judul"
              placeholder="Masukkan judul event..."
              value={form.judul}
              onChange={handleChange}
              className="mt-2 w-full border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none px-4 py-2.5 rounded-xl text-sm transition"
              required
            />
          </div>

          {/* TANGGAL */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              Tanggal & Waktu
            </label>
            <input
              type="datetime-local"
              name="tanggal"
              onChange={handleChange}
              className="mt-2 w-full border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none px-4 py-2.5 rounded-xl text-sm transition"
              required
            />
          </div>

          {/* LOKASI */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Lokasi Event
            </label>
            <input
              type="text"
              name="lokasi"
              placeholder="Contoh: Aula Desa, Lapangan..."
              value={form.lokasi}
              onChange={handleChange}
              className="mt-2 w-full border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none px-4 py-2.5 rounded-xl text-sm transition"
              required
            />
          </div>

          {/* UPLOAD GAMBAR (FIXED BOX) */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Gambar Event
            </label>

            <label className="mt-2 relative flex items-center justify-center w-full h-52 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer overflow-hidden group hover:border-indigo-400 transition bg-gray-50">

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                required
              />

              {preview ? (
                <>
                  <img
                    src={preview}
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-sm">
                    Ganti Gambar
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <UploadCloud className="w-7 h-7 mb-2" />
                  <span className="text-xs">
                    Klik untuk upload gambar
                  </span>
                </div>
              )}
            </label>
          </div>

          {/* DESKRIPSI */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Deskripsi Event
            </label>
            <textarea
              name="deskripsi_event"
              placeholder="Tulis deskripsi event..."
              value={form.deskripsi_event}
              onChange={handleChange}
              rows={6}
              className="mt-2 w-full border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none px-4 py-3 rounded-xl text-sm transition resize-none"
            />
          </div>

          {/* ACTION */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push("/admin/event")}
              className="px-5 py-2.5 text-sm rounded-xl border text-gray-600 hover:bg-gray-100 transition"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-sm rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow transition disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Event"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TambahEvent;