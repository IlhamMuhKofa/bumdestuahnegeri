"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";

const TambahArtikel = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    judul: "",
    deskripsi_konten: "",
    gambar_konten: "",
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Upload gambar dulu!");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/artikel/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const imageUrl = await handleUpload();
      if (!imageUrl) {
        alert("Upload gagal");
        return;
      }

      const res = await fetch("/api/artikel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          gambar_konten: imageUrl,
        }),
      });

      if (!res.ok) {
        alert("Gagal simpan ke database!");
        return;
      }

      alert("Artikel berhasil ditambahkan!");
      router.push("/admin/artikel");
    } catch (err) {
      console.error("ERROR:", err);
      alert("Terjadi error!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-3xl">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Tambah Artikel
          </h1>
          <p className="text-sm text-gray-500">
            Isi informasi artikel dan unggah gambar utama
          </p>
        </div>

        {/* CARD FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border p-6 space-y-6"
        >
          {/* JUDUL */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Judul Artikel
            </label>
            <input
              type="text"
              name="judul"
              placeholder="Masukkan judul artikel..."
              onChange={handleChange}
              className="mt-2 w-full border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none px-4 py-2.5 rounded-xl text-sm transition"
              required
            />
          </div>

          {/* UPLOAD */}
<div>
  <label className="text-sm font-medium text-gray-700">
    Gambar Artikel
  </label>

  <label className="mt-2 relative flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer overflow-hidden group hover:border-indigo-400 transition bg-gray-50">
    
    {/* INPUT */}
    <input
      type="file"
      onChange={(e) => setFile(e.target.files?.[0] || null)}
      className="hidden"
      required
    />

    {/* JIKA ADA GAMBAR */}
    {file ? (
      <>
        <img
          src={URL.createObjectURL(file)}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* overlay hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white text-xs">
          <span>Ganti Gambar</span>
        </div>
      </>
    ) : (
      <>
        {/* DEFAULT STATE */}
        <div className="flex flex-col items-center justify-center text-gray-400">
          <UploadCloud className="w-6 h-6 mb-2" />
          <span className="text-xs">Klik untuk upload gambar</span>
        </div>
      </>
    )}
  </label>
</div>

          {/* KONTEN */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Isi Artikel
            </label>
            <textarea
              name="deskripsi_konten"
              placeholder="Tulis isi artikel di sini..."
              onChange={handleChange}
              rows={6}
              className="mt-2 w-full border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none px-4 py-3 rounded-xl text-sm transition resize-none"
            />
          </div>

          {/* ACTION */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push("/admin/artikel")}
              className="px-5 py-2.5 text-sm rounded-xl border text-gray-600 hover:bg-gray-100 transition"
            >
              Batal
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 text-sm rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow transition"
            >
              Simpan Artikel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahArtikel;