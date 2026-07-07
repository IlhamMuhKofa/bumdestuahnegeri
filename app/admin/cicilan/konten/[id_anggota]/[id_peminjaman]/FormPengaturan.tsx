"use client";

import React, { useMemo, useState } from "react";
import { CalendarDays, User, Wallet, Clock3, Banknote, StickyNote } from "lucide-react";

function buildMonthMatrix(year: number, monthIndex: number) {
  const first = new Date(year, monthIndex, 1);
  const startDay = first.getDay();
  const mondayFirstStart = (startDay + 6) % 7;
  const cells: Array<{ date: Date; inMonth: boolean }> = [];
  const startDate = new Date(year, monthIndex, 1 - mondayFirstStart);
  for (let i = 0; i < 35; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    cells.push({ date: d, inMonth: d.getMonth() === monthIndex });
  }
  return cells;
}

function FriendlyCalendar({
  selectedDate,
  onSelectDate,
}: {
  selectedDate?: string;
  onSelectDate?: (isoDate: string) => void;
}) {
  const [cursor, setCursor] = useState(new Date());
  const year = cursor.getFullYear();
  const monthIndex = cursor.getMonth();
  const monthLabel = cursor.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  const cells = useMemo(() => buildMonthMatrix(year, monthIndex), [year, monthIndex]);
  const today = new Date();
  const selected = selectedDate ? new Date(selectedDate) : null;

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50">
            <CalendarDays className="w-4 h-4 text-blue-800" />
          </div>
          <span className="font-bold text-gray-800">{monthLabel}</span>
        </div>

        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setCursor(new Date(year, monthIndex - 1, 1))}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setCursor(new Date())}
            className="px-2.5 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-xs font-medium text-gray-500"
          >
            Hari ini
          </button>
          <button
            type="button"
            onClick={() => setCursor(new Date(year, monthIndex + 1, 1))}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs text-center text-gray-400 font-medium mb-1">
        {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map(({ date, inMonth }, i) => {
          const isToday = date.toDateString() === today.toDateString();
          const isSelected = selected && date.toDateString() === selected.toDateString();

          return (
            <button
              type="button"
              key={i}
              disabled={!onSelectDate}
              onClick={() => {
                if (!onSelectDate) return;
                const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
                  date.getDate()
                ).padStart(2, "0")}`;
                onSelectDate(iso);
              }}
              className={`h-9 flex items-center justify-center rounded-lg text-sm transition-colors
                ${!inMonth ? "text-gray-300" : "text-gray-700"}
                ${isToday && !isSelected ? "ring-1 ring-blue-800 text-blue-800 font-semibold" : ""}
                ${isSelected ? "bg-blue-800 text-white font-semibold" : "hover:bg-gray-100"}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 border rounded-xl px-4 py-3">
      <div className="p-2 rounded-lg bg-white border text-blue-800">{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide truncate">{label}</p>
        <p className="text-sm font-bold text-gray-800 truncate">{value}</p>
      </div>
    </div>
  );
}

function FieldDate({ label, value, setValue }: any) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full mt-1.5 px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800/30 focus:border-blue-800"
      />
    </div>
  );
}

function FieldRupiah({ label, value, setValue }: any) {
  const formatRupiah = (angka: number) => angka.toLocaleString("id-ID");

  const handleChange = (e: any) => {
    const raw = e.target.value.replace(/\D/g, "");
    setValue(Number(raw));
  };

  return (
    <div>
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</label>
      <div className="flex items-center border rounded-xl px-3 mt-1.5 focus-within:ring-2 focus-within:ring-blue-800/30 focus-within:border-blue-800">
        <span className="mr-2 text-gray-400 text-sm font-medium">Rp</span>
        <input
          type="text"
          value={value ? formatRupiah(value) : ""}
          onChange={handleChange}
          placeholder="0"
          className="w-full py-2.5 outline-none"
        />
      </div>
    </div>
  );
}

interface FormPengaturanProps {
  data: any;
  total: number;
  tenor: number;
  cicilan: number | null;
  tanggalPengajuan: string;
  jatuhTempo: string;
  setJatuhTempo: (v: string) => void;
  denda: number;
  setDenda: (v: number) => void;
  catatan: string;
  setCatatan: (v: string) => void;
  hasJadwal: boolean;
  onSubmit: () => void;
}

export default function FormPengaturan({
  data,
  total,
  tenor,
  cicilan,
  tanggalPengajuan,
  jatuhTempo,
  setJatuhTempo,
  denda,
  setDenda,
  catatan,
  setCatatan,
  hasJadwal,
  onSubmit,
}: FormPengaturanProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="bg-white border rounded-2xl shadow-sm p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Informasi Peminjaman
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <StatPill icon={<User className="w-4 h-4" />} label="Nama" value={data?.anggota?.nama || "-"} />
          <StatPill icon={<CalendarDays className="w-4 h-4" />} label="Tgl Pengajuan" value={tanggalPengajuan} />
          <StatPill
            icon={<Wallet className="w-4 h-4" />}
            label="Total Pinjaman"
            value={`Rp ${total.toLocaleString("id-ID")}`}
          />
          <StatPill icon={<Clock3 className="w-4 h-4" />} label="Tenor" value={`${tenor} bulan`} />
          <StatPill
            icon={<Banknote className="w-4 h-4" />}
            label="Cicilan / bulan"
            value={cicilan ? `Rp ${cicilan.toLocaleString("id-ID")}` : "Menghitung..."}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <FriendlyCalendar selectedDate={jatuhTempo} onSelectDate={hasJadwal ? undefined : setJatuhTempo} />

        <div className="bg-white border rounded-2xl shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-blue-50">
              <StickyNote className="w-4 h-4 text-blue-800" />
            </div>
            <span className="font-bold text-gray-800">Detail Jadwal</span>
          </div>

          <FieldDate label="Tanggal Jatuh Tempo" value={jatuhTempo} setValue={setJatuhTempo} />
          <FieldRupiah label="Denda" value={denda} setValue={setDenda} />

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Catatan</label>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={3}
              placeholder="Tambahkan catatan (opsional)..."
              className="w-full mt-1.5 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-800/30 focus:border-blue-800 resize-none"
            />
          </div>

          {!hasJadwal && (
            <button
              onClick={onSubmit}
              className="w-full bg-blue-800 hover:bg-blue-900 active:scale-[0.99] transition text-white font-semibold py-3 rounded-xl"
            >
              Simpan Jadwal
            </button>
          )}
        </div>
      </div>
    </div>
  );
}