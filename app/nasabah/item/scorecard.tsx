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
      className={`group relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] ${style.wrapper}`}
    >
      {/* decorative glow */}
      <div
        className={`absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl ${style.glow}`}
      />

      <div className="relative flex h-full flex-col justify-between">
        {/* TOP */}
        <div className="flex items-start justify-between">
          <div>
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

            <h3 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              {value}
            </h3>
          </div>

          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${style.iconBg}`}
          >
            <div className={style.icon}>{icon}</div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-6 flex items-center justify-between">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${style.badge}`}
          >
            {badge}
          </span>

          <div className={`text-xs ${style.description}`}>
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

export default function DashboardScoreCards({
  saldoWajib,
  saldoPendidikan,
  totalPengajuan,
}: DashboardScoreCardsProps) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {/* SIMPANAN WAJIB (PRIMARY / HERO) */}
      <ScoreCard
        title="Saldo Simpanan Wajib"
        value={`Rp ${saldoWajib.toLocaleString("id-ID")}`}
        description="Update hari ini"
        badge="Simpanan Aktif"
        icon={<Wallet className="h-6 w-6" />}
        variant="primary"
      />

      {/* TABUNGAN PENDIDIKAN */}
      <ScoreCard
        title="Tabungan Pendidikan"
        value={`Rp ${saldoPendidikan.toLocaleString("id-ID")}`}
        description="Stabil"
        badge="Tabungan Pendidikan"
        icon={<GraduationCap className="h-6 w-6" />}
        variant="secondary"
      />

      {/* PINJAMAN */}
      <ScoreCard
        title="Total Pinjaman Aktif"
        value={totalPengajuan.toString()}
        description="Sedang diproses"
        badge="Pengajuan Aktif"
        icon={<FileText className="h-6 w-6" />}
        variant="secondary"
      />
    </div>
  );
}