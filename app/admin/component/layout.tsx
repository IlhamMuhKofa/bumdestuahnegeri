// "use client";

// import { useState, ReactNode } from "react";
// import {
//   LayoutDashboard,
//   FileText,
//   Wallet,
//   BarChart3,
//   Settings,
//   LogOut,
//   Bell,
//   Menu,
//   X,
//   ChevronRight,
// } from "lucide-react";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import Image from "next/image";

// type Props = {
//   children: ReactNode;
// };

// const navItems = [
//   { label: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/admin/dashboard" },
//   { label: "Data Pengajuan", icon: <FileText size={18} />, href: "/admin/pengajuan" },
//   { label: "Data Simpanan", icon: <Wallet size={18} />, href: "/admin/simpanan" },
//   { label: "Laporan", icon: <BarChart3 size={18} />, href: "/admin/laporan" },
// ];

// export default function DashboardLayout({ children }: Props) {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const pathname = usePathname();

//   // 🔥 Ambil nama halaman dari URL
//   const getPageName = () => {
//     if (pathname.includes("dashboard")) return "Dashboard";
//     if (pathname.includes("pengajuan")) return "Data Pengajuan";
//     if (pathname.includes("simpanan")) return "Data Simpanan";
//     if (pathname.includes("laporan")) return "Laporan";
//     if (pathname.includes("notifikasi")) return "Notifikasi";
//     return "Overview";
//   };

//   // 🔥 Format tanggal otomatis
//   const today = new Date();
//   const formattedDate = today.toLocaleDateString("id-ID", {
//     weekday: "long",
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   });

//   return (
//     <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">

//       {/* ───── Sidebar ───── */}
//       <aside
//         className={`${
//           sidebarOpen ? "w-64" : "w-0 overflow-hidden"
//         } transition-all duration-300 bg-white border-r border-slate-100 flex flex-col`}
//       >
//         {/* Logo (CUSTOM IMAGE) */}
//         <div className="h-16 flex items-center gap-3 px-5 border-b">
//           <Image
//             src="/icon/logo1.png" // 🔥 ganti dengan logo kamu
//             alt="Logo"
//             width={36}
//             height={36}
//             className="rounded-lg object-cover"
//           />
//           <div>
//             <p className="text-[11px] font-bold text-slate-800">BUMKAMPUNG</p>
//             <p className="text-[11px] font-bold text-indigo-600">TUAH NEGRI</p>
//           </div>
//         </div>

//         {/* Menu */}
//         <nav className="flex-1 px-3 py-5">
//           <p className="text-[10px] font-semibold text-slate-400 uppercase px-3 mb-3">
//             Menu Utama
//           </p>

//           {navItems.map((item) => {
//             const isActive = pathname === item.href;

//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
//                   isActive
//                     ? "bg-indigo-50 text-indigo-700 font-semibold"
//                     : "text-slate-500 hover:bg-slate-50"
//                 }`}
//               >
//                 {item.icon}
//                 {item.label}
//                 {isActive && <ChevronRight size={14} className="ml-auto" />}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Bottom */}
//         <div className="px-3 py-4 border-t space-y-1">
//           <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-500 hover:bg-slate-50 rounded-xl">
//             <Settings size={18} />
//             Settings
//           </Link>
//           <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-sm text-rose-500 hover:bg-rose-50 rounded-xl">
//             <LogOut size={18} />
//             Logout
//           </Link>
//         </div>

//         {/* User */}
//         <div className="px-4 py-4 border-t">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold">
//               AD
//             </div>
//             <div>
//               <p className="text-sm font-semibold">Admin Default</p>
//               <p className="text-xs text-slate-400">admin@email.com</p>
//             </div>
//           </div>
//         </div>
//       </aside>

//       {/* ───── Main ───── */}
//       <div className="flex-1 flex flex-col">

//         {/* Header */}
//         <header className="h-16 bg-white border-b flex items-center justify-between px-6">
//           <div className="flex items-center gap-4">
//             <button onClick={() => setSidebarOpen(!sidebarOpen)}>
//               {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
//             </button>

//             <div>
//               <h1 className="text-base font-bold">
//                 Overview / {getPageName()}
//               </h1>
//               <p className="text-xs text-slate-400 capitalize">
//                 {formattedDate}
//               </p>
//             </div>
//           </div>

//           {/* Right */}
//           <div className="flex items-center gap-3">

//             {/* 🔥 Notif jadi LINK */}
//             <Link
//               href="/admin/notifikasi"
//               className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100"
//             >
//               <Bell size={18} />
//               <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
//             </Link>

//             {/* User */}
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold">
//                 AD
//               </div>
//               <div className="hidden sm:block">
//                 <p className="text-xs font-semibold">Admin Default</p>
//                 <p className="text-[10px] text-slate-400">Administrator</p>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Content */}
//         <main className="flex-1 overflow-y-auto p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }