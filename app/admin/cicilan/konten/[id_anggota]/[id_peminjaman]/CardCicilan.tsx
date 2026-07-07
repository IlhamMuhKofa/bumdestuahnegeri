"use client";

import React from "react";
import { CalendarDays, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

interface CardCicilanProps {
  item: {
    id_jadwal: string | number;
    cicilan_ke: number;
    jatuh_tempo: string;
    jumlah_tagihan: number;
    status: string;
  };
}

export default function CardCicilan({ item }: CardCicilanProps) {
  const isLunas = item.status === "LUNAS";
  const dueDate = new Date(item.jatuh_tempo);
  const isOverdue = !isLunas && dueDate < new Date(new Date().toDateString());

  const accent = isLunas
    ? "from-emerald-500 to-emerald-400"
    : isOverdue
    ? "from-rose-500 to-rose-400"
    : "from-yellow-500 to-amber-600";

  const pillClass = isLunas
    ? "bg-emerald-100 text-emerald-700"
    : isOverdue
    ? "bg-rose-100 text-rose-700"
    : "bg-amber-100 text-amber-700";

  const statusLabel = isLunas ? "LUNAS" : isOverdue ? "TERLAMBAT" : item.status;

  const noteBox = isLunas
    ? {
        wrap: "bg-emerald-50 border-emerald-200 text-emerald-700",
        icon: <CheckCircle2 className="w-4 h-4 shrink-0" />,
        text: "Pembayaran telah selesai dan diverifikasi",
      }
    : isOverdue
    ? {
        wrap: "bg-rose-50 border-rose-200 text-rose-700",
        icon: <AlertTriangle className="w-4 h-4 shrink-0" />,
        text: "Pembayaran telah melewati jatuh tempo",
      }
    : {
        wrap: "bg-amber-50 border-amber-200 text-amber-700",
        icon: <Clock className="w-4 h-4 shrink-0" />,
        text: "Menunggu pembayaran dari nasabah",
      };

  return (
    <div className="group relative bg-white border rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className={`h-1.5 w-full bg-gradient-to-r ${accent}`} />

      <div className="p-5">
        <div className="flex justify-between items-start gap-3">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Cicilan ke-{item.cicilan_ke}
            </p>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1.5">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>
                {dueDate.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <span className={`text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap ${pillClass}`}>
            {statusLabel}
          </span>
        </div>

        <p className="text-2xl font-bold text-gray-800 mt-4">
          Rp {item.jumlah_tagihan.toLocaleString("id-ID")}
        </p>

        <div className={`mt-4 flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border ${noteBox.wrap}`}>
          {noteBox.icon}
          <span>{noteBox.text}</span>
        </div>
      </div>
    </div>
  );
}