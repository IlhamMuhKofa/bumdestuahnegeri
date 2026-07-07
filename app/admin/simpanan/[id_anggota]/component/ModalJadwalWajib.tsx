"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

import {
  X,
  CalendarDays,
} from "lucide-react";

import { buatJadwalSimpananWajib } from "../action";

type Props = {
  open: boolean;

  onClose: () => void;

  idAnggota: number;
};

export default function ModalJadwalWajib({
  open,
  onClose,
  idAnggota,
}: Props) {
  const nominalBulanan = 10000;
  const jangkaWaktu = 12;

  const [tanggalMulai, setTanggalMulai] =
  useState(
    new Date()
      .toISOString()
      .split("T")[0]
  );

  const [loading, setLoading] =
    useState(false);

  if (!open) return null;

  const handleSubmit =
    async () => {
      try {
        setLoading(true);

        const result =
          await buatJadwalSimpananWajib(
            idAnggota,
            nominalBulanan,
            jangkaWaktu,
            tanggalMulai
          );

        if (!result.success) {
          alert(result.message);
          return;
        }

        alert(result.message);

        onClose();

        window.location.reload();

      } catch (error) {

        console.error(error);

        alert(
          "Gagal membuat jadwal simpanan wajib"
        );

      } finally {
        setLoading(false);
      }
    };

  const totalTarget =
    nominalBulanan *
    jangkaWaktu;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">

      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-5">

          <div>

            <h2 className="text-lg font-bold text-gray-800">
              Buat Jadwal Setoran
            </h2>

            <p className="text-sm text-gray-500">
              Generate tagihan simpanan wajib
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>

        </div>

        {/* BODY */}
        <div className="space-y-5 p-6">

          <div className="grid gap-4 md:grid-cols-2">

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Setoran Bulanan
              </p>

              <p className="mt-2 text-lg font-bold text-gray-800">
                Rp 10.000
              </p>

            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Jangka Waktu
              </p>

              <p className="mt-2 text-lg font-bold text-gray-800">
                12 Bulan
              </p>

            </div>

          </div>

          <div>
  <label className="mb-2 block text-sm font-medium text-gray-700">
    Tanggal Mulai Setoran
  </label>

  <input
    type="date"
    value={tanggalMulai}
    onChange={(e) =>
      setTanggalMulai(
        e.target.value
      )
    }
    className="w-full rounded-2xl border border-gray-200 px-4 py-3"
  />
</div>

          {/* PREVIEW */}
          <div className="rounded-2xl bg-blue-50 p-4">

            <div className="flex items-center gap-2 text-blue-700">

              <CalendarDays className="h-4 w-4" />

              <span className="font-semibold">
                Ringkasan
              </span>

            </div>

            <div className="mt-3 space-y-2 text-sm text-gray-700">

              <div className="flex justify-between">

                <span>
                  Setoran per bulan
                </span>

                <span className="font-semibold">
                  Rp{" "}
                  {nominalBulanan.toLocaleString(
                    "id-ID"
                  )}
                </span>

              </div>

              <div className="flex justify-between">

                <span>
                  Jangka waktu
                </span>

                <span className="font-semibold">
                  {jangkaWaktu} Bulan
                </span>

              </div>

              <div className="flex justify-between border-t pt-2">

                <span>
                  Target Dana
                </span>

                <span className="font-bold text-[#1a3c2e]">
                  Rp{" "}
                  {totalTarget.toLocaleString(
                    "id-ID"
                  )}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="flex gap-3 border-t px-6 py-5">

          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-gray-200 py-3 font-medium text-gray-700 hover:bg-gray-50"
          >
            Batal
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 rounded-2xl bg-blue-800 py-3 font-semibold text-white hover:bg-blue-900"
          >
            {loading
              ? "Menyimpan..."
              : "Simpan Jadwal"}
          </button>

        </div>

      </div>

    </div>,
    document.body
  );
}