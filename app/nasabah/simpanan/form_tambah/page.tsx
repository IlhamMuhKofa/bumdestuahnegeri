"use client";

import { useState } from "react";
import { createTabunganPendidikan } from "../action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import {
  GraduationCap,
  Target,
  CalendarDays,
  StickyNote,
  Loader2,
  Wallet,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

type Props = {
  onClose: () => void;
  idAnggota: number;
};

export default function FormSetoran({
  onClose,
  idAnggota,
}: Props) {
  const [targetDana, setTargetDana] =
    useState<number>(5000000);

  const [jangkaWaktu, setJangkaWaktu] =
    useState<string>("12");

  const [tujuan, setTujuan] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const router = useRouter();

  // FORMAT RUPIAH
  const formatRupiah = (
    value: number
  ) => {
    return new Intl.NumberFormat(
      "id-ID"
    ).format(value);
  };

  const handleSubmit =
    async () => {
      try {
        if (!tujuan) {
          alert(
            "Tujuan tabungan wajib diisi"
          );

          return;
        }

        setLoading(true);

        await createTabunganPendidikan({
          idAnggota,
          targetDana,
          jangkaWaktu:
            Number(jangkaWaktu),
          tujuan,
          nominal: rekomendasiSetoran,
        });

        router.refresh();

        toast.success(
          "Tabungan berhasil dibuat"
        );

        onClose();
      } catch (err) {
        console.error(err);

        toast.error(
          "Gagal membuat tabungan"
        );
        
      } finally {
        setLoading(false);
      }
    };

    const rekomendasiSetoran =
  Math.ceil(
    targetDana /
      Number(jangkaWaktu)
  );

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-[30px] max-h-[90vh] overflow-y-auto">

      {/* HEADER */}
      <div className="relative overflow-hidden bg-[#1a3c2e] px-5 sm:px-7 py-5 sm:py-7">

        <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/5" />

        <div className="absolute right-10 top-8 h-24 w-24 rounded-full bg-white/5" />

        <div className="relative z-10">

          <div className="flex items-center gap-3 sm:gap-4">

            <div className="flex h-11 w-11 sm:h-14 sm:w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <GraduationCap className="h-5 w-5 sm:h-7 sm:w-7 text-yellow-400" />
            </div>

            <div className="min-w-0">
              <p className="mb-1 text-[10px] sm:text-xs font-semibold uppercase tracking-[2px] sm:tracking-[3px] text-green-300">
                BUMDes · Simpanan Pendidikan
              </p>

              <h2 className="text-lg sm:text-2xl font-bold text-white">
                Buat Target Tabungan
              </h2>
            </div>

          </div>

          <p className="mt-3 sm:mt-4 max-w-2xl text-xs sm:text-sm leading-relaxed text-gray-300">
            Rencanakan tabungan pendidikan
            dengan lebih terarah untuk membantu
            kebutuhan masa depan keluarga Anda.
          </p>

        </div>
      </div>

      {/* CONTENT */}
      <div className="space-y-5 sm:space-y-6 bg-white p-5 sm:p-7">

        {/* INFO */}
        <div className="flex items-start gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50 p-4 sm:p-5">

          <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1a3c2e]">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
          </div>

          <div className="min-w-0">
            <h3 className="mb-1 text-sm font-bold text-gray-800">
              Tabungan Fleksibel
            </h3>

            <p className="text-xs sm:text-sm leading-relaxed text-gray-600">
              Anda dapat melakukan setoran
              kapan saja sesuai kemampuan.
              Sistem akan membantu mencatat
              dan memantau perkembangan
              tabungan pendidikan Anda.
            </p>
          </div>

        </div>

        {/* TARGET */}
        <div className="space-y-2">

          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Target className="h-4 w-4 flex-shrink-0" />
            Target Dana
          </label>

          <select
            value={targetDana}
            onChange={(e) =>
              setTargetDana(
                Number(e.target.value)
              )
            }
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800 outline-none transition-all focus:border-[#1a3c2e] focus:bg-white"
          >
            <option value={1000000}>
              Rp 1.000.000
            </option>

            <option value={2000000}>
              Rp 2.000.000
            </option>

            <option value={3000000}>
              Rp 3.000.000
            </option>

            <option value={5000000}>
              Rp 5.000.000
            </option>

            <option value={7000000}>
              Rp 7.000.000
            </option>

            <option value={10000000}>
              Rp 10.000.000
            </option>

            <option value={15000000}>
              Rp 15.000.000
            </option>

            <option value={20000000}>
              Rp 20.000.000
            </option>
          </select>

        </div>

{/* REKOMENDASI SETORAN */}
<div className="rounded-2xl border border-slate-200 bg-yellow-50 p-4 sm:p-5 shadow-sm">

  <div className="flex items-center gap-2">
    <div className="flex h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white">
      <Wallet className="h-4 w-4 text-black" />
    </div>

    <div className="min-w-0">
      <p className="text-[11px] sm:text-xs font-medium uppercase tracking-wider text-slate-700">
        Rekomendasi Setoran
      </p>
      <p className="text-[10px] sm:text-[11px] text-slate-400">
        Tidak wajib, hanya sebagai panduan
      </p>
    </div>
  </div>

  <div className="mt-3 sm:mt-4">
    <p className="break-words text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
      Rp {formatRupiah(rekomendasiSetoran)}
    </p>
  </div>

</div>

        {/* JANGKA WAKTU */}
        <div className="space-y-2">

          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <CalendarDays className="h-4 w-4 flex-shrink-0" />
            Rencana Durasi Menabung
          </label>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-4">

            {[
              "6",
              "12",
              "18",
              "24",
            ].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  setJangkaWaktu(item)
                }
                className={`rounded-2xl border px-3 py-3 sm:px-4 sm:py-4 text-xs sm:text-sm font-semibold transition-all ${
                  jangkaWaktu === item
                    ? "border-[#1a3c2e] bg-[#1a3c2e] text-white shadow-lg"
                    : "border-gray-200 bg-white text-gray-700 hover:border-[#1a3c2e]"
                }`}
              >
                {item} Bulan
              </button>
            ))}

          </div>

        </div>

        {/* TUJUAN */}
        <div className="space-y-2">

          <label className="text-sm font-semibold text-gray-700">
            Tujuan Tabungan
          </label>

          <input
            type="text"
            value={tujuan}
            onChange={(e) =>
              setTujuan(
                e.target.value
              )
            }
            placeholder="Contoh: Tabungan masuk kuliah anak"
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-[#1a3c2e] focus:bg-white"
          />

        </div>

        {/* BUTTON */}
        <div className="flex items-center gap-2.5 sm:gap-3 pt-2">

          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-gray-200 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-gray-700 transition-all hover:bg-gray-50"
          >
            Batal
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#1a3c2e] py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white transition-all hover:bg-[#244d3c] disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />
                <span className="whitespace-nowrap">Menyimpan...</span>
              </>
            ) : (
              <>
                <GraduationCap className="h-4 w-4 flex-shrink-0" />
                <span className="whitespace-nowrap">Buat Tabungan</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
}