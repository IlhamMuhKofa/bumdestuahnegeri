"use client";

import { useState } from "react";

import CardSimpanan from "./component/CardSimpanan";
import TabelSimpanan from "./component/TabelSimpanan";
import { bayarCashMassal, buatTabunganPendidikan, updateStatusPembayaran } from "./action";
import { toast } from "react-toastify";
import ModalJadwalWajib from "./component/ModalJadwalWajib";
import ModalBayar from "./component/ModalBayar";
import ModalDetail from "./component/ModalDetail";
import ModalBayarPendidikan from "./component/bayartabungan";


type Props = {
  anggota: {
    id: number;
    nama: string;
    email: string;
    no_hp: string | null;
  };

  simpananWajib: any[];
  simpananPendidikan: any[];
};

type TabType =
  | "WAJIB"
  | "PENDIDIKAN";

export default function Client({
  anggota,
  simpananWajib,
  simpananPendidikan,
}: Props) {
  const [activeTab, setActiveTab] =
    useState<TabType>("WAJIB");

  const isWajib =
    activeTab === "WAJIB";

  const currentData =
    isWajib
      ? simpananWajib
      : simpananPendidikan;

  const [openModalWajib, setOpenModalWajib] =
    useState(false);

  const [openModalBayar, setOpenModalBayar] =
    useState(false);

const [openModalBayarPendidikan, setOpenModalBayarPendidikan] =
  useState(false);

const [selectedPendidikan, setSelectedPendidikan] =
  useState<any | null>(null);

  const pendidikan =
  simpananPendidikan?.[0] || null;

  const daftarTagihan =
    simpananWajib.flatMap(
      (item) =>
        item.pembayaran || []
    );

  const [openDetail, setOpenDetail] =
    useState(false);

  const [selectedPembayaran, setSelectedPembayaran] =
    useState<any>(null);

  const handleDetail = (
    pembayaran: any
  ) => {
    setSelectedPembayaran(
      pembayaran
    );

    setOpenDetail(true);
  };

  const handleApprove = async (
    id: number
  ) => {
    const ok = window.confirm(
      "Approve pembayaran ini?"
    );

    if (!ok) return;

    const result =
      await updateStatusPembayaran(
        id,
        "BERHASIL"
      );

    if (result.success) {
      toast.success("Pembayaran berhasil disetujui.");
      window.location.reload();
    }
  };

  const handleReject = async (
    id: number
  ) => {
    const ok = window.confirm(
      "Tolak pembayaran ini?"
    );

    if (!ok) return;

    const result =
      await updateStatusPembayaran(
        id,
        "DITOLAK"
      );

    if (result.success) {
      toast.success("Pembayaran berhasil ditolak.");
      window.location.reload();
    }
  };

  const hasJadwalWajib =
    simpananWajib.length > 0;

  const handleBuatPendidikan = async () => {
    const result = await buatTabunganPendidikan(anggota.id);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    window.location.reload();
  };

  const handleSubmitPembayaran =
    async (data: {
      idsPembayaran: number[];
      tanggal_bayar: string;
      bukti: File | null;
    }) => {
      try {

        let buktiUrl: string | undefined;

        // =====================
        // UPLOAD BUKTI
        // =====================
        if (data.bukti) {

          const formData =
            new FormData();

          formData.append(
            "file",
            data.bukti
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

          buktiUrl =
            resultUpload.url;
        }

        // =====================
        // SIMPAN PEMBAYARAN
        // =====================
        const result =
          await bayarCashMassal(
            data.idsPembayaran,
            data.tanggal_bayar,
            buktiUrl
          );

        if (!result.success) {
          toast.error(
            result.message
          );
          return;
        }

        toast.success(
          result.message
        );

        setOpenModalBayar(false);

        window.location.reload();

      } catch (error) {

        console.error(error);

        toast.error(
          "Gagal menyimpan pembayaran"
        );
      }
    };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <div className="overflow-hidden rounded-3xl bg-blue-900">
          <div className="p-8">

            <p className="text-xs font-semibold uppercase tracking-[3px] text-white">
              Data Nasabah
            </p>

            <h1 className="mt-2 text-3xl font-bold text-white">
              {anggota.nama}
            </h1>

            <div className="mt-4 flex flex-wrap gap-6 text-sm text-white">

              <div>
                <span className="font-semibold">
                  Email:
                </span>{" "}
                {anggota.email}
              </div>

              <div>
                <span className="font-semibold">
                  No HP:
                </span>{" "}
                {anggota.no_hp || "-"}
              </div>

            </div>

          </div>
        </div>

        {/* TAB MENU */}
        <div className="rounded-3xl border border-gray-200 bg-white p-2 shadow-sm">

          <div className="flex gap-2">

            <button
              onClick={() =>
                setActiveTab("WAJIB")
              }
              className={`flex-1 rounded-2xl px-5 py-3 text-sm font-semibold transition-all ${activeTab === "WAJIB"
                ? "bg-blue-800 text-white shadow"
                : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              Simpanan Wajib
            </button>

            <button
              onClick={() =>
                setActiveTab(
                  "PENDIDIKAN"
                )
              }
              className={`flex-1 rounded-2xl px-5 py-3 text-sm font-semibold transition-all ${activeTab ===
                "PENDIDIKAN"
                ? "bg-blue-800 text-white shadow"
                : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              Simpanan Pendidikan
            </button>

          </div>

        </div>

        {/* CONTENT */}
        <CardSimpanan
          title={
            isWajib
              ? "Simpanan Wajib"
              : "Simpanan Pendidikan"
          }
          data={currentData}
          idAnggota={anggota.id}
          hasJadwal={hasJadwalWajib}
          onOpenModalJadwal={() =>
            setOpenModalWajib(true)
          }
          onOpenModalBayar={() => {
            if (isWajib) {
              setOpenModalBayar(true);
            } else {
              setOpenModalBayarPendidikan(
                true
              );
            }
          }}
        />

        <TabelSimpanan
          title={
            isWajib
              ? "Simpanan Wajib"
              : "Simpanan Pendidikan"
          }
          data={currentData}
          onApprove={handleApprove}
          onReject={handleReject}
          onDetail={handleDetail}
        />

        {/* {!isWajib && simpananPendidikan.length === 0 && (
          <div className="rounded-3xl border border-dashed border-green-200 bg-white p-10 text-center">
            <h3 className="text-lg font-bold text-gray-800">
              Belum ada tabungan pendidikan
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Buat tabungan pendidikan agar jadwal dan setoran bisa dikelola.
            </p>
            <button
              onClick={handleBuatPendidikan}
              className="mt-5 rounded-xl bg-[#1a3c2e] px-5 py-3 text-sm font-semibold text-white hover:bg-[#244d3c]"
            >
              Buat Tabungan Pendidikan
            </button>
          </div>
        )} */}

        <ModalJadwalWajib
          open={openModalWajib}
          onClose={() =>
            setOpenModalWajib(false)
          }
          idAnggota={anggota.id}
        />

        <ModalBayar
          open={openModalBayar}
          onClose={() => setOpenModalBayar(false)}
          tagihan={daftarTagihan}
          onSubmit={handleSubmitPembayaran}
        />

        <ModalDetail
          open={openDetail}
          onClose={() =>
            setOpenDetail(false)
          }
          pembayaran={
            selectedPembayaran
          }
        />

<ModalBayarPendidikan
  open={openModalBayarPendidikan}
  onClose={() =>
    setOpenModalBayarPendidikan(false)
  }
  anggota={anggota}
  simpanan={
    pendidikan
  }
/>

      </div>
    </div>
  );
}
