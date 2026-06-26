'use client';
import React from 'react';

const benefits = [
  'Bisa Diakses dari Rumah',
  'Semua Jadi Lebih Cepat',
  'Catatan Aman & Rapi',
  'Informasi Selalu Update',
];

const Benefit: React.FC = () => {
  return (
    <section className="container mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      {/* Gambar */}
      <div className="flex justify-center mr-12">
        <img
          src="/img/benefit.jpg"
          alt="Ilustrasi Digitalisasi BUMDes"
          className="max-h-auto w-auto object-contain"
        />
      </div>

      {/* Konten */}
      <div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Kenapa Beralih ke Sistem Digital?
        </h2>
        <p className="text-gray-600 text-justify mb-6">
          Digitalisasi layanan BUMDes hadir sebagai solusi untuk mempermudah masyarakat dalam mengakses informasi, berpartisipasi dalam kegiatan ekonomi desa, serta menikmati layanan usaha secara lebih cepat, efisien, dan transparan di era yang serba praktis.
        </p>
        <ul className="space-y-4">
          {benefits.map((item, idx) => (
            <li key={idx} className="flex items-center">
              <span className="w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-3">
                ✓
              </span>
              <span className="text-gray-900 font-bold">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Benefit;