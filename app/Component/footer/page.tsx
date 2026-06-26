import React from 'react';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaGoogle } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 md:px-16">
        {/* Logo dan Info Perusahaan */}
        <div className="flex flex-col items-center md:items-start mb-6 md:mb-0 md:mr-16">
          <Image src="/icon/logo1.png" alt="Logo" width={150} height={90} />
          <p className="mt-2 text-lg font-semibold">BUMKAMPUNG TUAH NEGERI</p>
          <p className="text-sm md:text-base">Melayani Masyarakat, Membangun Desa</p>
          <div className="flex space-x-6 mt-4">
            <FaGoogle size={28} />
            <FaInstagram size={28} />
            <FaFacebook size={28} />
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-20 text-center md:text-left">
          <div>
            <h3 className="text-lg font-semibold mb-2">LandingPage</h3>
            <ul className="space-y-2 text-sm md:text-base">
              <li><a href="/">Banner</a></li>
              <li><a href="/">Feedback</a></li>
              <li><a href="/">Layanan</a></li>
              <li><a href="/">Berita</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Menu Lainnya</h3>
            <ul className="space-y-2 text-sm md:text-base">
              <li><a href="/MenuUtama/produk">Login</a></li>
              <li><a href="/MenuUtama/Sejarah">Tentang Desa</a></li>
              <li><a href="/MenuUtama/Galeri">Artikel</a></li>
              <li><a href="/MenuUtama/Kontak">Panduan Pinjaman</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white mt-8 pt-4 text-center text-md md:text-sm">
        <p>Hak Cipta © 2025, BUMDes Tuah Negeri. Seluruh Hak cipta dilindungi Undang - undang</p>
      </div>
    </footer>
  );
};

export default Footer;
