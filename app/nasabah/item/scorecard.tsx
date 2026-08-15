"use client";

import {
  Wallet,
  GraduationCap,
  FileText,
} from "lucide-react";

type ScoreCardProps = {
  title: string;
  value: string;
  description: string;
  badge: string;
  icon: React.ReactNode;
  variant?: "primary" | "secondary" | "dark";
};

function ScoreCard({
  title,
  value,
  description,
  badge,
  icon,
  variant = "primary",
}: ScoreCardProps) {
  const variants = {
    primary: {
      wrapper:
        "bg-[#1a3c2e] text-white shadow-lg shadow-emerald-900/20",
      badge:
        "bg-white/20 text-white border border-white/20 backdrop-blur-sm",
      description: "text-emerald-100",
      iconBg: "bg-white/20 backdrop-blur-sm",
      icon: "text-white",
      glow: "bg-white/20",
    },

    secondary: {
      wrapper:
        "bg-white border border-slate-200 text-slate-900 shadow-sm hover:shadow-md",
      badge:
        "bg-emerald-50 text-emerald-700 border border-emerald-100",
      description: "text-slate-500",
      iconBg: "bg-emerald-50",
      icon: "text-emerald-600",
      glow: "bg-emerald-50",
    },

    dark: {
      wrapper:
        "bg-slate-900 text-white border border-slate-800",
      badge:
        "bg-white/10 text-slate-100 border border-white/10",
      description: "text-slate-400",
      iconBg: "bg-white/10",
      icon: "text-white",
      glow: "bg-white/5",
    },
  };

  const style = variants[variant];

  return (
    <div
      className={`group relative min-h-[136px] overflow-hidden rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:-translate-y-0.5 ${style.wrapper}`}
    >
      {/* DECORATIVE GLOW */}
      <div
        className={`absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl ${style.glow}`}
      />

      <div className="relative flex h-full min-h-[88px] flex-col justify-between">

        {/* TOP */}
        <div className="flex items-start justify-between gap-2.5">

          <div className="min-w-0">
            <p
              className={`text-sm font-medium ${
                variant === "primary"
                  ? "text-emerald-100"
                  : variant === "dark"
                  ? "text-slate-300"
                  : "text-slate-500"
              }`}
            >
              {title}
            </p>

            <h3 className="mt-1.5 text-2xl sm:text-[30px] font-bold tracking-tight break-words">
              {value}
            </h3>
          </div>

          {/* ICON */}
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${style.iconBg}`}
          >
            <div className={style.icon}>
              {icon}
            </div>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">

          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${style.badge}`}
          >
            {badge}
          </span>

          <div
            className={`text-xs ${style.description}`}
          >
            {description}
          </div>

        </div>
      </div>
    </div>
  );
}

type DashboardScoreCardsProps = {
  saldoWajib: number;
  saldoPendidikan: number;
  totalPengajuan: number;
};

// Dashboard Variant V1:
// card min-height 136px • padding 20/24px • title 14px • value 30px
// secondary text/badge 12px • icon 40px • radius 16px
export default function DashboardScoreCards({
  saldoWajib,
  saldoPendidikan,
  totalPengajuan,
}: DashboardScoreCardsProps) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {/* SIMPANAN WAJIB (PRIMARY / HERO) */}
      <ScoreCard
        title="Saldo Simpanan Wajib"
        value={`Rp ${saldoWajib.toLocaleString("id-ID")}`}
        description="Update hari ini"
        badge="Simpanan Aktif"
        icon={<Wallet className="h-5 w-5" />}
        variant="primary"
      />

      {/* TABUNGAN PENDIDIKAN */}
      <ScoreCard
        title="Tabungan Pendidikan"
        value={`Rp ${saldoPendidikan.toLocaleString("id-ID")}`}
        description="Stabil"
        badge="Tabungan Pendidikan"
        icon={<GraduationCap className="h-5 w-5" />}
        variant="secondary"
      />

      {/* PINJAMAN */}
      <ScoreCard
        title="Total Pinjaman Aktif"
        value={totalPengajuan.toString()}
        description="Sedang diproses"
        badge="Pengajuan Aktif"
        icon={<FileText className="h-5 w-5" />}
        variant="secondary"
      />
    </div>
  );
}