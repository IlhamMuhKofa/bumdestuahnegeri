"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Data = {
  id_peminjaman: number;
  id_anggota: number;
  nama: string;
  jumlah: number;
  tenor: number;
  cicilan_ke: number;
  status: "baru" | "aktif" | "telat";
};

const DetailNasabah = () => {
  const { id_anggota } = useParams();
  const router = useRouter();

  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // 🔥 FETCH DATA NASABAH
  // =========================
  useEffect(() => {
    fetch("/api/jadwal")
      .then((res) => res.json())
      .then((res) => {
        const filtered = res.filter(
          (item: Data) => item.id_anggota == Number(id_anggota)
        );
        setData(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id_anggota]);

  const formatRupiah = (num: number) => {
    return "Rp " + num.toLocaleString("id-ID");
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Detail Nasabah
          </h1>
          <p className="text-gray-500 text-sm">
            Daftar pinjaman nasabah
          </p>
        </div>

        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          ← Kembali
        </button>
      </div>

      {/* LIST PINJAMAN */}
      <div className="space-y-4">
        {data.map((item) => {
          const progress = (item.cicilan_ke / item.tenor) * 100;

          return (
            <div
              key={item.id_peminjaman}
              className="bg-white rounded-xl p-5 shadow-sm border flex flex-col md:flex-row justify-between gap-4"
            >
              {/* INFO */}
              <div>
                <p className="font-semibold text-gray-800">
                  {item.nama}
                </p>
                <p className="text-sm text-gray-500">
                  {formatRupiah(item.jumlah)}
                </p>
                <p className="text-xs text-gray-400">
                  Tenor {item.tenor} bulan
                </p>
              </div>

              {/* PROGRESS */}
              <div className="flex-1 md:px-6">
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className={`h-2 rounded-full ${
                      item.status === "telat"
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="text-xs text-center mt-1 text-gray-500">
                  {item.cicilan_ke} / {item.tenor} cicilan
                </p>
              </div>

              {/* BUTTON */}
              <div className="flex items-center gap-2">
                {item.status === "baru" && (
                  <button
                    onClick={() =>
                      router.push(
                        `/admin/jadwal/${id_anggota}/${item.id_peminjaman}`
                      )
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Buat Jadwal
                  </button>
                )}

                {item.status === "aktif" && (
                  <button
                    onClick={() =>
                      router.push(
                        `/admin/jadwal/${id_anggota}/${item.id_peminjaman}`
                      )
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Detail
                  </button>
                )}

                {item.status === "telat" && (
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Hubungi
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* EMPTY */}
      {data.length === 0 && (
        <div className="text-center text-gray-400 mt-10">
          Tidak ada data pinjaman
        </div>
      )}
    </div>
  );
};

export default DetailNasabah;