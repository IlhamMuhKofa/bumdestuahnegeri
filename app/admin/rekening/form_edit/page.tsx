"use client";

import { useState } from "react";

import {
  Building2,
  CreditCard,
  User,
  Loader2,
  Save,
} from "lucide-react";

import { updateRekening } from "../action";

type Props = {
  onClose: () => void;

  data: {
    id_rekening: number;
    nama_bank: string;
    no_rekening: string;
    atas_nama: string;
    is_active: boolean;
  };
};

export default function FormEdit({
  onClose,
  data,
}: Props) {
  const [namaBank, setNamaBank] =
    useState(data.nama_bank);

  const [nomorRekening, setNomorRekening] =
    useState(data.no_rekening);

  const [atasNama, setAtasNama] =
    useState(data.atas_nama);

  const [isActive, setIsActive] =
    useState(data.is_active);

  const [loading, setLoading] =
    useState(false);

  const handleSubmit =
    async () => {
      try {
        setLoading(true);

        const formData =
          new FormData();

        formData.append(
          "nama_bank",
          namaBank
        );

        formData.append(
          "nomor_rekening",
          nomorRekening
        );

        formData.append(
          "atas_nama",
          atasNama
        );

        formData.append(
          "is_active",
          String(isActive)
        );

        const result =
          await updateRekening(
            data.id_rekening,
            formData
          );

        alert(result.message);

        if (result.success) {
          onClose();

          window.location.reload();
        }
      } catch (error) {
        console.error(error);

        alert(
          "Terjadi kesalahan"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="overflow-hidden rounded-[32px] bg-white">

      {/* HEADER */}
      <div className="bg-[#1a3c2e] px-8 py-7 text-white">

        <p className="mb-2 text-xs font-semibold uppercase tracking-[3px] text-green-300">
          Admin BUMDes
        </p>

        <h2 className="text-3xl font-bold">
          Edit Rekening
        </h2>

        <p className="mt-2 text-sm text-gray-300">
          Perbarui data rekening pembayaran
        </p>

      </div>

      {/* CONTENT */}
      <div className="space-y-5 p-8">

        {/* BANK */}
        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">

            <Building2 className="h-4 w-4" />

            Nama Bank

          </label>

          <input
            type="text"
            value={namaBank}
            onChange={(e) =>
              setNamaBank(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-[#1a3c2e]"
          />

        </div>

        {/* REKENING */}
        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">

            <CreditCard className="h-4 w-4" />

            Nomor Rekening

          </label>

          <input
            type="text"
            value={
              nomorRekening
            }
            onChange={(e) =>
              setNomorRekening(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-[#1a3c2e]"
          />

        </div>

        {/* ATAS NAMA */}
        <div>

          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">

            <User className="h-4 w-4" />

            Atas Nama

          </label>

          <input
            type="text"
            value={atasNama}
            onChange={(e) =>
              setAtasNama(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-[#1a3c2e]"
          />

        </div>

        {/* ACTIVE */}
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 p-4">

          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) =>
              setIsActive(
                e.target.checked
              )
            }
            className="h-4 w-4"
          />

          <p className="text-sm font-medium text-gray-700">
            Jadikan rekening aktif
          </p>

        </div>

        {/* BUTTON */}
        <div className="flex items-center justify-end gap-3 pt-4">

          <button
            onClick={onClose}
            className="rounded-2xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Batal
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 rounded-2xl bg-[#1a3c2e] px-6 py-3 text-sm font-semibold text-white hover:bg-[#244d3c]"
          >

            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Simpan Perubahan
              </>
            )}

          </button>

        </div>

      </div>

    </div>
  );
}