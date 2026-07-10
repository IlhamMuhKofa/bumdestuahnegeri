"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";
import { toast } from "react-toastify";

const EditArtikel = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    judul: "",
    deskripsi_konten: "",
    gambar_konten: "",
  });

  // ambil data lama
  useEffect(() => {
    fetch(`/api/artikel/${id}`)
      .then((res) => res.json())
      .then((data) => setForm(data));
  }, [id]);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpload = async () => {
  if (!file) return form.gambar_konten;

  const formData = new FormData();
  formData.append("file", file);

  formData.append("folder", "artikel");

  const res = await fetch("/api/upload/image", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Gagal upload gambar");
  }

  return data.url;
};

const handleSubmit = async (e: any) => {
  e.preventDefault();

  if (loading) return;

  try {
    setLoading(true);

    const imageUrl = await handleUpload();

    const res = await fetch(`/api/artikel/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        gambar_konten: imageUrl,
      }),
    });

    if (!res.ok) {
      throw new Error("Gagal memperbarui artikel");
    }

    toast.success("Artikel berhasil diperbarui!");

    router.push("/admin/artikel");

  } catch (err: any) {
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
};

  // preview prioritas: file baru → fallback ke gambar lama
  const previewImage = file
    ? URL.createObjectURL(file)
    : form.gambar_konten;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-3xl">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Edit Artikel
          </h1>
          <p className="text-sm text-gray-500">
            Perbarui informasi artikel
          </p>
        </div>

        {/* FORM */}
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
              value={form.judul}
              onChange={handleChange}
              className="mt-2 w-full border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none px-4 py-2.5 rounded-xl text-sm transition"
            />
          </div>

          {/* UPLOAD + PREVIEW DALAM 1 BOX */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Gambar Artikel
            </label>

            <label className="mt-2 relative flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer overflow-hidden group hover:border-indigo-400 transition bg-gray-50">
              
              {/* INPUT FILE */}
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />

              {/* PREVIEW (file baru / lama) */}
              {previewImage ? (
                <>
                  <img
                    src={previewImage}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs">
                    Ganti Gambar
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <UploadCloud className="w-6 h-6 mb-2" />
                  <span className="text-xs">Klik untuk upload gambar</span>
                </div>
              )}
            </label>

            {/* INPUT URL (tetap dipertahankan karena logic kamu pakai ini) */}
          </div>

          {/* KONTEN */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Isi Artikel
            </label>
            <textarea
              name="deskripsi_konten"
              value={form.deskripsi_konten}
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
  disabled={loading}
  className="px-6 py-2.5 text-sm rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow transition disabled:opacity-50"
>
  {loading
    ? "Menyimpan..."
    : "Update Artikel"}
</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditArtikel;