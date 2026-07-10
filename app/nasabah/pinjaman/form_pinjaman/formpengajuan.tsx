"use client";

import React, { useState, useEffect } from 'react';
import { Calculator, Handshake, Wallet } from 'lucide-react';
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const FormPengajuan = () => {
  const [jumlahPinjaman, setJumlahPinjaman] = useState('10000000');
  const [jangkaWaktu, setJangkaWaktu] = useState('12');
  const [pekerjaan, setPekerjaan] = useState('');
  const [penghasilan, setPenghasilan] = useState('');
  const [jenisAgunan, setJenisAgunan] = useState('');
  const [rencanaUsaha, setRencanaUsaha] = useState('');
  const [fotoAgunan, setFotoAgunan] = useState<File | null>(null);
  const [fotoSurat, setFotoSurat] = useState<File | null>(null);
  const [setuju, setSetuju] = useState(false);
  const [jumlahPinjamanInput, setJumlahPinjamanInput] = useState('10000000');
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const triggerFile = (id: string) => {
    const input = document.getElementById(id);
    if (input) input.click();
  };

  // Kalkulasi
  const calculateLoan = () => {
    const pinjaman = parseInt(jumlahPinjaman) || 0;
    const bulan = parseInt(jangkaWaktu) || 1;
    const angsuranPerBulan = Math.floor(pinjaman / bulan);
    const totalBunga = Math.floor(pinjaman * 0.015); // Asumsi bunga 1.5%
    const totalPembayaran = pinjaman + totalBunga;

    return {
      angsuranPerBulan,
      totalBunga,
      totalPembayaran
    };
  };

  const hasil = calculateLoan();

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  // Tampilan angka dengan pemisah ribuan, tanpa mengubah state mentahnya
  const formatNumberDisplay = (value: string) => {
    if (!value) return '';
    const num = Number(value);
    if (Number.isNaN(num)) return '';
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const handleFileChange = (e: any, setFile: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ VALIDASI TYPE (lebih fleksibel)
    if (
      !file.type.startsWith("image/") &&
      !file.type.includes("pdf")
    ) {
      toast.error("File harus berupa gambar atau PDF!");
      return;
    }

    // ✅ VALIDASI SIZE (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB!");
      return;
    }

    // ✅ SIMPAN FILE
    setFile(file);
  };

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);


    //validasi
    if (!fotoAgunan) {
      toast.error("Foto agunan wajib diisi!");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();

      formData.append("jumlahPinjaman", jumlahPinjamanInput);
      formData.append("jangkaWaktu", jangkaWaktu);
      formData.append("pekerjaan", pekerjaan);
      formData.append("penghasilan", penghasilan);
      formData.append("jenisAgunan", jenisAgunan);
      formData.append("rencanaUsaha", rencanaUsaha);

      if (fotoAgunan) {
        formData.append("fotoAgunan", fotoAgunan);
      }

      if (fotoSurat) {
        formData.append("fotoSurat", fotoSurat);
      }

      const res = await fetch("/api/peminjaman", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("Status:", res.status);
      console.log("Response:", data);

      if (!res.ok) {
        toast.error(data.error || "Terjadi kesalahan saat mengajukan pinjaman.");
        return;
      }

      setSubmitted(true);

      toast.success("Pengajuan pinjaman berhasil dikirim!");
      // tunggu sebentar agar toast sempat terlihat
      setTimeout(() => {
        router.push("/nasabah/cicilan");
      }, 1200);

    } catch (err) {
      console.error(err);
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      if (previewFile) URL.revokeObjectURL(previewFile);
    };
  }, [previewFile]);

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto sm:p-4 md:p-8">

        {/* Kalkulator Section */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-6">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Cek Cicilan di Sini</h2>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm mb-5 sm:mb-6">
            Masukkan data berikut untuk menghitung estimasi angsuran
          </p>

<div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {/* Jumlah Pinjaman */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Jumlah Pinjaman
              </label>
              <p className="text-xs text-gray-400 mb-2">
                Kelipatan Rp1.000.000, min Rp1.000.000 - maks Rp10.000.000
              </p>

              <div className="flex items-center gap-2">
                {/* TOMBOL KURANG */}
                <button
                  type="button"
                  disabled={loading || submitted || parseInt(jumlahPinjaman) <= 1000000}
                  onClick={() =>
                    setJumlahPinjaman((prev) => {
                      const next = Math.max(1000000, (parseInt(prev) || 0) - 1000000);
                      return String(next);
                    })
                  }
                  className="shrink-0 w-11 h-11 flex items-center justify-center rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed hover:border-green-400 hover:text-green-600 transition"
                >
                  −
                </button>

                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm sm:text-base pointer-events-none">
                    Rp
                  </span>
                  <input
                    disabled={loading || submitted}
                    type="text"
                    inputMode="numeric"
                    value={formatNumberDisplay(jumlahPinjaman)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (Number(value) <= 10000000) {
                        setJumlahPinjaman(value);
                      }
                    }}
                    onBlur={() => {
                      setJumlahPinjaman((prev) => {
                        let angka = parseInt(prev) || 0;
                        let snapped = Math.round(angka / 1000000) * 1000000;
                        if (snapped < 1000000) snapped = 1000000;
                        if (snapped > 10000000) snapped = 10000000;
                        return String(snapped);
                      });
                    }}
                    className="w-full pl-11 sm:pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl
focus:border-[#1a3c2e] focus:ring-2 focus:ring-[#1a3c2e]/20
outline-none text-gray-800 text-sm sm:text-base transition-all duration-200"
                    placeholder="10.000.000"
                  />
                </div>

                {/* TOMBOL TAMBAH */}
                <button
                  type="button"
                  disabled={loading || submitted || parseInt(jumlahPinjaman) >= 10000000}
                  onClick={() =>
                    setJumlahPinjaman((prev) => {
                      const next = Math.min(10000000, (parseInt(prev) || 0) + 1000000);
                      return String(next);
                    })
                  }
                  className="shrink-0 w-11 h-11 flex items-center justify-center rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed hover:border-green-400 hover:text-green-600 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Jangka Waktu */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Jangka Waktu
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["6", "12", "18"].map((bulan) => (
                  <button
                    key={bulan}
                    type="button"
                    disabled={loading || submitted}
                    onClick={() => setJangkaWaktu(bulan)}
                    className={`py-3 rounded-xl font-semibold text-sm transition-all ${
                      jangkaWaktu === bulan
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {bulan} Bln
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hasil Kalkulasi */}
          <div className="bg-gradient-to-br from-green-700 to-green-700 rounded-2xl shadow-xl p-5 sm:p-6 text-white">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm flex-shrink-0">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold">Estimasi Angsuran</h3>
            </div>

            <div className="space-y-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-xs sm:text-sm text-green-100 mb-1">Angsuran per Bulan</p>
                <p className="text-xl sm:text-2xl font-bold break-words">
                  {formatRupiah(hasil.angsuranPerBulan)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                  <p className="text-xs text-green-100 mb-1">Total Bunga</p>
                  <p className="text-sm sm:text-base font-bold break-words">
                    {formatRupiah(hasil.totalBunga)}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                  <p className="text-xs text-green-100 mb-1">Total Bayar</p>
                  <p className="text-sm sm:text-base font-bold break-words">
                    {formatRupiah(hasil.totalPembayaran)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Note */}

          {/* Note */}
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs sm:text-sm text-gray-700">
              <span className="font-semibold">Note :</span> Untuk Nasabah baru hanya dapat mengajukan pinjaman{' '}
              <span className="font-bold">maksimal Rp 10.000.000</span>
            </p>
          </div>
        </div>

        {/* Form Pengajuan */}
        <div className="bg-[#1a3c2e] rounded-2xl p-4 sm:p-6 md:p-8">
          <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
            <Handshake className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-2 px-2">
            Ajukan Pinjamanmu Sekarang
          </h2>
          <p className="text-white/90 text-center text-xs sm:text-sm mb-6 sm:mb-8 px-2">
            Lengkapi datamu untuk mulai ajukan pinjaman
          </p>

          <form
            onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 sm:p-6 md:p-8">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Jumlah Pinjaman */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Jumlah Pinjaman
                </label>
                <select
                  disabled={loading || submitted}
                  value={jumlahPinjamanInput}
                  onChange={(e) => setJumlahPinjamanInput(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-gray-800 text-sm sm:text-base"
                >
                  <option value="">Pilih jumlah pinjaman</option>
                  <option value="5000000">Rp 5.000.000</option>
                  <option value="10000000">Rp 10.000.000</option>
                  <option value="15000000">Rp 15.000.000</option>
                  <option value="20000000">Rp 20.000.000</option>
                </select>
              </div>

              {/* Jangka Waktu */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Jangka Waktu
                </label>

                <select
                  disabled={loading || submitted}
                  value={jangkaWaktu}
                  onChange={(e) => setJangkaWaktu(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-gray-800 text-sm sm:text-base"
                >
                  <option value="">Pilih jangka waktu</option>
                  <option value="6">6 Bulan</option>
                  <option value="12">12 Bulan</option>
                  <option value="18">18 Bulan</option>
                  <option value="24">24 Bulan</option>
                </select>
              </div>

              {/* Pekerjaan */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Pekerjaan
                </label>
                <input
                  type="text"
                  value={pekerjaan}
                  onChange={(e) => setPekerjaan(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-gray-800 text-sm sm:text-base"
                  placeholder="Masukkan pekerjaan Anda"
                />
              </div>

              {/* Penghasilan */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Penghasilan
                </label>
                <select
                  disabled={loading || submitted}
                  value={penghasilan}
                  onChange={(e) => setPenghasilan(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-gray-800 text-sm sm:text-base"
                >
                  <option value="">Pilih penghasilan</option>
                  <option value="1000000">Rp 1.000.000 - Rp 2.000.000</option>
                  <option value="3000000">Rp 3.000.000 - Rp 5.000.000</option>
                  <option value="6000000">Rp 6.000.000 - Rp 10.000.000</option>
                  <option value="10000000">Di atas Rp 10.000.000</option>
                </select>
              </div>

              {/* Jenis Agunan */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Jenis Agunan
                </label>
                <select
                  disabled={loading || submitted}
                  value={jenisAgunan}
                  onChange={(e) => setJenisAgunan(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-gray-800 text-sm sm:text-base"
                >
                  <option value="">Pilih jenis agunan</option>
                  <option value="bpkb">BPKB Kendaraan</option>
                  <option value="sertifikat">Sertifikat Tanah</option>
                  <option value="elektronik">Elektronik</option>
                </select>
              </div>

              {/* Rencana Usaha */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Rencana Usaha
                </label>
                <input
                  disabled={loading || submitted}
                  type="text"
                  value={rencanaUsaha}
                  onChange={(e) => setRencanaUsaha(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-gray-800 text-sm sm:text-base"
                  placeholder="Jelaskan rencana usaha Anda"
                />
              </div>

              {/* Foto Agunan */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Foto Agunan
                </label>

                <div className="relative">
                  <input
                    disabled={loading || submitted}
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileChange(e, setFotoAgunan)}
                    className="hidden"
                    id="fotoAgunan"
                  />

                  <div className="flex items-center justify-between gap-2 w-full px-3 sm:px-4 py-3 bg-white border border-gray-200 rounded-xl">

                    {/* Nama file */}
                    <span className="text-gray-500 text-xs sm:text-sm truncate min-w-0">
                      {fotoAgunan ? fotoAgunan.name : "Pilih file..."}
                    </span>

                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      {/* Preview */}
                      {fotoAgunan && (
                        <button
                          type="button"
                          onClick={() => {
                            const url = URL.createObjectURL(fotoAgunan);
                            setPreviewFile(url);
                            setPreviewType(fotoAgunan.type);
                          }}
                          className="text-xs text-[#1a3c2e] font-medium hover:underline whitespace-nowrap"
                        >
                          Preview
                        </button>
                      )}

                      {/* Button */}
                      <button
                        type="button"
                        disabled={loading || submitted}
                        onClick={() => triggerFile("fotoAgunan")}
                        className="bg-[#1a3c2e] text-white px-3 py-1.5 rounded-lg text-xs hover:opacity-90 transition whitespace-nowrap"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Foto Surat Ket Usaha */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Surat SP2K
                </label>

                <div className="relative">
                  <input
                    disabled={loading || submitted}
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileChange(e, setFotoSurat)}
                    className="hidden"
                    id="fotoSurat"
                  />

                  <div className="flex items-center justify-between gap-2 w-full px-3 sm:px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl">

                    {/* Nama file */}
                    <span className="text-gray-500 text-xs sm:text-sm truncate min-w-0">
                      {fotoSurat ? fotoSurat.name : "Belum ada file"}
                    </span>

                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      {/* Preview */}
                      {fotoSurat && (
                        <button
                          type="button"
                          onClick={() => {
                            const url = URL.createObjectURL(fotoSurat);
                            setPreviewFile(url);
                            setPreviewType(fotoSurat.type);
                          }}
                          className="text-xs text-blue-600 font-medium hover:underline whitespace-nowrap"
                        >
                          Preview
                        </button>
                      )}

                      {/* Button */}
                      <button
                        type="button"
                        disabled={loading || submitted}
                        onClick={() => triggerFile("fotoSurat")}
                        className="bg-[#1a3c2e] text-white px-3 py-1.5 rounded-lg text-xs hover:opacity-90 transition whitespace-nowrap"
                      >
                        Pilih File
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkbox S&K */}
            <div className="mt-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={setuju}
                  onChange={(e) => setSetuju(e.target.checked)}
                  className="mt-1 w-5 h-5 flex-shrink-0 text-[#1a3c2e] border-gray-300 rounded
  focus:ring-[#1a3c2e]"
                  disabled={loading || submitted}
                />
                <span className="text-gray-700 text-sm">
                  Saya menyetujui S&K
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || submitted || !setuju}
              className="w-full bg-[#1a3c2e] hover:bg-[#142f24] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none text-white
              font-semibold py-3 rounded-xl mt-6 text-sm sm:text-base transition-all duration-300 shadow-md hover:shadow-lg">
              {loading ? "Mengirim Pengajuan..." : "Ajukan Sekarang"}
            </button>
          </form>
        </div>
      </div>
      {previewFile && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] shadow-lg overflow-hidden flex flex-col">

            {/* HEADER */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50 flex-shrink-0">

              <h3 className="text-sm font-medium text-gray-700 truncate pr-2">
                {previewType?.includes("pdf")
                  ? "Preview Dokumen PDF"
                  : "Preview Gambar"}
              </h3>

              <button
                onClick={() => {
                  URL.revokeObjectURL(previewFile);
                  setPreviewFile(null);
                  setPreviewType(null);
                }}
                className="flex-shrink-0 text-gray-500 hover:text-black text-lg font-bold leading-none p-1"
                aria-label="Tutup preview"
              >
                ✕
              </button>
            </div>

            {/* CONTENT */}
            <div className="flex justify-center items-center bg-gray-100 overflow-auto">
              {previewType?.includes("pdf") ? (
                <iframe
                  src={previewFile}
                  className="w-full h-[70vh] sm:h-[600px]"
                />
              ) : (
                <div className="p-4 sm:p-6">
                  <img
                    src={previewFile}
                    className="max-h-[60vh] sm:max-h-[600px] max-w-full object-contain rounded-lg"
                  />
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormPengajuan;