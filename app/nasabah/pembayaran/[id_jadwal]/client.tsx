"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitTransferPayment } from "../../cicilan/action";

type Props = {
  jadwal: any;
};

export default function ClientPage({ jadwal }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [buktiBayar, setBuktiBayar] = useState("");
  const [preview, setPreview] = useState("");

  const [catatan, setCatatan] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const formatRupiah = (value?: number) =>
    "Rp " + (value || 0).toLocaleString("id-ID");

  // ================== UPLOAD ==================
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // preview lokal (langsung tampil)
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Upload gagal");
      }

      // ✅ simpan URL asli ke DB
      setBuktiBayar(result.url);
    } catch (error: any) {
      console.error(error);
      alert("Gagal upload gambar");
      setPreview("");
      setBuktiBayar("");
    } finally {
      setUploading(false);
    }
  };

  // ================== SUBMIT ==================
  const handleSubmit = async () => {
    try {
      if (!buktiBayar) {
        alert("Upload bukti pembayaran terlebih dahulu");
        return;
      }

      setLoading(true);

      await submitTransferPayment({
        idJadwal: jadwal.id_jadwal,
        buktiBayar,
        catatan,
      });

      alert("Pembayaran berhasil dikirim");

      router.push(`/nasabah/cicilan/${jadwal.id_peminjaman}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-10">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border shadow-sm p-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Pembayaran Transfer
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload bukti pembayaran cicilan
          </p>
        </div>

        {/* DETAIL */}
        <div className="mt-6 bg-gray-50 rounded-xl p-4 border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Cicilan ke</p>
              <p className="font-semibold text-gray-800">
                {jadwal.cicilan_ke}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">Tagihan</p>
              <p className="text-xl font-bold text-green-700">
                {formatRupiah(jadwal.jumlah_tagihan)}
              </p>
            </div>
          </div>
        </div>

        {/* UPLOAD */}
        <div className="mt-6">
          <label className="text-sm font-medium text-gray-700">
            Upload Bukti Pembayaran
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2 block w-full text-sm border rounded-xl p-3"
          />

          {uploading && (
            <p className="text-xs text-blue-500 mt-2">
              Uploading gambar...
            </p>
          )}
        </div>

        {/* PREVIEW */}
        {preview && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Preview
            </p>

            <div
              onClick={() => setShowPreview(true)}
              className="w-40 h-40 rounded-xl border overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition"
            >
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-xs text-gray-400 mt-1">
              Klik gambar untuk memperbesar
            </p>
          </div>
        )}

        {/* CATATAN */}
        <div className="mt-6">
          <label className="text-sm font-medium text-gray-700">
            Catatan (Opsional)
          </label>

          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Contoh: pembayaran dari BCA atas nama..."
            className="mt-2 w-full border rounded-xl p-4 text-sm min-h-[120px]"
          />
        </div>

        {/* BUTTON */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={() => router.back()}
            className="flex-1 border rounded-xl py-3 text-sm"
          >
            Kembali
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading || uploading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 text-sm disabled:opacity-50"
          >
            {loading ? "Mengirim..." : "Kirim Pembayaran"}
          </button>
        </div>
      </div>

      {/* MODAL PREVIEW */}
      {showPreview && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-2 right-2 text-white text-2xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition"
            >
              ×
            </button>

            <img
              src={preview}
              alt="Preview Large"
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}