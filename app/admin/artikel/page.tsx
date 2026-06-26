"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Star, Pencil, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

type Article = {
  id_artikel: number;
  judul: string;
  deskripsi_konten: string;
  gambar_konten: string;
  tanggal_publish: string;
  status: string;
};

const AdminArtikel = () => {
  const router = useRouter();

  const [articles, setArticles] = useState<Article[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    fetch("/api/artikel")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a: Article, b: Article) => {
          if (a.status === "featured" && b.status !== "featured") return -1;
          if (a.status !== "featured" && b.status === "featured") return 1;

          return (
            new Date(b.tanggal_publish).getTime() -
            new Date(a.tanggal_publish).getTime()
          );
        });

        setArticles(sorted);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: number) => {
    await fetch("/api/artikel", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    setArticles((prev) => prev.filter((a) => a.id_artikel !== id));
  };

  const handleFeature = async (id: number) => {
    await fetch("/api/artikel", {
      method: "PATCH",
      body: JSON.stringify({ id }),
    });

    setArticles((prev) =>
      prev.map((a) => ({
        ...a,
        status: a.id_artikel === id ? "featured" : "published",
      }))
    );
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/artikel/edit/${id}`);
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const bulan = [
      "Januari","Februari","Maret","April","Mei","Juni",
      "Juli","Agustus","September","Oktober","November","Desember"
    ];

    return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="p-6 text-gray-500 animate-pulse">
        Memuat artikel...
      </div>
    );
  }

  const featured = articles.filter((a) => a.status === "featured");
  const regular = articles.filter((a) => a.status !== "featured");

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ================= BANNER ================= */}
      <div className="bg-white border-b rounded-2xl">
        <div className="max-w-7xl mx-auto px-6 py-6">

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Manajemen Artikel
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Kelola artikel, edit, hapus, atau tandai sebagai utama
              </p>
            </div>

            <button
              onClick={() => router.push("/admin/artikel/tambah")}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              <Plus size={16} />
              Tambah Artikel
            </button>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto py-6">
        <div className="bg-white rounded-2xl shadow-sm border p-6">

          {/* ================= FEATURED ================= */}
          {featured.length > 0 && (
            <div className="mb-10">
              <h2 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
                <Star size={16} className="text-yellow-500" />
                Artikel Utama
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featured.map((item) => (
                  <div
                    key={item.id_artikel}
                    className="group bg-white rounded-2xl border-2 border-yellow-300 shadow-md overflow-hidden"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.gambar_konten}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />

                      <div className="absolute top-3 left-3 bg-yellow-400 text-white text-xs px-3 py-1 rounded-full">
                        Utama
                      </div>
                    </div>

                    <div className="p-5 flex flex-col">
                      <h3 className="font-semibold text-sm text-gray-800 line-clamp-2">
                        {item.judul}
                      </h3>

                      <p className="text-xs text-gray-500 line-clamp-2 mt-2 mb-3">
                        {item.deskripsi_konten}
                      </p>

                      <p className="text-xs text-gray-400 mb-4">
                        <Calendar size={12} className="inline mr-1" />
                        {formatDate(item.tanggal_publish)}
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item.id_artikel)}
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
                          onClick={() => handleDelete(item.id_artikel)}
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

          {/* ================= SEMUA ARTIKEL ================= */}
          <div>
            <h2 className="text-sm font-semibold text-gray-600 mb-4">
              Semua Artikel
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {regular.map((item) => (
                <div
                  key={item.id_artikel}
                  className="group bg-white rounded-2xl border shadow-sm hover:shadow-lg overflow-hidden flex flex-col"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={item.gambar_konten}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div>
                      <h3 className="font-semibold text-sm text-gray-800 line-clamp-2 h-[40px]">
                        {item.judul}
                      </h3>

                      <p className="text-xs text-gray-500 line-clamp-2 h-[32px] mt-2 mb-3">
                        {item.deskripsi_konten}
                      </p>

                      <p className="text-xs text-gray-400 mb-4">
                        <Calendar size={12} className="inline mr-1" />
                        {formatDate(item.tanggal_publish)}
                      </p>
                    </div>

                    <div className="mt-auto">
                      <div className="flex gap-2">

  {/* EDIT */}
  <button
    onClick={() => handleEdit(item.id_artikel)}
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

  {/* HAPUS */}
  <button
    onClick={() => handleDelete(item.id_artikel)}
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

{/* JADIKAN UTAMA */}
<button
  onClick={() => handleFeature(item.id_artikel)}
  className="
    mt-3 w-full text-xs font-semibold
    bg-green-600
    hover:bg-green-700
    text-white
    py-2 rounded-lg
    transition-all duration-200
    shadow-sm hover:shadow-md
    hover:-translate-y-[1px]
  "
>
  Jadikan Utama
</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminArtikel;