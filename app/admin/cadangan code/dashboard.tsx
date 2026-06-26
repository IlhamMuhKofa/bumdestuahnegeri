"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Wallet,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  Users,
  ArrowUpRight,
  ChevronRight,
  Circle,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type NavItem = {
  label: string;
  icon: React.ReactNode;
  key: string;
};

type StatCard = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  color: string;
  iconColor: string;
  icon: React.ReactNode;
};

type Transaction = {
  id: string;
  name: string;
  type: string;
  date: string;
  amount: string;
  status: "Sukses" | "Pending" | "Gagal";
};

// ─── Data ────────────────────────────────────────────────────────────────────
const navItems: NavItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard size={18} />, key: "dashboard" },
  { label: "Data Pengajuan", icon: <FileText size={18} />, key: "pengajuan" },
  { label: "Data Simpanan", icon: <Wallet size={18} />, key: "simpanan" },
  { label: "Laporan Transaksi", icon: <BarChart3 size={18} />, key: "laporan" },
];

const stats: StatCard[] = [
  {
    label: "Total Simpanan",
    value: "Rp 128,4 Jt",
    change: "+12.5%",
    trend: "up",
    color: "bg-emerald-50",
    iconColor: "text-emerald-600",
    icon: <Wallet size={20} />,
  },
  {
    label: "Total Pengajuan",
    value: "Rp 74,2 Jt",
    change: "+8.1%",
    trend: "up",
    color: "bg-blue-50",
    iconColor: "text-blue-600",
    icon: <FileText size={20} />,
  },
  {
    label: "Anggota Aktif",
    value: "248",
    change: "+4 baru",
    trend: "up",
    color: "bg-violet-50",
    iconColor: "text-violet-600",
    icon: <Users size={20} />,
  },
  {
    label: "Transaksi Bulan Ini",
    value: "342",
    change: "-3.2%",
    trend: "down",
    color: "bg-amber-50",
    iconColor: "text-amber-600",
    icon: <BarChart3 size={20} />,
  },
];

const transactions: Transaction[] = [
  { id: "TRX001", name: "Ahmad Fauzi", type: "Simpanan Pokok", date: "17 Apr 2026", amount: "Rp 500.000", status: "Sukses" },
  { id: "TRX002", name: "Siti Rahayu", type: "Pengajuan Pinjaman", date: "17 Apr 2026", amount: "Rp 2.000.000", status: "Pending" },
  { id: "TRX003", name: "Budi Santoso", type: "Simpanan Wajib", date: "16 Apr 2026", amount: "Rp 150.000", status: "Sukses" },
  { id: "TRX004", name: "Dewi Lestari", type: "Angsuran Pinjaman", date: "16 Apr 2026", amount: "Rp 350.000", status: "Sukses" },
  { id: "TRX005", name: "Hendra Wijaya", type: "Pengajuan Pinjaman", date: "15 Apr 2026", amount: "Rp 5.000.000", status: "Gagal" },
  { id: "TRX006", name: "Rina Marlina", type: "Simpanan Sukarela", date: "15 Apr 2026", amount: "Rp 200.000", status: "Sukses" },
];

const statusStyle: Record<string, string> = {
  Sukses: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Gagal: "bg-red-100 text-red-700",
};

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────
const bars = [40, 65, 50, 80, 70, 90, 60, 85, 75, 95, 88, 72];
const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];

function BarChart() {
  return (
    <div className="flex items-end gap-1.5 h-32 w-full">
      {bars.map((h, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <div
            className="w-full rounded-t-md transition-all duration-300 group-hover:opacity-80"
            style={{
              height: `${h}%`,
              background: i === 11 ? "#6366f1" : "#e0e7ff",
            }}
          />
          <span className="text-[9px] text-slate-400">{months[i]}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Donut Chart (SVG) ────────────────────────────────────────────────────────
function DonutChart() {
  const segments = [
    { value: 48, color: "#6366f1", label: "Simpanan Pokok" },
    { value: 30, color: "#10b981", label: "Simpanan Wajib" },
    { value: 22, color: "#f59e0b", label: "Simpanan Sukarela" },
  ];
  const r = 40;
  const cx = 60;
  const cy = 60;
  let cumulative = 0;
  const total = segments.reduce((s, seg) => s + seg.value, 0);

  const paths = segments.map((seg) => {
    const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    cumulative += seg.value;
    const endAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = seg.value / total > 0.5 ? 1 : 0;
    return { d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`, color: seg.color, label: seg.label, value: seg.value };
  });

  return (
    <div className="flex items-center gap-6">
      <svg width={120} height={120} viewBox="0 0 120 120">
        {paths.map((p, i) => (
          <path key={i} d={p.d} fill={p.color} stroke="white" strokeWidth={2} />
        ))}
        <circle cx={cx} cy={cy} r={24} fill="white" />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="9" fill="#64748b">Total</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="10" fontWeight="600" fill="#1e293b">100%</text>
      </svg>
      <div className="flex flex-col gap-2">
        {paths.map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
            <span className="text-slate-600 text-xs">{p.label}</span>
            <span className="ml-auto font-semibold text-xs text-slate-800">{p.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Dashboard Component ─────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">

      {/* ── Sidebar ── */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0 overflow-hidden"
        } transition-all duration-300 bg-white border-r border-slate-100 flex flex-col shrink-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">BK</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-800 leading-tight">BUMKAMPUNG</p>
            <p className="text-[11px] font-bold text-indigo-600 leading-tight">TUAH NEGRI</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-3">Menu Utama</p>
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveNav(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group ${
                activeNav === item.key
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <span className={activeNav === item.key ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}>
                {item.icon}
              </span>
              {item.label}
              {activeNav === item.key && (
                <ChevronRight size={14} className="ml-auto text-indigo-400" />
              )}
            </button>
          ))}
        </nav>

        {/* Bottom Nav */}
        <div className="px-3 py-4 border-t border-slate-100 space-y-0.5">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all">
            <Settings size={18} className="text-slate-400" />
            Settings
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-500 hover:bg-rose-50 transition-all">
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* User */}
        <div className="px-4 py-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold shrink-0">
              AD
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">Admin Default</p>
              <p className="text-xs text-slate-400 truncate">admin@email.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-800">Overview</h1>
              <p className="text-xs text-slate-400">Jumat, 17 April 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 transition-all"
            >
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
            {notifOpen && (
              <div className="absolute top-12 right-0 w-72 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-4">
                <p className="text-sm font-semibold text-slate-800 mb-3">Notifikasi</p>
                {["Pengajuan baru dari Siti Rahayu", "Laporan bulanan siap diunduh", "3 anggota baru mendaftar"].map((n, i) => (
                  <div key={i} className="flex gap-3 py-2.5 border-b border-slate-50 last:border-0">
                    <Circle size={8} className="text-indigo-500 mt-1.5 shrink-0" fill="currentColor" />
                    <p className="text-xs text-slate-600">{n}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2.5 pl-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
                AD
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-700">Admin Default</p>
                <p className="text-[10px] text-slate-400">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">

          {/* Welcome Banner */}
          <div className="relative bg-indigo-600 rounded-2xl p-6 mb-6 overflow-hidden">
            <div className="absolute right-0 top-0 w-48 h-full opacity-10">
              <div className="w-48 h-48 rounded-full bg-white absolute -top-10 -right-10" />
              <div className="w-32 h-32 rounded-full bg-white absolute top-10 right-20" />
            </div>
            <p className="text-indigo-200 text-sm mb-1">Halo, selamat datang kembali 👋</p>
            <h2 className="text-white text-xl font-bold">Admin Default</h2>
            <p className="text-indigo-200 text-sm mt-1">Semoga harimu produktif dan menyenangkan!</p>
            <div className="mt-4 flex gap-3">
              <button className="px-4 py-2 bg-white text-indigo-700 text-xs font-semibold rounded-xl hover:bg-indigo-50 transition-all">
                Buat Laporan
              </button>
              <button className="px-4 py-2 bg-indigo-700 text-white text-xs font-semibold rounded-xl hover:bg-indigo-800 transition-all">
                Lihat Pengajuan
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center ${s.iconColor}`}>
                    {s.icon}
                  </div>
                  <span
                    className={`flex items-center gap-1 text-xs font-semibold ${
                      s.trend === "up" ? "text-emerald-600" : "text-rose-500"
                    }`}
                  >
                    {s.trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {s.change}
                  </span>
                </div>
                <p className="text-xl font-bold text-slate-800">{s.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
            {/* Bar Chart */}
            <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Tren Simpanan</h3>
                  <p className="text-xs text-slate-400">Januari – Desember 2026</p>
                </div>
                <button className="text-xs text-indigo-600 font-semibold flex items-center gap-1 hover:underline">
                  Detail <ArrowUpRight size={12} />
                </button>
              </div>
              <BarChart />
            </div>

            {/* Donut Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-100">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-800">Komposisi Simpanan</h3>
                <p className="text-xs text-slate-400">Berdasarkan jenis</p>
              </div>
              <DonutChart />
            </div>
          </div>

          {/* Transaction Table */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Transaksi Terbaru</h3>
                <p className="text-xs text-slate-400">6 transaksi terakhir</p>
              </div>
              <button className="text-xs text-indigo-600 font-semibold flex items-center gap-1 hover:underline">
                Lihat semua <ArrowUpRight size={12} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">ID</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Nama</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Jenis</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Tanggal</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Jumlah</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, i) => (
                    <tr key={i} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 text-xs text-slate-400 font-mono">{tx.id}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-[10px] font-bold shrink-0">
                            {tx.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <span className="text-sm font-medium text-slate-700">{tx.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-500">{tx.type}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-400">{tx.date}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-slate-700 text-right">{tx.amount}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle[tx.status]}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}