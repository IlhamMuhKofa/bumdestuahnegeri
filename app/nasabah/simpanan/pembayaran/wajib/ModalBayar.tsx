"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { bayarTransferNasabah } from "../../action";
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

//   onSubmit?: (data: {
//     idsPembayaran: number[];
//     tanggal_bayar: string;
//     bukti: File | null;
//   }) => void;
};

export default function ModalBayar({
  open,
  onClose,
  tagihan,
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

  

const handleSubmit = async () => {

  try {

    if (selectedIds.length === 0) {
      toast.error("Pilih setoran terlebih dahulu");
      return;
    }

    if (!bukti) {
      toast.error("Upload bukti pembayaran");
      return;
    }

    // =====================
    // UPLOAD FILE
    // =====================

    const formData =
      new FormData();

    formData.append(
      "file",
      bukti
    );

    const upload =
      await fetch(
        "/api/upload/image",
        {
          method: "POST",
          body: formData,
        }
      );

    const resultUpload =
      await upload.json();

    if (!upload.ok) {
      toast.error(
        resultUpload.error ||
        "Upload gagal"
      );
      return;
    }

    const buktiUrl =
      resultUpload.url;

    // =====================
    // SIMPAN PEMBAYARAN
    // =====================

    const result =
      await bayarTransferNasabah(
        selectedIds,
        tanggalBayar,
        buktiUrl
      );

    if (!result.success) {
      toast.info(result.message);
      return;
    }

    toast.success(result.message);

    window.location.reload();

  } catch (error) {

    console.error(error);

    toast.error(
      "Gagal mengirim pembayaran"
    );

  }

};

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative flex max-h-[92vh] sm:max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)]">

        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-white px-4 sm:px-6 py-4 sm:py-5">

          <div className="flex items-center justify-between gap-3">

            <div className="min-w-0">

              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                Pembayaran Simpanan
              </h2>

              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Pilih tagihan yang ingin dibayarkan
              </p>

            </div>

            <button
              onClick={onClose}
              className="flex-shrink-0 rounded-xl p-2 text-slate-500 transition hover:bg-slate-100"
              aria-label="Tutup"
            >
              <X className="h-5 w-5" />
            </button>

          </div>

        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">

          <div className="space-y-5 sm:space-y-6">

            {/* Daftar Tagihan */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden">

              <button
                type="button"
                onClick={() =>
                  setOpenTagihan(
                    !openTagihan
                  )
                }
                className="flex w-full items-center justify-between gap-3 bg-slate-50 px-3.5 sm:px-4 py-3.5 sm:py-4 text-left"
              >

                <div className="min-w-0">

                  <p className="text-sm sm:text-base font-semibold text-slate-800">
                    Pilih Tagihan
                  </p>

                  <p className="text-xs sm:text-sm text-slate-500">
                    {selectedIds.length} tagihan dipilih
                  </p>

                </div>

                {openTagihan ? (
                  <ChevronUp className="h-5 w-5 flex-shrink-0 text-slate-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 flex-shrink-0 text-slate-500" />
                )}

              </button>

              {openTagihan && (

                <div className="border-t bg-white p-2.5 sm:p-3">

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
                            className={`flex cursor-pointer flex-wrap items-center justify-between gap-2 rounded-xl border p-3.5 sm:p-4 ${checked
                                ? "border-green-600 bg-green-50"
                                : "border-slate-200"
                              }`}
                          >

                            <div className="flex items-center gap-2.5 sm:gap-3">

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
                                className="h-4 w-4 flex-shrink-0"
                              />

                              <span className="text-sm sm:text-base">
                                Bulan ke-
                                {
                                  item.bulan_ke
                                }
                              </span>

                            </div>

                            <span className="text-sm sm:text-base font-semibold text-green-700 whitespace-nowrap">
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
            <div className="rounded-2xl border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-5">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                <div className="min-w-0">

                  <p className="text-xs sm:text-sm font-medium text-green-700">
                    Total Pembayaran
                  </p>

                  <h3 className="mt-1 break-words text-2xl sm:text-3xl font-bold text-green-800">
                    Rp{" "}
                    {totalNominal.toLocaleString(
                      "id-ID"
                    )}
                  </h3>

                </div>

                <div className="self-start sm:self-auto flex-shrink-0 rounded-xl bg-white px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 shadow-sm whitespace-nowrap">
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
                  className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 text-sm sm:text-base outline-none transition focus:border-green-600"
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

                  <Wallet className="h-4 w-4 flex-shrink-0 text-green-700" />

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs sm:text-sm font-medium text-green-700">
                    TRANSFER
                  </span>

                </div>

              </div>

            </div>

            {/* Upload Bukti */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Bukti Pembayaran
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-5 sm:p-6 text-center transition hover:border-green-500 hover:bg-green-50">

                <UploadCloud className="mb-2.5 sm:mb-3 h-8 w-8 sm:h-10 sm:w-10 text-slate-400" />

                <p className="text-sm sm:text-base font-medium text-slate-700">
                  Upload Bukti Pembayaran
                </p>

                <p className="mt-1 text-xs sm:text-sm text-slate-500">
                  JPG, PNG, JPEG
                </p>

                {bukti && (
                  <p className="mt-3 max-w-full truncate rounded-full bg-green-100 px-3 py-1 text-xs sm:text-sm font-medium text-green-700">
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
        <div className="sticky bottom-0 flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 border-t bg-white px-4 sm:px-6 py-4 sm:py-5">

          <button
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl border border-slate-300 px-5 py-2.5 text-sm sm:text-base font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Batal
          </button>

          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto rounded-xl bg-green-700 px-5 py-2.5 text-sm sm:text-base font-medium text-white transition hover:bg-green-800"
          >
            Simpan Pembayaran
          </button>

        </div>

      </div>

    </div>,
    document.body
  );
}