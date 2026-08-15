"use client";

import React from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";

interface CardCicilanProps {
  item: {
    id_jadwal: string | number;
    cicilan_ke: number;
    jatuh_tempo: string;
    jumlah_tagihan: number;
    status: string;
  };
}

export default function CardCicilan({
  item,
}: CardCicilanProps) {
  const isLunas =
    item.status === "LUNAS";

  const dueDate =
    new Date(item.jatuh_tempo);

  const isOverdue =
    !isLunas &&
    dueDate <
      new Date(
        new Date().toDateString()
      );

  // =====================================================
  // STATUS
  // =====================================================

  const statusType = isLunas
    ? "lunas"
    : isOverdue
    ? "telat"
    : "berjalan";

  const statusLabel =
    statusType === "lunas"
      ? "Lunas"
      : statusType === "telat"
      ? "Telat"
      : "Berjalan";

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const statusClass =
    statusType === "lunas"
      ? "border-green-200 bg-green-50 text-green-700"
      : statusType === "telat"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-yellow-200 bg-yellow-50 text-yellow-700";

  // =====================================================
  // KETERANGAN
  // =====================================================

  const note =
    statusType === "lunas"
      ? {
          className:
            "border-green-100 bg-green-50 text-green-700",
          icon: (
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          ),
          text:
            "Pembayaran telah selesai dan diverifikasi",
        }
      : statusType === "telat"
      ? {
          className:
            "border-red-100 bg-red-50 text-red-700",
          icon: (
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          ),
          text:
            "Pembayaran telah melewati jatuh tempo",
        }
      : {
          className:
            "border-yellow-100 bg-yellow-50 text-yellow-700",
          icon: (
            <Clock className="h-3.5 w-3.5 shrink-0" />
          ),
          text:
            "Menunggu pembayaran dari nasabah",
        };

  return (
    <tr
      className="
        border-b
        border-gray-100
        last:border-0
        transition-colors
        hover:bg-blue-50/40
      "
    >
      {/* =====================================================
          CICILAN
      ===================================================== */}
      <td className="px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            Cicilan ke-{item.cicilan_ke}
          </p>

          <p className="mt-0.5 text-xs text-gray-400">
            ID #{item.id_jadwal}
          </p>
        </div>
      </td>

      {/* =====================================================
          JATUH TEMPO
      ===================================================== */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
            <CalendarDays className="h-4 w-4 text-blue-600" />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">
              {dueDate.toLocaleDateString(
                "id-ID",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              )}
            </p>

            <p className="mt-0.5 text-xs text-gray-400">
              Jatuh tempo
            </p>
          </div>
        </div>
      </td>

      {/* =====================================================
          JUMLAH TAGIHAN
      ===================================================== */}
      <td className="px-5 py-4">
        <p className="text-sm font-semibold text-gray-800">
          Rp{" "}
          {item.jumlah_tagihan.toLocaleString(
            "id-ID"
          )}
        </p>
      </td>

      {/* =====================================================
          STATUS
      ===================================================== */}
      <td className="px-5 py-4">
        <span
          className={`
            inline-flex
            items-center
            rounded-full
            border
            px-2.5
            py-1
            text-xs
            font-medium
            ${statusClass}
          `}
        >
          {statusLabel}
        </span>
      </td>

      {/* =====================================================
          KETERANGAN
      ===================================================== */}
      <td className="px-5 py-4">
        <div
          className={`
            inline-flex
            max-w-[280px]
            items-center
            gap-1.5
            rounded-lg
            border
            px-3
            py-1.5
            text-xs
            font-medium
            ${note.className}
          `}
        >
          {note.icon}

          <span>
            {note.text}
          </span>
        </div>
      </td>
    </tr>
  );
}