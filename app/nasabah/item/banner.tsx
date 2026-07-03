"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  CircleAlert,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Leaf,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";

// ---- Helpers ----
const TIPS = [
  "Lengkapi profil agar proses pengajuan dapat diproses lebih cepat.",
  "Pastikan nomor HP aktif untuk menerima informasi penting.",
  "Gunakan data diri yang valid agar akun lebih aman dan terpercaya.",
  "Anda dapat melihat seluruh aktivitas pada menu Riwayat.",
];

type AnggotaLike = {
  nama?: string | null;
  alamat?: string | null;
  no_hp?: string | null;
  pekerjaan?: string | null;
  jenis_kelamin?: string | null;
  tanggal_lahir?: Date | string | null;
  nik?: string | null;
  foto_diri?: string | null;
};

function isEmpty(val: any) {
  return (
    val === null ||
    val === undefined ||
    (typeof val === "string" && val.trim() === "")
  );
}

function calcProfileProgress(user: any) {
  const fields = [
    { key: "nama", label: "Nama" },
    { key: "alamat", label: "Alamat" },
    { key: "no_hp", label: "No. HP" },
    { key: "pekerjaan", label: "Pekerjaan" },
    { key: "jenis_kelamin", label: "Jenis Kelamin" },
    { key: "tanggal_lahir", label: "Tanggal Lahir" },
    { key: "nik", label: "NIK" },
    { key: "foto_diri", label: "Foto Diri" },
  ];

  const missing = fields
    .filter((f) => isEmpty(user[f.key]))
    .map((f) => f.label);

  const filled = fields.length - missing.length;
  const pct = Math.round((filled / fields.length) * 100);

  return { pct, missing };
}

