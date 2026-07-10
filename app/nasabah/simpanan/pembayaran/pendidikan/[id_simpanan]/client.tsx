"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { bayarSimpanan } from "../../../action";
import { toast } from "react-toastify";

import {
  Wallet,
  StickyNote,
  Upload,
  Loader2,
  BadgeCheck,
  CreditCard,
  MessageSquare,
} from "lucide-react";

type Props = {
  idSimpanan: number;

  rekening: any;

  simpanan: {
    id_simpanan: number;
    tujuan: string | null;
    target_dana: number | null;
    jangka_waktu: number | null;
    total_terkumpul: number;
    status: string;
  };
};

export default function FormBayar({
  idSimpanan,
  rekening,
  simpanan,
}: Props) {
  const router = useRouter();

  const metode_bayar =
    "TRANSFER";

  const [buktiTransfer, setBuktiTransfer] =
    useState<File | null>(null);

  const [catatan, setCatatan] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const sisaTarget =
    Math.max(
      (simpanan.target_dana ?? 0) -
      simpanan.total_terkumpul,
      0
    );

  const [nominal, setNominal] =
    useState("");

  const formatRupiah = (
    value: string
  ) => {
    const numberString =
      value.replace(/[^,\d]/g, "");

    const split =
      numberString.split(",");

    const sisa =
      split[0].length % 3;

    let rupiah =
      split[0].substr(0, sisa);

    const ribuan =
      split[0]
        .substr(sisa)
        .match(/\d{3}/gi);

    if (ribuan) {
      const separator =
        sisa ? "." : "";

      rupiah +=
        separator +
        ribuan.join(".");
    }

    return rupiah
      ? `Rp ${rupiah}`
      : "";
  };

  const handleSubmit =
    async () => {
      try {
        if (!buktiTransfer) {
          toast.warning(
            "Bukti transfer wajib diupload"
          );

          return;
        }

        if (
          !nominal ||
          Number(nominal) <= 0
        ) {
          toast.warning(
            "Nominal pembayaran wajib diisi"
          );

          return;
        }

        setLoading(true);

        if (
          Number(nominal) >
          sisaTarget
        ) {
          toast.warning(
            `Nominal tidak boleh melebihi sisa target Rp ${sisaTarget.toLocaleString(
              "id-ID"
            )}`
          );

          setLoading(false);

          return;
        }

        const formData =
          new FormData();

        formData.append(
          "idSimpanan",
          String(idSimpanan)
        );

        formData.append(
          "catatan",
          catatan
        );

        formData.append(
          "bukti_bayar",
          buktiTransfer
        );

        formData.append(
          "metode_bayar",
          metode_bayar
        );

        formData.append(
          "nominal",
          nominal
        );

        const result =
          await bayarSimpanan(
            formData
          );

        if (!result.success) {
          toast.error(
            result.message ||
            "Gagal melakukan pembayaran"
          );

          return;
        }

        toast.success(
          "Bukti pembayaran berhasil dikirim."
        );

        setTimeout(() => {
          router.push(
            "/nasabah/simpanan?tab=Pendidikan"
          );
        }, 3000);

      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-[30px]">

      {/* HEADER */}
      <div className="relative overflow-hidden bg-[#1a3c2e] px-5 py-6 sm:px-7 sm:py-7">

        <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/5" />

        <div className="absolute right-10 top-8 h-24 w-24 rounded-full bg-white/5" />

        <div className="relative z-10">

          <div className="flex items-center gap-3 sm:gap-4">

            <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <Wallet className="h-6 w-6 sm:h-7 sm:w-7 text-yellow-400" />
            </div>

            <div className="min-w-0">

              <p className="mb-1 text-[10px] sm:text-xs font-semibold uppercase tracking-[2px] sm:tracking-[3px] text-green-300">
                BUMDes · Pembayaran
              </p>

              <h2 className="text-lg sm:text-2xl font-bold text-white">
                Form Pembayaran Simpanan
              </h2>

            </div>

          </div>

          <p className="mt-3 sm:mt-4 max-w-2xl text-xs sm:text-sm leading-relaxed text-gray-300">
            Lakukan pembayaran
            simpanan dengan mudah
            dan aman melalui sistem
            BUMDes.
          </p>

        </div>

      </div>

      {/* CONTENT */}
      <div className="space-y-5 sm:space-y-6 bg-white p-4 sm:p-7">

        {/* INFO */}
        <div className="flex items-start gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50 p-4 sm:p-5">

          <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-[#1a3c2e]">
            <BadgeCheck className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
          </div>

          <div className="min-w-0">

            <h3 className="mb-1 text-sm font-bold text-gray-800">
              Informasi Pembayaran
            </h3>

            <p className="text-xs sm:text-sm leading-relaxed text-gray-600">
              Setelah pembayaran
              berhasil diproses,
              status simpanan akan
              otomatis diperbarui
              oleh sistem.
            </p>

          </div>

        </div>

        {/* RINGKASAN TABUNGAN */}
        <div className="rounded-2xl sm:rounded-3xl border border-blue-100 bg-blue-50 p-4 sm:p-6">

          <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-bold text-gray-800">
            Ringkasan Tabungan Pendidikan
          </h3>

          <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">

            <div className="rounded-xl sm:rounded-2xl bg-white p-3.5 sm:p-4">
              <p className="text-[10px] sm:text-xs font-semibold uppercase text-gray-400">
                Tujuan
              </p>

              <p className="mt-1 font-semibold text-gray-800 text-sm sm:text-base break-words">
                {simpanan.tujuan}
              </p>
            </div>

            <div className="rounded-xl sm:rounded-2xl bg-white p-3.5 sm:p-4">
              <p className="text-[10px] sm:text-xs font-semibold uppercase text-gray-400">
                Target Dana
              </p>

              <p className="mt-1 font-semibold text-gray-800 text-sm sm:text-base break-words">
                Rp{" "}
                {(simpanan.target_dana ?? 0)
                  .toLocaleString("id-ID")}
              </p>
            </div>

            <div className="rounded-xl sm:rounded-2xl bg-white p-3.5 sm:p-4">
              <p className="text-[10px] sm:text-xs font-semibold uppercase text-gray-400">
                Sisa Target
              </p>

              <p className="mt-1 font-semibold text-red-600 text-sm sm:text-base break-words">
                Rp{" "}
                {sisaTarget.toLocaleString(
                  "id-ID"
                )}
              </p>
            </div>

          </div>

        </div>

        {/* REKENING TUJUAN */}
        {rekening && (
          <div className="rounded-2xl sm:rounded-3xl border border-blue-100 bg-blue-50 p-4 sm:p-6">

            <div className="mb-4 sm:mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-blue-100">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-blue-700" />
              </div>

              <div className="min-w-0">

                <h3 className="text-base sm:text-lg font-bold text-gray-800">
                  Rekening Tujuan Transfer
                </h3>

                <p className="text-xs sm:text-sm text-gray-500">
                  Transfer pembayaran ke rekening berikut
                </p>

              </div>

            </div>

            <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">

              {/* BANK */}
              <div className="rounded-xl sm:rounded-2xl bg-white p-3.5 sm:p-4">

                <p className="mb-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Bank
                </p>

                <h4 className="text-base sm:text-lg font-bold text-gray-800 break-words">
                  {rekening.nama_bank}
                </h4>

              </div>

              {/* REKENING */}
              <div className="rounded-xl sm:rounded-2xl bg-white p-3.5 sm:p-4">

                <p className="mb-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Nomor Rekening
                </p>

                <h4 className="text-base sm:text-lg font-bold text-[#1a3c2e] break-words">
                  {rekening.no_rekening}
                </h4>

              </div>

              {/* ATAS NAMA */}
              <div className="rounded-xl sm:rounded-2xl bg-white p-3.5 sm:p-4">

                <p className="mb-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Atas Nama
                </p>

                <h4 className="text-base sm:text-lg font-bold text-gray-800 break-words">
                  {rekening.atas_nama}
                </h4>

              </div>

            </div>

          </div>
        )}

        {/* NOMINAL */}
        <div className="space-y-2">

          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Wallet className="h-4 w-4" />
            Nominal Transfer
          </label>

          <input
            type="text"
            value={formatRupiah(
              nominal
            )}
            onChange={(e) =>
              setNominal(
                e.target.value.replace(
                  /[^0-9]/g,
                  ""
                )
              )
            }
            placeholder={`Maksimal Rp ${sisaTarget.toLocaleString(
              "id-ID"
            )}`}
            className="w-full rounded-xl sm:rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base sm:text-lg font-semibold text-gray-800 outline-none transition-all focus:border-[#1a3c2e] focus:bg-white"
          />

          <p className="text-xs text-gray-400">
            Masukkan nominal transfer sesuai pembayaran yang dilakukan
          </p>

        </div>

        {/* BUKTI TRANSFER */}
        <div className="space-y-3">

          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">

            <Upload className="h-4 w-4" />

            Upload Bukti Transfer

          </label>

          <div className="rounded-2xl sm:rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-4 sm:p-6 transition-all hover:border-[#1a3c2e] hover:bg-green-50">

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setBuktiTransfer(
                  e.target.files?.[0] ||
                  null
                )
              }
              className="block w-full text-xs sm:text-sm text-gray-600
              file:mr-3 sm:file:mr-4
              file:rounded-xl
              file:border-0
              file:bg-[#1a3c2e]
              file:px-3 sm:file:px-4
              file:py-2
              file:text-xs sm:file:text-sm
              file:font-semibold
              file:text-white
              hover:file:bg-[#244d3c]"
            />

            <p className="mt-3 text-[11px] sm:text-xs leading-relaxed text-gray-500">
              Upload screenshot atau foto bukti transfer pembayaran.
              Format JPG, PNG, atau JPEG.
            </p>

          </div>

          {buktiTransfer && (
            <div className="rounded-xl sm:rounded-2xl bg-green-50 px-4 py-3 text-xs sm:text-sm font-medium text-green-700 break-words">

              File dipilih:
              {" "}
              {buktiTransfer.name}

            </div>
          )}

        </div>

        {/* CATATAN */}
        <div className="space-y-2">

          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <MessageSquare className="h-4 w-4" />
            Catatan
          </label>

          <textarea
            value={catatan}
            onChange={(e) =>
              setCatatan(
                e.target.value
              )
            }
            placeholder="Tambahkan catatan (opsional)"
            className="w-full rounded-xl sm:rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm sm:text-base font-medium text-gray-800 outline-none transition-all focus:border-[#1a3c2e] focus:bg-white"
          />

        </div>

        {/* BUTTON */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">

          <button
            onClick={() =>
              router.back()
            }
            className="flex-1 rounded-xl sm:rounded-2xl border border-gray-200 py-3 text-sm sm:text-base font-medium text-gray-700 transition-all hover:bg-gray-50"
          >
            Batal
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-[#1a3c2e] py-3 text-sm sm:text-base font-semibold text-white transition-all hover:bg-[#244d3c] disabled:opacity-70"
          >

            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4" />
                Bayar Sekarang
              </>
            )}

          </button>

        </div>

      </div>

    </div>
  );
}