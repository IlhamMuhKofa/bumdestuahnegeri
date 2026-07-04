"use client";

import { useState } from "react";

import {
  Landmark,
  Plus,
  BadgeCheck,
  Circle,
  Pencil,
  Trash2,
  Power,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import FormTambah from "./form/FormTambah";
import FormEdit from "./form_edit/FormEdit";

import {
  aktifkanRekening,
  nonaktifkanRekening,
  hapusRekening,
} from "./action";

type Props = {
  data: any[];
};

export default function Client({
  data,
}: Props) {
  const [openForm, setOpenForm] =
    useState(false);

  const handleAktifkan =
    async (id: number) => {
      const result =
        await aktifkanRekening(
          id
        );

      alert(result.message);

      window.location.reload();
    };

  const handleNonaktifkan =
    async (id: number) => {
      const result =
        await nonaktifkanRekening(
          id
        );

      alert(result.message);

      window.location.reload();
    };

  const [openEdit, setOpenEdit] =
    useState(false);

  const [selectedData, setSelectedData] =
    useState<any>(null);

  const handleHapus =
    async (id: number) => {
      const confirmDelete =
        confirm(
          "Yakin ingin menghapus rekening ini?"
        );

      if (!confirmDelete)
        return;

      const result =
        await hapusRekening(
          id
        );

      alert(result.message);

      window.location.reload();
    };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold text-gray-800">
              Rekening Pembayaran
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Kelola rekening tujuan pembayaran BUMDes
            </p>

          </div>

          <button
            onClick={() =>
              setOpenForm(true)
            }
            className="flex items-center gap-2 rounded-2xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-800"
          >

            <Plus className="h-4 w-4" />

            Tambah Rekening

          </button>

        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

          <table className="w-full text-sm">

            <thead>
              <tr className="bg-blue-800 text-white">

                <th className="p-4 text-left">
                  Bank
                </th>

                <th className="text-left">
                  Nomor Rekening
                </th>

                <th className="text-left">
                  Atas Nama
                </th>

                <th className="text-center">
                  Status
                </th>

                <th className="text-center">
                  Aksi
                </th>

              </tr>
            </thead>

            <tbody>

              {data.map(
                (item: any) => (
                  <tr
                    key={
                      item.id_rekening
                    }
                    className="border-t hover:bg-gray-50"
                  >

                    {/* BANK */}
                    <td className="p-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1a3c2e]/10">

                          <Landmark className="h-5 w-5 text-blue-700" />

                        </div>

                        <div>

                          <p className="font-semibold text-gray-800">
                            {
                              item.nama_bank
                            }
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* REKENING */}
                    <td className="font-medium text-gray-700">
                      {
                        item.no_rekening
                      }
                    </td>

                    {/* ATAS NAMA */}
                    <td className="font-medium text-gray-700">
                      {
                        item.atas_nama
                      }
                    </td>

                    {/* STATUS */}
                    <td className="text-center">

                      {item.is_active ? (
                        <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                          <BadgeCheck className="h-3.5 w-3.5" />

                          Aktif

                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">

                          <Circle className="h-3 w-3" />

                          Tidak Aktif

                        </div>
                      )}

                    </td>

                    {/* AKSI */}
                    <td className="px-4 py-4">

                      <div className="flex items-center justify-center gap-2">

                        {/* AKTIF/NONAKTIF */}
                        {item.is_active ? (
                          <button
                            onClick={() =>
                              handleNonaktifkan(
                                item.id_rekening
                              )
                            }
                            className="flex items-center gap-1 rounded-xl bg-orange-100 px-3 py-2 text-xs font-semibold text-orange-700 transition-all hover:bg-orange-200"
                          >

                            <Power className="h-3.5 w-3.5" />

                            Nonaktifkan

                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleAktifkan(
                                item.id_rekening
                              )
                            }
                            className="flex items-center gap-1 rounded-xl bg-[#1a3c2e] px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-[#244d3c]"
                          >

                            <BadgeCheck className="h-3.5 w-3.5" />

                            Aktifkan

                          </button>
                        )}

                        {/* EDIT */}
                        <button
                          onClick={() => {
                            setSelectedData(item);

                            setOpenEdit(true);
                          }}
                          className="flex items-center gap-1 rounded-xl bg-blue-100 px-3 py-2 text-xs font-semibold text-blue-700 transition-all hover:bg-blue-200"
                        >

                          <Pencil className="h-3.5 w-3.5" />

                          Edit

                        </button>

                        {/* HAPUS */}
                        <button
                          onClick={() =>
                            handleHapus(
                              item.id_rekening
                            )
                          }
                          className="flex items-center gap-1 rounded-xl bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 transition-all hover:bg-red-200"
                        >

                          <Trash2 className="h-3.5 w-3.5" />

                          Hapus

                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

          {/* EMPTY */}
          {data.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">

              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">

                <Landmark className="h-8 w-8 text-gray-400" />

              </div>

              <h3 className="text-lg font-semibold text-gray-700">
                Belum ada rekening
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                Tambahkan rekening pembayaran terlebih dahulu
              </p>

            </div>
          )}

        </div>

      </div>

      {/* MODAL */}
      <AnimatePresence>
        {openForm && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto px-4 py-8"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >

            {/* BACKDROP */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() =>
                setOpenForm(false)
              }
            />

            {/* CONTENT */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              transition={{
                duration: 0.2,
              }}
              className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[32px] bg-white shadow-[0_20px_80px_rgba(0,0,0,0.25)]"
            >

              {/* CLOSE */}
              <button
                onClick={() =>
                  setOpenForm(false)
                }
                className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/90 text-gray-600 shadow-md"
              >
                ✕
              </button>

              {/* FORM */}
              <FormTambah
                onClose={() =>
                  setOpenForm(false)
                }
              />

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openEdit && selectedData && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto px-4 py-8"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >

            {/* BACKDROP */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() =>
                setOpenEdit(false)
              }
            />

            {/* CONTENT */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              transition={{
                duration: 0.2,
              }}
              className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[32px] bg-white shadow-[0_20px_80px_rgba(0,0,0,0.25)]"
            >

              {/* CLOSE */}
              <button
                onClick={() =>
                  setOpenEdit(false)
                }
                className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/90 text-gray-600 shadow-md"
              >
                ✕
              </button>

              <FormEdit
                data={selectedData}
                onClose={() =>
                  setOpenEdit(false)
                }
              />

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}