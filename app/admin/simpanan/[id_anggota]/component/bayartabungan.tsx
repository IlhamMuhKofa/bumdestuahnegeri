"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { bayarCashPendidikan } from "../action";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";

import {
  Wallet,
  Loader2,
  BadgeCheck,
  MessageSquare,
} from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;

  anggota: {
    nama: string;
    email: string;
    no_hp: string | null;
  };

  simpanan: {
    id_simpanan: number;
    tujuan: string;
    target_dana: number;
    total_terkumpul: number;
    status: string;
  } | null;
};

export default function FormBayar({
  open,
  onClose,
  anggota,
  simpanan,
}: Props) {
  const router = useRouter();

  const [catatan, setCatatan] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [bukti, setBukti] =
    useState<File | null>(null);

  const sisaTarget =
    Math.max(
      (simpanan?.target_dana ?? 0) -
      (simpanan?.total_terkumpul ?? 0),
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
        if (
          !nominal ||
          Number(nominal) <= 0
        ) {
          toast.warning(
            "Nominal pembayaran wajib diisi"
          );

          return;
        }

        if (!simpanan) {
          toast.warning("Buat tabungan pendidikan terlebih dahulu");
          return;
        }

        if (!bukti) {
          toast.warning("Bukti pembayaran wajib diupload");
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

        const formData = new FormData();
        formData.append("file", bukti);

        const upload = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadResult = await upload.json();

        if (!upload.ok) {
          toast.error(uploadResult.error || "Upload bukti gagal");
          return;
        }

        const result =
          await bayarCashPendidikan(
            simpanan.id_simpanan,
            Number(nominal),
            uploadResult.url,
            catatan
          );

        if (!result.success) {
          toast.error(
            result.message ||
            "Gagal melakukan pembayaran"
          );

          return;
        }

        toast.success(
          "Setoran berhasil disimpan."
        );

        setTimeout(() => {
          onClose();

          router.refresh();
        }, 1500);

      } finally {
        setLoading(false);
      }
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
      <div className="relative z-10 max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[30px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)]">

        {/* HEADER */}
        <div className="relative overflow-hidden bg-blue-900 px-7 py-7">

          <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/5" />

          <div className="absolute right-10 top-8 h-24 w-24 rounded-full bg-white/5" />

          <div className="relative z-10">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                <Wallet className="h-7 w-7 text-white" />
              </div>

              <div>

                <p className="mb-1 text-xs font-semibold uppercase tracking-[3px] text-white">
                  BUMDes · Pembayaran
                </p>

                <h2 className="text-2xl font-bold text-white">
                  Form Pembayaran Simpanan
                </h2>

              </div>

            </div>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-300">
              Input setoran tabungan pendidikan
              secara langsung melalui admin.
            </p>

          </div>

        </div>

        {/* CONTENT */}
        <div className="space-y-6 bg-white p-7">

          {/* INFO */}
          <div className="flex items-start gap-4 rounded-3xl border border-emerald-100 bg-blue-800 p-5">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <BadgeCheck className="h-5 w-5 text-white" />
            </div>

            <div>

              <h3 className="mb-1 text-sm font-bold text-white">
                Informasi Setoran
              </h3>

              <p className="text-sm leading-relaxed text-white">
                Setoran yang disimpan
                akan langsung menambah
                saldo tabungan pendidikan
                anggota.
              </p>

            </div>

          </div>

          {/* DATA NASABAH */}
<div className="rounded-3xl border border-slate-100 bg-gray-100 p-6">

  <h3 className="mb-4 text-lg font-bold text-gray-800">
    Data Nasabah
  </h3>

  <div className="grid gap-4 md:grid-cols-3">

    <div className="rounded-2xl bg-white p-4">
      <p className="text-xs font-semibold uppercase text-gray-400">
        Nama
      </p>

      <p className="mt-1 font-semibold text-gray-800">
        {anggota.nama}
      </p>
    </div>

    <div className="rounded-2xl bg-white p-4">
      <p className="text-xs font-semibold uppercase text-gray-400">
        Email
      </p>

      <p className="mt-1 font-semibold text-gray-800">
        {anggota.email}
      </p>
    </div>

    <div className="rounded-2xl bg-white p-4">
      <p className="text-xs font-semibold uppercase text-gray-400">
        No HP
      </p>

      <p className="mt-1 font-semibold text-gray-800">
        {anggota.no_hp || "-"}
      </p>
    </div>

  </div>

</div>

          {/* RINGKASAN TABUNGAN */}
          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">

            <h3 className="mb-4 text-lg font-bold text-gray-800">
              Ringkasan Tabungan Pendidikan
            </h3>

            <div className="grid gap-4 md:grid-cols-3">

              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-semibold uppercase text-gray-400">
                  Tujuan
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                {simpanan?.tujuan || "Belum ada tabungan pendidikan"}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-semibold uppercase text-gray-400">
                  Target Dana
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  Rp{" "}
                  {(simpanan?.target_dana ?? 0)
                    .toLocaleString("id-ID")}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-semibold uppercase text-gray-400">
                  Sisa Target
                </p>

                <p className="mt-1 font-semibold text-red-600">
                  Rp{" "}
                  {sisaTarget.toLocaleString(
                    "id-ID"
                  )}
                </p>
              </div>

            </div>

          </div>

          {/* REKENING TUJUAN */}

          {/* NOMINAL */}
          <div className="space-y-2">

            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Wallet className="h-4 w-4" />
              Nominal Setoran
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
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-lg font-semibold text-gray-800 outline-none transition-all focus:border-[#1a3c2e] focus:bg-white"
            />

            <p className="text-xs text-gray-400">
              Masukkan nominal setoran sesuai jumlah yang ingin disimpan
            </p>

          </div>

          {/* CATATAN */}
          <div className="space-y-2">

            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              Bukti Pembayaran
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setBukti(e.target.files?.[0] ?? null)
              }
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm"
            />

            {bukti && (
              <p className="text-xs font-medium text-blue-700">
                {bukti.name}
              </p>
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
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base font-medium text-gray-800 outline-none transition-all focus:border-[#1a3c2e] focus:bg-white"
            />

          </div>

          {/* BUTTON */}
          <div className="flex items-center gap-3 pt-2">

            <button
              onClick={onClose}
              className="flex-1 rounded-2xl border border-gray-200 py-3 font-medium text-gray-700 transition-all hover:bg-gray-50"
            >
              Batal
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-700 py-3 font-semibold text-white transition-all hover:bg-blue-900 disabled:opacity-70"
            >

              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4" />
                  Simpan Setoran
                </>
              )}

            </button>

          </div>

        </div>
      </div>

    </div>,
    document.body
  );
}
