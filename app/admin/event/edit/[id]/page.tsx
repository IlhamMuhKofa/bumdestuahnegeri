"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { UploadCloud, CalendarDays, MapPin } from "lucide-react";
import { toast } from "react-toastify";

const EditEvent = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    judul: "",
    deskripsi_event: "",
    gambar_event: "",
    tanggal: "",
    lokasi: "",
  });

  // ===== GET DATA =====
  useEffect(() => {
    if (!id) return;

    fetch(`/api/event/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          judul: data.judul || "",
          deskripsi_event: data.deskripsi_event || "",
          gambar_event: data.gambar_event || "",
          tanggal: data.tanggal
            ? new Date(data.tanggal).toISOString().slice(0, 16)
            : "",
          lokasi: data.lokasi || "",
        });
      });
  }, [id]);

  // ===== HANDLE CHANGE =====
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ===== UPLOAD =====
  const handleUpload = async () => {
    if (!file) return form.gambar_event;

    const formData = new FormData();
    formData.append("file", file);

    formData.append("folder", "event");

    const res = await fetch("/api/upload/image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.url;
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const imageUrl = await handleUpload();

    await fetch(`/api/event/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        gambar_event: imageUrl,
      }),
    });

    toast.success("Event berhasil diupdate!");
    router.push("/admin/event");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-3xl">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Edit Event
          </h1>
          <p className="text-sm text-gray-500">
            Perbarui informasi event yang sudah ada
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
              value={form.tanggal}
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
              value={form.lokasi}
              onChange={handleChange}
              className="mt-2 w-full border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none px-4 py-2.5 rounded-xl text-sm transition"
              required
            />
          </div>

          {/* UPLOAD IMAGE FIXED BOX */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Gambar Event
            </label>

            <label className="mt-2 relative flex items-center justify-center w-full h-52 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer overflow-hidden group hover:border-indigo-400 transition bg-gray-50">

              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />

              {/* PRIORITAS: FILE BARU */}
              {file ? (
                <>
                  <img
                    src={URL.createObjectURL(file)}
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-sm">
                    Ganti Gambar
                  </div>
                </>
              ) : form.gambar_event ? (
                <>
                  <img
                    src={form.gambar_event}
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
                    Upload gambar
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
              className="px-6 py-2.5 text-sm rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow transition"
            >
              Simpan Perubahan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditEvent;