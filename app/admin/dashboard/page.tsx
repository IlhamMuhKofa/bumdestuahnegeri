"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Activity,
  CalendarDays,
  FileText,
  GraduationCap,
  Users,
  Wallet,
} from "lucide-react";

type Holiday = {
  date: string;
  name: string;
};

type ChartMode = "monthly" | "yearly";

type PeriodPoint = {
  label: string;
  wajib: number;
  pendidikan: number;
  pinjaman: number;
};

type DashboardData = {
  scorecards: {
    totalNasabah: number;
    totalPinjamanAktif: number;
    saldoWajib: number;
    saldoPendidikan: number;
  };
  charts: {
    monthly: PeriodPoint[];
    yearly: PeriodPoint[];
    currentYear: number;
  };
};

const emptyDashboard: DashboardData = {
  scorecards: {
    totalNasabah: 0,
    totalPinjamanAktif: 0,
    saldoWajib: 0,
    saldoPendidikan: 0,
  },
  charts: {
    monthly: [],
    yearly: [],
    currentYear: new Date().getFullYear(),
  },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactCurrency(value: number) {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)} M`;
  }

  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)} Jt`;
  }

  if (value >= 1_000) {
    return `Rp ${(value / 1_000).toFixed(0)} Rb`;
  }

  return `Rp ${value}`;
}

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

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function FriendlyCalendar() {
  const [cursor, setCursor] = useState(() => new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [holidayError, setHolidayError] = useState("");

  const year = cursor.getFullYear();
  const monthIndex = cursor.getMonth();
  const cells = useMemo(
    () => buildMonthMatrix(year, monthIndex),
    [year, monthIndex]
  );

  const monthLabel = cursor.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const today = new Date();
  const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  useEffect(() => {
    let isMounted = true;

    async function fetchHolidays() {
      try {
        setHolidayError("");

        const response = await fetch(`/api/holidays?year=${year}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Gagal mengambil hari libur");
        }

        if (isMounted) {
          setHolidays(result.data ?? []);
        }
      } catch (error) {
        console.error("Gagal mengambil hari libur:", error);

        if (isMounted) {
          setHolidays([]);
          setHolidayError("Hari libur nasional belum dapat dimuat");
        }
      }
    }

    fetchHolidays();

    return () => {
      isMounted = false;
    };
  }, [year]);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const getHoliday = (date: Date) => {
    const formatted = formatDateKey(date);
    return holidays.find((holiday) => holiday.date === formatted);
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-[#1a3c2e]" />
          <div className="text-base font-bold text-gray-900">
            {monthLabel}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCursor(new Date(year, monthIndex - 1, 1))}
            className="rounded-lg border border-gray-200 px-2 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            type="button"
          >
            &lt;
          </button>
          <button
            onClick={() => setCursor(new Date())}
            className="rounded-lg border border-gray-200 px-2 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            type="button"
          >
            Bulan Ini
          </button>
          <button
            onClick={() => setCursor(new Date(year, monthIndex + 1, 1))}
            className="rounded-lg border border-gray-200 px-2 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            type="button"
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gray-500">
        {dayNames.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {cells.map(({ date, inMonth }, index) => {
          const isToday = isSameDay(date, today);
          const holiday = getHoliday(date);
          const isRedDay = Boolean(holiday);

          return (
            <button
              key={`${date.toISOString()}-${index}`}
              title={holiday ? holiday.name : date.toLocaleDateString("id-ID")}
              className={[
                "h-10 rounded-xl text-sm font-semibold transition",
                inMonth ? "text-gray-900" : "text-gray-400",
                isRedDay
                  ? "bg-red-600 text-white"
                  : isToday
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-50",
              ].join(" ")}
              type="button"
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {holidayError && (
        <p className="mt-3 text-xs text-red-500">{holidayError}</p>
      )}
    </div>
  );
}

function ScoreCard({
  title,
  value,
  caption,
  icon,
  tone,
}: {
  title: string;
  value: string;
  caption: string;
  icon: React.ReactNode;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          <p className="mt-1 text-xs text-gray-400">{caption}</p>
        </div>

        <div
          className={[
            "flex h-11 w-11 items-center justify-center rounded-xl",
            tone,
          ].join(" ")}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function ChartFilter({
  mode,
  onChange,
}: {
  mode: ChartMode;
  onChange: (mode: ChartMode) => void;
}) {
  return (
    <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1">
      {[
        { label: "Per Bulan", value: "monthly" as const },
        { label: "Per Tahun", value: "yearly" as const },
      ].map((item) => (
        <button
          key={item.value}
          onClick={() => onChange(item.value)}
          className={[
            "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
            mode === item.value
              ? "bg-white text-[#1a3c2e] shadow-sm"
              : "text-gray-500 hover:text-gray-800",
          ].join(" ")}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function SavingsBarChart({ data }: { data: PeriodPoint[] }) {
  const maxValue = Math.max(
    1,
    ...data.map((item) => Math.max(item.wajib, item.pendidikan))
  );

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-sm font-bold text-gray-900">
          Setoran Simpanan
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          Perbandingan setoran Wajib dan Pendidikan yang sudah berhasil
        </p>
      </div>

      <div className="flex h-64 items-end gap-3 overflow-x-auto pb-2">
        {data.map((item) => {
          const wajibHeight =
            item.wajib === 0 ? 0 : Math.max(6, (item.wajib / maxValue) * 100);
          const pendidikanHeight =
            item.pendidikan === 0
              ? 0
              : Math.max(6, (item.pendidikan / maxValue) * 100);

          return (
            <div
              key={item.label}
              className="flex min-w-12 flex-1 flex-col items-center gap-2"
              title={`Wajib: ${formatCurrency(
                item.wajib
              )} | Pendidikan: ${formatCurrency(item.pendidikan)}`}
            >
              <div className="flex h-44 w-full items-end justify-center gap-1.5">
                <div
                  className="w-4 rounded-t-md bg-green-600"
                  style={{ height: `${wajibHeight}%` }}
                />
                <div
                  className="w-4 rounded-t-md bg-blue-700"
                  style={{ height: `${pendidikanHeight}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-500">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-700" />
          Wajib
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
          Pendidikan
        </span>
      </div>
    </div>
  );
}

function LoanLineChart({ data }: { data: PeriodPoint[] }) {
  const width = 640;
  const height = 220;
  const padding = 28;
  const maxValue = Math.max(1, ...data.map((item) => item.pinjaman));
  const points = data.map((item, index) => {
    const x =
      data.length === 1
        ? width / 2
        : padding +
          (index * (width - padding * 2)) / Math.max(1, data.length - 1);
    const y =
      height - padding - (item.pinjaman / maxValue) * (height - padding * 2);

    return {
      ...item,
      x,
      y,
    };
  });

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-sm font-bold text-gray-900">
          Perkembangan Total Pinjaman
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          Total pinjaman berstatus disetujui dan aktif
        </p>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-64 min-w-[640px] w-full"
          role="img"
          aria-label="Grafik perkembangan total pinjaman"
        >
          {[0, 0.25, 0.5, 0.75, 1].map((line) => {
            const y = padding + line * (height - padding * 2);

            return (
              <line
                key={line}
                x1={padding}
                x2={width - padding}
                y1={y}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            );
          })}

          <path
            d={path}
            fill="none"
            stroke="#1D4ED8"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />

          {points.map((point) => (
            <g key={point.label}>
              <circle
                cx={point.x}
                cy={point.y}
                r="5"
                fill="#1a3c2e"
                stroke="#ffffff"
                strokeWidth="3"
              />
              <text
                x={point.x}
                y={height - 6}
                textAnchor="middle"
                className="fill-gray-500 text-[11px] font-medium"
              >
                {point.label}
              </text>
              <title>{formatCurrency(point.pinjaman)}</title>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-2 text-sm font-semibold text-gray-800">
        Total tertinggi: {formatCompactCurrency(maxValue)}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [dashboard, setDashboard] =
    useState<DashboardData>(emptyDashboard);
  const [chartMode, setChartMode] = useState<ChartMode>("monthly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboard() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/admin/dashboard");
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Gagal memuat dashboard");
        }

        if (isMounted) {
          setDashboard(result.data);
        }
      } catch (fetchError) {
        console.error("Gagal memuat dashboard:", fetchError);

        if (isMounted) {
          setError("Data dashboard belum dapat dimuat");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const chartData =
    chartMode === "monthly"
      ? dashboard.charts.monthly
      : dashboard.charts.yearly;
  const scoreCards = [
    {
      title: "Total Nasabah",
      value: loading ? "..." : dashboard.scorecards.totalNasabah.toString(),
      caption: "Akun dengan role nasabah",
      icon: <Users className="h-5 w-5 text-gray-700" />,
      tone: "bg-gray-100",
    },
    {
      title: "Pinjaman Aktif",
      value: loading
        ? "..."
        : dashboard.scorecards.totalPinjamanAktif.toString(),
      caption: "Pengajuan berstatus ACTIVE",
      icon: <FileText className="h-5 w-5 text-gray-700" />,
      tone: "bg-gray-100",
    },
    {
      title: "Saldo Setoran Wajib",
      value: loading
        ? "..."
        : formatCompactCurrency(dashboard.scorecards.saldoWajib),
      caption: "Total pembayaran berhasil",
      icon: <Wallet className="h-5 w-5 text-gray-700" />,
      tone: "bg-gray-100",
    },
    {
      title: "Saldo Pendidikan",
      value: loading
        ? "..."
        : formatCompactCurrency(dashboard.scorecards.saldoPendidikan),
      caption: "Total pembayaran berhasil",
      icon: <GraduationCap className="h-5 w-5 text-gray-700" />,
      tone: "bg-gray-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">
        <div className="space-y-2">
          <div className="relative overflow-hidden rounded-2xl bg-blue-800 p-6 shadow-sm">
            <div className="absolute right-0 top-0 h-full w-48 opacity-10">
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white" />
              <div className="absolute right-20 top-10 h-32 w-32 rounded-full bg-white" />
            </div>

            <div className="relative">
              <p className="mb-1 text-sm text-white">
                Halo, selamat datang kembali
              </p>
              <h2 className="text-xl font-bold text-white">{session?.user?.name || "Administrator"}</h2>
              <p className="mt-1 text-sm text-white">
                Pantau data nasabah, simpanan, dan pinjaman dari satu tempat.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {scoreCards.map((card) => (
              <ScoreCard
                key={card.title}
                title={card.title}
                value={card.value}
                caption={card.caption}
                icon={card.icon}
                tone={card.tone}
              />
            ))}
          </div>
        </div>

        <div className="xl:self-start">
          <FriendlyCalendar />
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a3c2e]/10">
            <Activity className="h-5 w-5 text-[#1a3c2e]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Analitik Keuangan
            </h3>
            <p className="text-xs text-gray-500">
              {chartMode === "monthly"
                ? `Menampilkan data bulanan tahun ${dashboard.charts.currentYear}`
                : "Menampilkan ringkasan 5 tahun terakhir"}
            </p>
          </div>
        </div>

        <ChartFilter mode={chartMode} onChange={setChartMode} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SavingsBarChart data={chartData} />
        <LoanLineChart data={chartData} />
      </div>
    </div>
  );
}
