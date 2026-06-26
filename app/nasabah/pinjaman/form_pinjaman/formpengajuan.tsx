"use client";

import React, { useState, useEffect } from 'react';
import { Calculator, Handshake, Eye } from 'lucide-react';

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
  // const [previewAgunan, setPreviewAgunan] = useState<string | null>(null);
  // const [previewSurat, setPreviewSurat] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<string | null>(null);

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

  const handleFileChange = (e: any, setFile: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ VALIDASI TYPE (lebih fleksibel)
    if (
      !file.type.startsWith("image/") &&
      !file.type.includes("pdf")
    ) {
      alert("File harus berupa gambar atau PDF!");
      return;
    }

    // ✅ VALIDASI SIZE (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file maksimal 2MB!");
      return;
    }

    // ✅ SIMPAN FILE
    setFile(file);
  };

  async function handleSubmit(e: any) {
    e.preventDefault();

    // ✅ VALIDASI DULU
    if (!fotoAgunan) {
      alert("Foto agunan wajib diisi!");
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
        body: formData, // 🔥 TANPA JSON, TANPA HEADER

      });

      const data = await res.json();

      if (data.success) {
        alert("Pengajuan berhasil dikirim!");
        window.location.reload();
      } else {
        alert("Gagal mengajukan");
      }

    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    return () => {
      if (previewFile) URL.revokeObjectURL(previewFile);
    };
  }, [previewFile]);

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4">
      <div className="max-w-2x3 mx-md p-8">

        {/* Kalkulator Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">Cek Cicilan di Sini</h2>
          </div>
          <p className="text-gray-600 text-sm mb-6">
            Masukkan data berikut untuk menghitung estimasi angsuran
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Jumlah Pinjaman */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Jumlah Pinjaman
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  Rp
                </span>
                <input
                  type="text"
                  value={jumlahPinjaman}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setJumlahPinjaman(value);
                  }}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl 