// ---- Banner ----
function AdaptiveBanner({ user }: { user: AnggotaLike }) {
  const progress = useMemo(() => calcProfileProgress(user), [user]);
  const isComplete = progress.missing.length === 0;

  const tip = useMemo(() => TIPS[Math.floor(Math.random() * TIPS.length)], []);

  const [bannerState, setBannerState] = useState<
    "incomplete" | "completed" | "default"
  >("default");

  useEffect(() => {
    if (!isComplete) {
      setBannerState("incomplete");
      return;
    }

    const hasShown = sessionStorage.getItem("profile-complete-banner-shown");
    if (!hasShown) {
      setBannerState("completed");
      sessionStorage.setItem("profile-complete-banner-shown", "true");
      const timer = setTimeout(() => setBannerState("default"), 10000);
      return () => clearTimeout(timer);
    }

    setBannerState("default");
  }, [isComplete]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return "Selamat pagi";
    if (hour < 15) return "Selamat siang";
    if (hour < 18) return "Selamat sore";
    return "Selamat malam";
  };

  return (
    /* h-full makes the banner stretch to match the calendar's height */
    <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/40 to-emerald-100/40 shadow-sm">
      {/* Decorative blobs */}
<div className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" />
<div className="pointer-events-none absolute -bottom-16 -left-16 h-52 w-52 rounded-full bg-green-100/40 blur-3xl" />

      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/*
        Use flex-col + justify-between so content always fills the card top-to-bottom.
        min-h is kept as fallback but h-full (from parent) drives the real height.
      */}
      <div className="relative flex flex-col gap-6 p-7 md:p-8">
        {/* Badge */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            Informasi Dashboard
          </div>

          <AnimatePresence mode="wait">
            {/* ============================= */}
            {/* INCOMPLETE                    */}
            {/* ============================= */}
            {bannerState === "incomplete" && (
              <motion.div
                key="incomplete"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="mt-4"
              >
                <h2 className="text-2xl font-extrabold leading-snug text-slate-900 leading-tight md:text-3xl">
                  Lengkapi Profil Anda 👋
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 md:text-base">
                  Yuk lengkapi data diri Anda untuk menikmati layanan simpan
                  pinjam BUMDes dengan lebih mudah, aman, dan nyaman.
                </p>

                {/* Progress card */}
                <div className="mt-5 rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-md shadow-sm p-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      Kelengkapan Profil
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                      {progress.pct}%
                    </span>
                  </div>

                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.pct}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    />
                  </div>

                  {progress.missing.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-600">
                        <CircleAlert className="h-3.5 w-3.5" />
                        Perlu dilengkapi
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {progress.missing.slice(0, 6).map((m) => (
                          <span
                            key={m}
                            className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="mt-4 text-xs text-slate-500">
                    💡{" "}
                    <span className="font-medium text-slate-600">{tip}</span>
                  </p>
                </div>
              </motion.div>
            )}

            {/* ============================= */}
            {/* COMPLETED                     */}
            {/* ============================= */}
            {bannerState === "completed" && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="mt-4"
              >
                <h2 className="text-2xl font-extrabold leading-snug text-slate-900 md:text-3xl">
                  Profil Berhasil Dilengkapi 🎉
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 md:text-base">
                  Data diri Anda sudah lengkap dan akun siap digunakan.
                  Sekarang Anda sudah dapat melakukan pengajuan pinjaman dan
                  menikmati layanan BUMDes dengan lebih nyaman.
                </p>

                {/* Status pill */}
                <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 shadow-md shadow-emerald-500/20 shadow-sm">
                    <ShieldCheck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-emerald-900">
                      Akun Siap Mengajukan
                    </div>
                    <div className="mt-0.5 text-xs text-emerald-700">
                      Estimasi verifikasi: 1–2 hari kerja
                    </div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    { icon: CheckCircle2, label: "Profil", val: "100% Lengkap" },
                    { icon: TrendingUp, label: "Status", val: "Aktif" },
                  ].map(({ icon: Icon, label, val }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
                    >
                      <Icon className="h-4 w-4 text-emerald-600" />
                      <div>
                        <div className="text-xs text-slate-400">{label}</div>
                        <div className="text-sm font-semibold text-slate-800">
                          {val}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ============================= */}
            {/* DEFAULT                       */}
            {/* ============================= */}
            {bannerState === "default" && (
              <motion.div
                key="default"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="mt-4"
              >
                <h2 className="text-2xl font-extrabold leading-snug text-slate-900 md:text-3xl">
                  {greeting()}
                  {user.nama ? `, ${user.nama}` : ""} 👋
                </h2>

                <p className="mt-2 max-full text-sm leading-relaxed text-slate-500 md:text-base">
                  Selamat datang kembali di layanan simpan pinjam BUMDes.
                  Kelola simpanan, pengajuan pinjaman, dan aktivitas keuangan
                  Anda dengan lebih mudah dan aman.
                </p>

                {/* Info card */}
                <div className="mt-5 flex items-start gap-4 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-teal-50/50 p-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600/10">
                    <Leaf className="h-5 w-5 text-emerald-700" />
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700">
                    BUMDes hadir untuk mendukung kebutuhan dan perkembangan
                    masyarakat desa menuju ekonomi yang lebih mandiri dan
                    sejahtera.
                  </p>
                </div>

                {/* Quick stats */}
                {/* <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    { icon: ShieldCheck, label: "Keamanan Akun", val: "Terlindungi" },
                    { icon: TrendingUp, label: "Layanan", val: "Tersedia 24/7" },
                  ].map(({ icon: Icon, label, val }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
                    >
                      <Icon className="h-4 w-4 text-emerald-600" />
                      <div>
                        <div className="text-xs text-slate-400">{label}</div>
                        <div className="text-sm font-semibold text-slate-800">
                          {val}
                        </div>
                      </div>
                    </div>
                  ))}
                </div> */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA — pinned to bottom for incomplete state */}
        {bannerState === "incomplete" && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Selesaikan profil untuk membuka semua fitur
            </p>
            <Link
              href="/nasabah/profile"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md active:translate-y-0"
            >
              Lengkapi Profil
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Calendar ----
function buildMonthMatrix(year: number, monthIndex: number) {
  const first = new Date(year, monthIndex, 1);
  const startDay = first.getDay();
  const mondayFirstStart = (startDay + 6) % 7;

  const cells: Array<{ date: Date; inMonth: boolean }> = [];
  const startDate = new Date(year, monthIndex, 1 - mondayFirstStart);

  for (let i = 0; i < 42; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    cells.push({ date: d, inMonth: d.getMonth() === monthIndex });
  }

  return cells;
}

function FriendlyCalendar() {
  const [cursor, setCursor] = useState(() => new Date());

  const year = cursor.getFullYear();
  const monthIndex = cursor.getMonth();

  const monthLabel = cursor.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const cells = useMemo(
    () => buildMonthMatrix(year, monthIndex),
    [year, monthIndex]
  );

  const today = new Date();

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  return (
    <div className="h-full rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-emerald-700" />
          <div className="text-base font-bold text-slate-900">{monthLabel}</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCursor(new Date(year, monthIndex - 1, 1))}
            className="rounded-lg border px-2 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            ‹
          </button>
          <button
            onClick={() => setCursor(new Date())}
            className="rounded-lg border px-2 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Hari ini
          </button>
          <button
            onClick={() => setCursor(new Date(year, monthIndex + 1, 1))}
            className="rounded-lg border px-2 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500">
        {dayNames.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {cells.map(({ date, inMonth }, idx) => {
          const isToday = isSameDay(date, today);
          return (
            <button
              key={idx}
              className={[
                "h-10 rounded-xl text-sm font-semibold transition",
                inMonth ? "text-slate-900" : "text-slate-400",
                isToday
                  ? "bg-emerald-700 text-white hover:bg-emerald-800"
                  : "hover:bg-slate-50",
              ].join(" ")}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---- Layout ----
export default function DashboardHeader({ user }: { user: AnggotaLike }) {
  return (
        <div className="w-full">
      <AdaptiveBanner user={user} />
    </div>
  );
}