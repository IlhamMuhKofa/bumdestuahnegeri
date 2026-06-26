"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-green-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Nama */}
          <div className="flex items-center space-x-2">
            <Image
              src="/icon/logo1.png" // ganti dengan logo kamu
              alt="Logo"
              width={60}
              height={60}
              className="rounded"
            />
            <span className="font-bold text-sm sm:text-base">
              BUMKAMPUNG TUAH NEGERI
            </span>
          </div>

          {/* Menu besar (desktop) */}
          <div className="hidden md:flex items-center space-x-6 gap-4 font-medium">
            <Link
              href="/"
              className="hover:text-yellow-300 transition-colors">
              Beranda
            </Link>

            <Link
              href="/profil"
              className="hover:text-yellow-300 transition-colors">
              Tentang Desa
            </Link>

            <Link
              href="/artikel"
              className="hover:text-yellow-300 transition-colors">
              Artikel
            </Link>

            <Link
              href="/panduan"
              className="hover:text-yellow-300 transition-colors">
              Panduan Pinjaman
            </Link>

            {/* Tombol Login */}
            <Link
              href="/login"
              className="ml-4 bg-yellow-500 text-white-80 font-medium px-8 py-2 rounded-full hover:bg-yellow-600 transition-transform transform hover:scale-105"
            >
              Login
            </Link>
          </div>

          {/* Hamburger Menu (mobile) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-yellow-300"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Menu (mobile) */}
      {isOpen && (
        <div className="md:hidden bg-green-800 px-4 py-3 space-y-3">
          <Link
            href="/"
            className="block hover:text-yellow-300 font-semibold"
            onClick={() => setIsOpen(false)}
          >
            Beranda
          </Link>
          <Link
            href="/profil"
            className="block hover:text-yellow-300 font-semibold"
            onClick={() => setIsOpen(false)}
          >
            Tentang Desa
          </Link>
          <Link
            href="/artikel"
            className="block hover:text-yellow-300 font-semibold"
            onClick={() => setIsOpen(false)}
          >
            Artikel
          </Link>
          <Link
            href="/panduan"
            className="block hover:text-yellow-300 font-semibold"
            onClick={() => setIsOpen(false)}
          >
            Panduan Pinjaman
          </Link>
          <Link
            href="/login"
            className="block bg-yellow-500 text-green-900 text-center font-bold px-4 py-2 rounded-full hover:bg-yellow-400 transition-transform transform hover:scale-105"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
