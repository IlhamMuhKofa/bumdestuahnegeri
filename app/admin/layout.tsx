"use client";

import { useState, ReactNode } from "react";
import { signOut, useSession } from "next-auth/react";
import { useToast } from "@/app/Component/notify/toast";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronRight,
  BookUser,
  CreditCard,
  PiggyBank,
  CalendarDays,
  Images,
  MessageCircle,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import NotifikasiBell from "@/app/Component/NotifikasiBell";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

type Props = {
  children: ReactNode;
};

const navItems = [
  { label: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/admin/dashboard" },
  { label: "Data Nasabah", icon: <BookUser size={18} />, href: "/admin/data_nasabah" },

  {
    label: "Data Pengajuan",
    icon: <FileText size={18} />,
    children: [
      {
        label: "Pinjaman",
        href: "/admin/pinjaman",
        icon: <CreditCard size={16} />,
      },
      {
        label: "Simpanan",
        href: "/admin/simpanan",
        icon: <PiggyBank size={16} />,
      },
    ],
  },

  {
    label: "Manajemen Jadwal",
    icon: <CalendarDays size={18} />,
    children: [
      {
        label: "Jadwal Cicilan",
        href: "/admin/cicilan",

      },
      {
        label: "Jadwal Survey",
        href: "/admin/survey",

      },
    ],
  },

  {
    label: "Data Pembayaran",
    icon: <BarChart3 size={18} />,
    children: [
      {
        label: "Rekap Pembayaran",
        href: "/admin/pembayaran",
        icon: <CreditCard size={16} />,
      },
      {
        label: "Rekening Pembayaran",
        href: "/admin/rekening",
        icon: <PiggyBank size={16} />,
      },
    ],
  },

  { label: "Laporan Transaksi", icon: <BarChart3 size={18} />, href: "/admin/riwayat" },
  { label: "manajemen surat", icon: <FileText size={18} />, href: "/admin/surat" },
  { label: "Manajemen WhatsApp", icon: <MessageCircle size={18} />, href: "/admin/whatsapp" },
  {
    label: "Manajemen Konten",
    icon: <Images size={18} />,
    children: [
      {
        label: "Kelola Event",
        href: "/admin/event",

      },
      {
        label: "Kelola Artikel",
        href: "/admin/artikel",

      },
    ],
  },
  // { label: "Profile Admin", icon: <User size={18} />, href: "/admin/profile" },
  // { label: "Manajemen Admin", icon: <Users size={18} />, href: "/admin/admins" },



  // { label: "Manajemen Jadwal", icon: <CalendarDays size={18} />, href: "/admin/jadwal" },
];

export default function DashboardLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { data: session } = useSession();

  const getPageName = () => {
    if (pathname.includes("dashboard")) return "Dashboard";
    if (pathname.includes("data_nasabah")) return "Data Nasabah";
    if (pathname.includes("pinjaman")) return "Pengajuan Pinjaman";
    if (pathname.includes("simpanan")) return "Pengajuan Simpanan";
    if (pathname.includes("pembayaran")) return "Rekap Pembayaran";
    if (pathname.includes("rekening")) return "Rekening Pembayaran";
    if (pathname.includes("riwayat")) return "Laporan Transaksi";
    if (pathname.includes("profile")) return "Profile Admin";
    if (pathname.includes("admins")) return "Manajemen Admin";
    if (pathname.includes("laporan")) return "Laporan";
    if (pathname.includes("notifikasi")) return "Notifikasi";
    if (pathname.includes("kalender")) return "Manajemen Jadwal";
    if (pathname.includes("event")) return "Manajemen Event";
    if (pathname.includes("artikel")) return "Manajemen Artikel";
    if (pathname.includes("surat")) return "Manajemen Surat";
    if (pathname.includes("whatsapp")) return "Manajemen WhatsApp";
    return "Overview";
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const { push } = useToast();

  async function handleLogout() {
const result = await Swal.fire({
  title: "Keluar?",
  text: "Apakah Anda yakin ingin keluar?",
  icon: "question",
  showCancelButton: true,
  confirmButtonText: "Ya, keluar",
  cancelButtonText: "Batal",
});

if (!result.isConfirmed) return;

toast.info("Sedang keluar...");

setTimeout(() => {
  signOut({ callbackUrl: "/" });
}, 800);

    // push({
    //   type: "info",
    //   message: "Sedang keluar...",
    //   duration: 5000,
    // });

    // // beri sedikit delay biar toast sempat muncul
    // setTimeout(() => {
    //   signOut({
    //     callbackUrl: "/",
    //   });
    // }, 800);
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">

      {/* ───── Sidebar ───── */}
      <aside className={`${sidebarOpen ? "w-64" : "w-0 overflow-hidden"} transition-all duration-300 bg-white border-r border-slate-100 flex flex-col`}>

        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b">
          <Image src="/icon/logo1.png" alt="Logo" width={36} height={36} className="rounded-lg object-cover" />
          <div>
            <p className="text-[11px] font-bold text-slate-800">
              BUMKAMPUNG
            </p>

            <p className="text-[11px] font-bold text-indigo-600">
              TUAH NEGRI
            </p>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-5">
          <p className="text-[10px] font-semibold text-slate-400 uppercase px-3 mb-3">
            Menu Utama
          </p>

          {navItems.map((item, index) => {

            // 🔹 MENU BIASA
            if (!item.children) {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${isActive
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-slate-500 hover:bg-slate-50"
                    }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            }

            // 🔹 DROPDOWN
            const isOpen = openDropdown === item.label;
            const isChildActive = item.children.some((child) =>
              pathname.startsWith(child.href)
            );

            return (
              <div key={index}>
                <button
                  onClick={() =>
                    setOpenDropdown(isOpen ? null : item.label)
                  }
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition ${isChildActive
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-slate-500 hover:bg-slate-50"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {item.label}
                  </div>

                  {/* 🔥 Panah hanya dropdown */}
                  <div className={`transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}>
                    <ChevronRight size={16} />
                  </div>
                </button>

                {/* 🔽 Submenu */}
                <div
                  className={`ml-8 overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40 mt-1" : "max-h-0"
                    }`}
                >
                  <div className="space-y-1">
                    {item.children.map((child, i) => {
                      const active = pathname === child.href;

                      return (
                        <Link
                          key={i}
                          href={child.href}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${active
                            ? "bg-indigo-50 text-indigo-700 font-semibold"
                            : "text-slate-500 hover:bg-slate-50"
                            }`}
                        >
                          <span className="opacity-70">
                          </span>
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Bottom */}
        {/* <div className="px-3 py-4 border-t space-y-1"> */}
        {/* <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-500 hover:bg-slate-50 rounded-xl">
            <Settings size={18} />
            Settings
          </Link> */}

        {/* <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-rose-500 hover:bg-rose-50 rounded-xl w-full"
          >
            <LogOut size={18} />
            Logout
          </button> */}
        {/* </div> */}

        {/* User */}
        <div className="px-4 py-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-rose-500 hover:bg-rose-50 rounded-xl w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ───── Main ───── */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <div>
              <h1 className="text-base font-bold">
                Overview / {getPageName()}
              </h1>
              <p className="text-xs text-slate-400 capitalize">
                {formattedDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NotifikasiBell variant="admin" />

            <div className="relative">

              <Link
                href="/admin/profile"
                className="flex items-center gap-2 hover:bg-slate-100 px-2 py-1 rounded-xl transition"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold">
                  {session?.user?.name?.charAt(0)?.toUpperCase() || "A"}
                </div>

                <div className="hidden sm:block">
                  <p className="text-xs font-semibold">
                    {session?.user?.name || "Administrator"}
                  </p>

                  <p className="text-[10px] text-slate-400">
                    {(session?.user as { role?: string | null })?.role || "Administrator"}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
