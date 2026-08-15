import React from "react";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaGoogle } from "react-icons/fa";

// Dashboard / Global Footer Variant V1:
// headings 16px • links/body 14px • copyright 12px • section spacing 28px+
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 sm:py-9">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8 px-4 md:px-10 lg:px-12">

        {/* Logo dan Info Perusahaan */}
        <div className="flex flex-col items-center md:items-start md:mr-10">

          <div className="flex items-center gap-3">
            <Image
              src="/icon/logo1.png"
              alt="Logo"
              width={95}
              height={56}
              className="object-contain"
            />

            <div>
              <p className="text-sm font-semibold tracking-tight">
                BUMKAMPUNG TUAH NEGERI
              </p>

              <p className="text-sm leading-relaxed text-gray-300">
                Melayani Masyarakat, Membangun Desa
              </p>
            </div>
          </div>

          {/* Social Media */}
          <div className="mt-4 flex gap-4">
            <FaGoogle size={18} />
            <FaInstagram size={18} />
            <FaFacebook size={18} />
          </div>

        </div>

        {/* Links */}
        <div className="flex gap-12 md:gap-20 text-center md:text-left">

          <div>
            <h3 className="mb-2 text-base font-semibold">
              LandingPage
            </h3>

            <ul className="space-y-1.5 text-sm text-gray-300">
              <li>
                <a href="/" className="hover:text-white transition">
                  Banner
                </a>
              </li>

              <li>
                <a href="/" className="hover:text-white transition">
                  Feedback
                </a>
              </li>

              <li>
                <a href="/" className="hover:text-white transition">
                  Layanan
                </a>
              </li>

              <li>
                <a href="/" className="hover:text-white transition">
                  Berita
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-base font-semibold">
              Menu Lainnya
            </h3>

            <ul className="space-y-1.5 text-sm text-gray-300">
              <li>
                <a
                  href="/MenuUtama/produk"
                  className="hover:text-white transition"
                >
                  Login
                </a>
              </li>

              <li>
                <a
                  href="/MenuUtama/Sejarah"
                  className="hover:text-white transition"
                >
                  Tentang Desa
                </a>
              </li>

              <li>
                <a
                  href="/MenuUtama/Galeri"
                  className="hover:text-white transition"
                >
                  Artikel
                </a>
              </li>

              <li>
                <a
                  href="/MenuUtama/Kontak"
                  className="hover:text-white transition"
                >
                  Panduan Pinjaman
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="mt-7 border-t border-gray-600 px-4 pt-4 text-center">
        <p className="text-xs leading-relaxed text-gray-400">
          Hak Cipta © 2025, BUMDes Tuah Negeri. Seluruh Hak cipta dilindungi
          Undang - undang
        </p>
      </div>
    </footer>
  );
};

export default Footer;