focus:border-[#1a3c2e] focus:ring-2 focus:ring-[#1a3c2e]/20 
outline-none text-gray-800 transition-all duration-200"
                  placeholder="10.000.000"
                />
              </div>
            </div>

            {/* Jangka Waktu */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Jangka Waktu
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={jangkaWaktu}
                  onChange={(e) => setJangkaWaktu(e.target.value)}
                  className="w-full pl-4 pr-20 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-gray-800 font-medium"
                  placeholder="12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  /bulan
                </span>
              </div>
            </div>
          </div>

          {/* Hasil Kalkulasi */}
          <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Hasil Kalkulasi</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Angsuran per bulan</span>
                <span className="text-gray-800 font-semibold">
                  {formatRupiah(hasil.angsuranPerBulan)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Total Bunga</span>
                <span className="text-gray-800 font-semibold">
                  {formatRupiah(hasil.totalBunga)}
                </span>
              </div>
              <div className="h-px bg-gray-200 my-2" />
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Total Pembayaran</span>
                <span className="text-green-600 font-bold text-lg">
                  {formatRupiah(hasil.totalPembayaran)}
                </span>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Note :</span> Untuk Nasabah baru hanya dapat mengajukan pinjaman{' '}
              <span className="font-bold">maksimal Rp 10.000.000</span>
            </p>
          </div>
        </div>

        {/* Form Pengajuan */}
        <div className="bg-[#1a3c2e] rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Handshake className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            Ajukan Pinjamanmu Sekarang
          </h2>
          <p className="text-white/90 text-center text-sm mb-8">
            Lengkapi datamu untuk mulai ajukan pinjaman
          </p>

          <form
            onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Jumlah Pinjaman */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Jumlah Pinjaman
                </label>
                <select
                  value={jumlahPinjamanInput}
                  onChange={(e) => setJumlahPinjamanInput(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-gray-800"
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
                  value={jangkaWaktu}
                  onChange={(e) => setJangkaWaktu(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-gray-800"
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
                  className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-gray-800"
                  placeholder="Masukkan pekerjaan Anda"
                />
              </div>

              {/* Penghasilan */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Penghasilan
                </label>
                <select
                  value={penghasilan}
                  onChange={(e) => setPenghasilan(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-gray-800"
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
                  value={jenisAgunan}
                  onChange={(e) => setJenisAgunan(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-gray-800"
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
                  type="text"
                  value={rencanaUsaha}
                  onChange={(e) => setRencanaUsaha(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-gray-800"
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
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileChange(e, setFotoAgunan)}
                    className="hidden"
                    id="fotoAgunan"
                  />

                  <div className="flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-200 rounded-xl">

                    {/* Nama file */}
                    <span className="text-gray-500 text-sm truncate">
                      {fotoAgunan ? fotoAgunan.name : "Pilih file..."}
                    </span>

                    <div className="flex items-center gap-3">
                      {/* Preview */}
                      {fotoAgunan && (
                        <button
                          type="button"
                          onClick={() => {
                            const url = URL.createObjectURL(fotoAgunan);
                            setPreviewFile(url);
                            setPreviewType(fotoAgunan.type);
                          }}
                          className="text-xs text-[#1a3c2e] font-medium hover:underline"
                        >
                          Preview
                        </button>
                      )}

                      {/* Button */}
                      <button
                        type="button"
                        onClick={() => triggerFile("fotoAgunan")}
                        className="bg-[#1a3c2e] text-white px-3 py-1.5 rounded-lg text-xs hover:opacity-90 transition"
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
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileChange(e, setFotoSurat)}
                    className="hidden"
                    id="fotoSurat"
                  />

                  {/* 🔥 Tambah pr-24 */}
                  <div className="flex items-center justify-between w-full px-4 py-3 pr-24 bg-gray-100 border-2 border-gray-200 rounded-xl">

                    {/* Nama file */}
                    <span className="text-gray-500 text-sm truncate">
                      {fotoSurat ? fotoSurat.name : "No file chosen"}
                    </span>

                    {/* Preview */}
                    {fotoSurat && (
                      <button
                        type="button"
                        onClick={() => {
                          const url = URL.createObjectURL(fotoSurat);
                          setPreviewFile(url);
                          setPreviewType(fotoSurat.type);
                        }}
                        className="text-xs text-blue-600 hover:underline ml-2 whitespace-nowrap translate-x-[-20px]"
                      >
                        Preview
                      </button>
                    )}
                  </div>

                  {/* Choose */}
                  <button
                    type="button"
                    onClick={() => triggerFile("fotoSurat")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#1a3c2e] text-white px-4 py-1 rounded-lg text-sm"
                  >
                    Choose
                  </button>
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
                  className="mt-1 w-5 h-5 text-[#1a3c2e] border-gray-300 rounded 
  focus:ring-[#1a3c2e]"
                />
                <span className="text-gray-700 text-sm">
                  Saya menyetujui S&K
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button className="w-full bg-[#1a3c2e] hover:bg-[#142f24] 
text-white font-semibold py-3 rounded-xl mt-6 
transition-all duration-300 shadow-md hover:shadow-lg">
              Ajukan Sekarang
            </button>
          </form>
        </div>
      </div>
      {previewFile && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl w-full max-w-4xl shadow-lg overflow-hidden">

            {/* 🔥 HEADER */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">

              <h3 className="text-sm font-medium text-gray-700 truncate">
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
                className="text-gray-500 hover:text-black text-lg font-bold translate-x-[-10px]"
              >
                ✕
              </button>
            </div>

            {/* 🔥 CONTENT */}
            <div className="flex justify-center items-center bg-gray-100">
              {previewType?.includes("pdf") ? (
                <iframe
                  src={previewFile}
                  className="w-full h-[600px]"
                />
              ) : (
                <div className="p-6">
                  <img
                    src={previewFile}
                    className="max-h-[600px] object-contain rounded-lg"
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