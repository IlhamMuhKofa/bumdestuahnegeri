'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Banner: React.FC = () => {
  const router = useRouter();

  return (
    <div className="relative h-[88vh] w-full">
      {/* Background gambar desktop */}
      <Image
        src="/img/banner2.jpg"
        alt="Banner Desktop"
        fill
        priority
        className="hidden md:block object-cover object-center"
      />

      {/* Background gambar mobile */}
      <Image
        src="/img/baner3.png"
        alt="Banner Mobile"
        fill
        priority
        className="block md:hidden object-cover object-center"
      />

      {/* Overlay konten */}
      <div className="absolute inset-0 flex flex-col items-start justify-center text-white py-20 md:py-32 px-8 md:px-16">
        <h1 className="text-4xl font-bold md:text-4xl sm:text-3xl -translate-y-20">
          Selamat datang di BUMDES Tuah Negeri <br />
          Desa Pinang Sebatang Barat
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-lg -translate-y-20 text-justify">
          Sekarang Anda dapat dengan mudah dan cepat mengakses berbagai layanan
          usaha BUMDes langsung dari perangkat Anda.
        </p>
        <button
          className="mt-6 px-6 py-3 text-lg font-medium bg-yellow-500 hover:bg-yellow-600 rounded-md transition -translate-y-20"
          onClick={() => router.push('/register')}
        >
          Daftar Anggota
        </button>
      </div>
    </div>
  );
};

export default Banner;
