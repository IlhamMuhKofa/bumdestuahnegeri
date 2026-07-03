"use client";
import React, { useEffect, useState } from "react";
import { Calendar, ArrowRight, TrendingUp, Clock } from "lucide-react";

type Article = {
  id_artikel: number;
  judul: string;
  deskripsi_konten: string;
  gambar_konten: string;
  tanggal_publish: string;
  status: string;
};

const HomeBerita = () => {
  const [featured, setFeatured] = useState<Article | null>(null);

  useEffect(() => {
    fetch("/api/artikel")
      .then((res) => res.json())
      .then((data: Article[]) => {
        const sorted = data.sort(
          (a, b) =>
            new Date(b.tanggal_publish).getTime() -
            new Date(a.tanggal_publish).getTime()
        );

        const featuredArticle = sorted.find(
          (a) => a.status === "featured"
        );

        setFeatured(featuredArticle || null);
      });
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // 🔥 SAFETY
  if (!featured) return null;

  return (
    <section className="relative py-16 overflow-hidden">
      {/* background tetap */}

      <div className="container mx-auto px-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">
                Highlight
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Berita Terbaru
            </h2>
          </div>

          <a
            href="/artikel"
            className="group flex items-center gap-2 mt-4 md:mt-0 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300"
          >
            Lihat Semua
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* 🔥 FEATURED CARD (DINAMIS) */}
        <div className="group relative bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.015]">

          {/* DECORATION */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-teal-400/20 to-transparent rounded-tr-full" />

          <div className="relative flex flex-col md:flex-row items-center">

            {/* 🔥 TEXT */}
            <div className="flex-1 p-8 md:p-10 order-2 md:order-1">

              {/* TITLE (FIX SIZE 🔥) */}
              <h3 className="
        text-xl 
        md:text-2xl 
        font-bold 
        text-gray-800 
        mb-4 
        leading-snug 
        group-hover:text-emerald-600 
        transition
      ">
                {featured.judul}
              </h3>

              {/* DATE */}
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium">
                    {formatDate(featured.tanggal_publish)}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium">
                    2 min read
                  </span>
                </div>
              </div>

              {/* DESC */}
              <p className="text-gray-600 text-base mb-6 leading-relaxed max-w-xl">
                {featured.deskripsi_konten.slice(0, 120)}...
              </p>

              {/* CTA */}
              <a
                href={`/artikel/${featured.id_artikel}`}
                className="group/btn inline-flex items-center gap-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-gray-800 font-semibold px-7 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Baca Selengkapnya
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </a>

              {/* TAG */}
              <div className="flex flex-wrap gap-2 mt-6">
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                  #Ekonomi
                </span>
                <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-semibold">
                  #Pertanian
                </span>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                  #BUMDes
                </span>
              </div>
            </div>

            {/* 🔥 IMAGE */}
            <div className="relative md:w-[45%] w-full order-1 md:order-2">
              <div className="relative overflow-hidden rounded-t-3xl md:rounded-l-none md:rounded-r-3xl h-[260px] md:h-[440px]">

                <img
                  src={featured.gambar_konten}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-white via-transparent to-transparent opacity-60" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default HomeBerita;