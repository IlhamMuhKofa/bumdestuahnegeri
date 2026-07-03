"use client";

import React, { useEffect, useState } from "react";
import { Calendar, TrendingUp, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

type Article = {
  id_artikel: number;
  judul: string;
  deskripsi_konten: string;
  gambar_konten: string;
  tanggal_publish: string;
  status: string;
};

const Artikel = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/artikel")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort(
          (a: Article, b: Article) =>
            new Date(b.tanggal_publish).getTime() -
            new Date(a.tanggal_publish).getTime()
        );
        setArticles(sorted);
      });
  }, []);

  // ===== FORMAT TANGGAL =====
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ===== SPLIT DATA =====
  const featured = articles.find((a) => a.status === "featured");

  const nonFeatured = articles.filter(
    (a) =>
      a.status === "published" &&
      a.id_artikel !== featured?.id_artikel
  );

  const sideArticles = nonFeatured.slice(0, 3);
  const listArticles = nonFeatured.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto px-8 py-8 md:py-12">

        {/* HEADER */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600 uppercase">
              Berita Terkini
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Portal Berita</h1>
          <p className="text-gray-600">
            Informasi terbaru dari Kampung
          </p>
        </div>

        {/* FEATURED */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            {featured && (
              <div
                onClick={() => router.push(`/artikel/${featured.id_artikel}`)}
                className="relative rounded-2xl overflow-hidden shadow-xl h-[400px] cursor-pointer"
              >
                <img
                  src={featured.gambar_konten}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 p-6 text-white bg-gradient-to-t from-black w-full">
                  <h2 className="text-2xl font-bold">
                    {featured.judul}
                  </h2>
                  <p className="text-sm mt-2">
                    {featured.deskripsi_konten.slice(0, 100)}...
                  </p>
                  <div className="flex items-center gap-2 text-sm mt-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(featured.tanggal_publish)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SIDE */}
          <div className="flex flex-col gap-4">
            {sideArticles.map((item) => (
              <div
                key={item.id_artikel}
                onClick={() => router.push(`/artikel/${item.id_artikel}`)}
                className="flex gap-3 bg-white p-3 rounded-xl shadow cursor-pointer"
              >
                <img
                  src={item.gambar_konten}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="text-sm font-semibold mb-2">{item.judul}</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    {item.deskripsi_konten.slice(0, 40)}...
                  </p>
                  <div className="text-xs text-gray-500 flex gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(item.tanggal_publish)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HEADER */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Berita Lainnya</h1>
          <p className="text-gray-600">
            Jangan lewatkan kabar menarik dan informasi penting lainnya
          </p>
        </div>

        {/* LIST */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listArticles.map((item, idx) => (
            <div
              key={item.id_artikel}
              onClick={() => router.push(`/artikel/${item.id_artikel}`)}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="bg-white rounded-xl shadow hover:shadow-xl overflow-hidden cursor-pointer"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={item.gambar_konten}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-sm mb-2">
                  {item.judul}
                </h4>
                <div className="text-xs text-gray-500 mb-3">
                  {item.deskripsi_konten.slice(0, 60)}...
                </div>
                <div className="text-xs text-gray-500 flex gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(item.tanggal_publish)}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Artikel;