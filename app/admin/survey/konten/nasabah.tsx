"use client";

import CardNasabah from "../konten/cardNasabah";

export default function Nasabah({ data }: any) {
  // 🔥 EMPTY STATE
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-10">
        Tidak ada pengajuan pending
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* 🔥 LOOP NASABAH */}
      {data.map((item: any) => (
        <CardNasabah
          key={item.id_anggota}
          item={item}
        />
      ))}

    </div>
  );
}