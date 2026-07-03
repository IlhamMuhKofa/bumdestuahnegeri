"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { 
  Menu, 
  X, 
  ChevronDown,
  Home,
  CalendarDays,
  Receipt,
  History,
  User,
  Landmark,
  HandCoins,

} from "lucide-react";
import { FaCircleUser } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import NotifikasiBell from "@/app/Component/NotifikasiBell";

type SessionUserWithImage = {
  image?: string | null;
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pengajuanOpen, setPengajuanOpen] = useState(false);

  const { data } = useSession();

  const avatar = (data?.user as SessionUserWithImage | undefined)?.image;


  return (
    <nav className="bg-[#1a3c2e] text-white relative z-[999]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-2">
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
              href="/nasabah/dashboard"
              className="hover:text-yellow-400 transition-colors">
              Beranda
            </Link>

            {/* ===== DROPDOWN PENGAJUAN ===== */}
            <div
              className="relative"
              onMouseEnter={() => setPengajuanOpen(true)}
              onMouseLeave={() => setPengajuanOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
                Pengajuan
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${pengajuanOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown */}
              <div
                className={`absolute left-0 mt-4 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-[999] transition-all duration-200 origin-top
                ${pengajuanOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"}`}
              >
                {/* Pinjaman */}
                <Link
                  href="/nasabah/pinjaman/"
                  className="group flex items-start gap-4 p-4 rounded-t-2xl bg-white text-gray-800 hover:bg-[#1a3c2e] hover:text-white transition-all duration-200"
                >
                  <div className="w-12 flex items-center justify-center bg-yellow-50 rounded-xl group-hover:scale-105 transition">
                    <Image
                      src="/icon/save.jpeg"
                      alt="Pinjaman"
                      width={28}
                      height={28}
                    />
                  </div>

                  <div>
                    <p className="font-semibold transition-colors duration-200 group-hover:text-white">
                      Pinjaman
                    </p>
                  </div>
                </Link>

                <div className="border-t border-gray-100" />

                {/* Simpanan */}
                <Link
                  href="/nasabah/simpanan"
                  className="group flex items-start gap-4 p-4 rounded-b-2xl bg-white text-gray-800 hover:bg-[#1a3c2e] hover:text-white transition-all duration-200"
                >
                  <div className="w-12 flex items-center justify-center bg-green-50 rounded-xl group-hover:scale-105 transition">
                    <Image
                      src="/icon/save2.jpeg"
                      alt="Simpanan"
                      width={28}
                      height={28}
                    />
                  </div>

                  <div>
                    <p className="font-semibold transition-colors duration-200 group-hover:text-white">
                      Simpanan
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            <Link
              href="/nasabah/event"
              className="hover:text-yellow-400 transition-colors">
              Event
            </Link>

            <Link
              href="/nasabah/cicilan"
              className="hover:text-yellow-400 transition-colors">
              Tagihan & Jadwal
            </Link>

            <Link
              href="/nasabah/riwayat"
              className="hover:text-yellow-400 transition-colors">
              Riwayat
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6 gap-6">
            <NotifikasiBell variant="nasabah" />

            <Link href="/nasabah/profile">
              {avatar ? (
                <div className="h-9 w-9 overflow-hidden rounded-full ">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatar}
                    alt="Foto Profil"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <FaCircleUser size={34} />
              )}
            </Link>
          </div>

          {/* Hamburger Menu (mobile) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-white hover:text-yellow-300"
            >
              {mobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Menu (mobile) */}
{mobileOpen && (
  <div className="md:hidden bg-[#1a3c2e] px-5 pb-6 pt-4 animate-in slide-in-from-top duration-300">

    {/* Card Profile */}
    <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4 mb-5 backdrop-blur-sm">

      {avatar ? (
        <img
          src={avatar}
          className="w-12 h-12 rounded-full object-cover"
          alt=""
        />
      ) : (
        <FaCircleUser size={46} />
      )}

      <div>
        <p className="font-semibold text-white">
          Halo,
        </p>

        <p className="text-sm text-gray-300">
          Selamat Datang
        </p>
      </div>

    </div>

    {/* MENU UTAMA */}

    <div className="space-y-2">

      <Link
        href="/nasabah/dashboard"
        onClick={() => setMobileOpen(false)}
        className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-white/10 transition"
      >
        <Home size={20} />
        Beranda
      </Link>

      <Link
        href="/nasabah/event"
        onClick={() => setMobileOpen(false)}
        className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-white/10 transition"
      >
        <CalendarDays size={20} />
        Event
      </Link>

      <Link
        href="/nasabah/cicilan"
        onClick={() => setMobileOpen(false)}
        className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-white/10 transition"
      >
        <Receipt size={20} />
        Tagihan & Jadwal
      </Link>

      <Link
        href="/nasabah/riwayat"
        onClick={() => setMobileOpen(false)}
        className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-white/10 transition"
      >
        <History size={20} />
        Riwayat
      </Link>

    </div>

    {/* Divider */}

    <div className="my-5 border-t border-white/10"></div>

    {/* Section Pengajuan */}

    <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">
      Pengajuan
    </p>

    <div className="space-y-2">

      <Link
        href="/nasabah/pinjaman"
        onClick={() => setMobileOpen(false)}
        className="flex items-center gap-3 rounded-xl px-4 py-3 bg-white/5 hover:bg-white/10 transition"
      >
        <HandCoins
          size={20}
          className="text-yellow-400"
        />
        Pinjaman
      </Link>

      <Link
        href="/nasabah/simpanan"
        onClick={() => setMobileOpen(false)}
        className="flex items-center gap-3 rounded-xl px-4 py-3 bg-white/5 hover:bg-white/10 transition"
      >
        <Landmark
          size={20}
          className="text-green-400"
        />
        Simpanan
      </Link>

    </div>

    {/* Divider */}

    <div className="my-5 border-t border-white/10"></div>

    {/* Profile */}

    <Link
      href="/nasabah/profile"
      onClick={() => setMobileOpen(false)}
      className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-white/10 transition"
    >
      <User size={20} />
      Profil Saya
    </Link>

  </div>
)}
    </nav>
  );
}
