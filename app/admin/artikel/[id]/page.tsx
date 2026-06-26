"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Calendar } from "lucide-react";

type Article = {
  id_artikel: number;
  judul: string;
  deskripsi_konten: string;
  gambar_konten: string;
  tanggal_publish: string;
};

const DetailArtikel = () => {
  const { id } = useParams() as { id: string };
  const [data, setData] = useState<Article | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/artikel/${id}`)
      .then((res) => res.json())
      .then((res) => setData(res));
  }, [id]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!data) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-6">

        <div className="rounded-2xl overflow-hidden shadow mb-6">
          <img
            src={data.gambar_konten}
            className="w-full h-[400px] object-cover"
          />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          {data.judul}
        </h1>

        <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
          <Calendar className="w-4 h-4" />
          {formatDate(data.tanggal_publish)}
        </div>

        <div className="prose max-w-none text-gray-700 leading-relaxed">
          {data.deskripsi_konten}
        </div>
      </div>
    </div>
  );
};

export default DetailArtikel;