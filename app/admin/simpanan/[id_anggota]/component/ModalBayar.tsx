"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import {
  X,
  CalendarDays,
  Wallet,
  UploadCloud,
} from "lucide-react";

import {
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type Tagihan = {
  id: number;
  bulan_ke: number;
  nominal: number;
  status: string;
};

type Props = {
  open: boolean;
  onClose: () => void;

  tagihan: Tagihan[];

  onSubmit?: (data: {
    idsPembayaran: number[];
    tanggal_bayar: string;
    bukti: File | null;
  }) => void;
};

export default function ModalBayar({
  open,
  onClose,
  tagihan,
  onSubmit,
}: Props) {
  const [selectedIds, setSelectedIds] =
    useState<number[]>([]);

  const [tanggalBayar, setTanggalBayar] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  const [bukti, setBukti] =
    useState<File | null>(null);

  const tagihanBelumBayar =
    tagihan.filter(
      (item) =>
        item.status !==
        "BERHASIL"
    );

  const selectedTagihan =
    useMemo(() => {
      return tagihanBelumBayar.filter(
        (item) =>
          selectedIds.includes(
            item.id
          )
      );
    }, [
      selectedIds,
      tagihanBelumBayar,
    ]);

  const totalNominal =
    selectedTagihan.reduce(
      (acc, item) =>
        acc + item.nominal,
      0
    );

  const [openTagihan, setOpenTagihan] =
    useState(false);

  const handleChangeTagihan = (
    id: number
  ) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter(
          (item) =>
            item !== id
        )
        : [...prev, id]
    );
  };

  

  const handleSubmit = () => {
    if (
      selectedIds.length === 0
    ) {
      toast.error("Pilih setoran terlebih dahulu");
      return;
    }

    if (!bukti) {
      toast.error("Upload bukti pembayaran cash terlebih dahulu");
      return;
    }

    onSubmit?.({
      idsPembayaran:selectedIds,
      tanggal_bayar:tanggalBayar,
      bukti,
    });
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)]">

        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-white px-6 py-5">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold text-slate-900">
                Pembayaran Simpanan
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Pilih tagihan yang ingin dibayarkan
              </p>

            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

          </div>

        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          <div className="space-y-6">

            {/* Daftar Tagihan */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden">

              <button
                type="button"
                onClick={() =>
                  setOpenTagihan(
                    !openTagihan
                  )
                }
                className="flex w-full items-center justify-between bg-slate-50 px-4 py-4 text-left"
              >

                <div>

                  <p className="font-semibold text-slate-800">
                    Pilih Tagihan
                  </p>

                  <p className="text-sm text-slate-500">
                    {selectedIds.length} tagihan dipilih
                  </p>

                </div>

                {openTagihan ? (
                  <ChevronUp className="h-5 w-5 text-slate-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-500" />
                )}

              </button>

              {openTagihan && (

                <div className="border-t bg-white p-3">

                  <div className="max-h-64 space-y-2 overflow-y-auto">

                    {tagihanBelumBayar.map(
                      (item) => {

                        const checked =
                          selectedIds.includes(
                            item.id
                          );

                        return (
                          <label
                            key={item.id}
                            className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 ${checked
                                ? "border-blue-600 bg-blue-50"
                                : "border-slate-200"
                              }`}
                          >

                            <div className="flex items-center gap-3">

                              <input
                                type="checkbox"
                                checked={
                                  checked
                                }
                                onChange={() =>
                                  handleChangeTagihan(
                                    item.id
                                  )
                                }
                              />

                              <span>
                                Bulan ke-
                                {
                                  item.bulan_ke
                                }
                              </span>

                            </div>

                            <span className="font-semibold text-blue-700">
                              Rp{" "}
                              {item.nominal.toLocaleString(
                                "id-ID"
                              )}
                            </span>

                          </label>
                        );
                      }
                    )}

                  </div>

                </div>

              )}

            </div>

            {/* Total */}
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-blue-50 p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-blue-700">
                    Total Pembayaran
                  </p>

                  <h3 className="mt-1 text-3xl font-bold text-blue-800">
                    Rp{" "}
                    {totalNominal.toLocaleString(
                      "id-ID"
                    )}
                  </h3>

                </div>

                <div className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
                  {
                    selectedIds.length
                  }{" "}
                  Tagihan
                </div>

              </div>

            </div>

            {/* Tanggal Bayar */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Tanggal Bayar
              </label>

              <div className="relative">

                <CalendarDays className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="date"
                  value={
                    tanggalBayar
                  }
                  onChange={(e) =>
                    setTanggalBayar(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none transition focus:border-blue-600"
                />

              </div>

            </div>

            {/* Metode */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Metode Pembayaran
              </label>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                <div className="flex items-center gap-2">

                  <Wallet className="h-4 w-4 text-blue-700" />

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    CASH
                  </span>

                </div>

              </div>

            </div>

            {/* Upload Bukti */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Bukti Pembayaran
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-6 transition hover:border-blue-500 hover:bg-blue-50">

                <UploadCloud className="mb-3 h-10 w-10 text-slate-400" />

                <p className="font-medium text-slate-700">
                  Upload Bukti Pembayaran
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  JPG, PNG, JPEG
                </p>

                {bukti && (
                  <p className="mt-3 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    {bukti.name}
                  </p>
                )}

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    setBukti(
                      e.target
                        .files?.[0] ??
                      null
                    )
                  }
                />

              </label>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-3 border-t bg-white px-6 py-5">

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Batal
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-xl bg-blue-700 px-5 py-2.5 font-medium text-white transition hover:bg-blue-900"
          >
            Simpan Pembayaran
          </button>

        </div>

      </div>

    </div>,
    document.body
  );
}
