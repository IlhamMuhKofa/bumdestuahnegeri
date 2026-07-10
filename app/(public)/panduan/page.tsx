"use client";

import React, { useState, useEffect } from 'react';
import { FileText, UserCheck, DollarSign, FileCheck, Wallet, Calculator, TrendingUp, Clock, Receipt } from 'lucide-react';

const LoanCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(5000000);
  const [duration, setDuration] = useState<number>(12);
  const [results, setResults] = useState<{
    cicilan_per_bulan: number;
  } | null>(null);

  const nominalValid =
    loanAmount >= 1000000 &&
    loanAmount <= 30000000 &&
    loanAmount % 1000000 === 0;
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Interest rate: 1.5% per month = 18% per year
  const monthlyInterestRate = 0.015; // 1.5%

  useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => setIsCalculating(false), 300);
    return () => clearTimeout(timer);
  }, [loanAmount, duration]);

  useEffect(() => {

    async function loadSimulasi() {

      try {

        const res = await fetch(
          `/api/simulasi?jumlah=${loanAmount}&tenor=${duration}`
        );

        const json = await res.json();

        if (json.success) {
          setResults(json.data);
        } else {
          setResults(null);
        }

      } catch (err) {
        console.error(err);
        setResults(null);
      }

    }

    if (nominalValid) {
      loadSimulasi();
    } else {
      setResults(null);
    }

  }, [loanAmount, duration, nominalValid]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  const steps = [
    {
      number: '01',
      title: 'Step 1: Daftar Sebagai Anggota',
      description: 'Calon peminjam harus terlebih dahulu terdaftar sebagai anggota resmi BUMDes Tuah Negeri. Pendaftaran dapat dilakukan melalui website atau datang langsung ke kantor BUMDes.'
    },
    {
      number: '02',
      title: 'Step 2: Ajukan Permohonan Pinjaman',
      description: 'Setelah menjadi anggota, lengkapi formulir pengajuan pinjaman dengan informasi kebutuhan dana serta tujuan penggunaan.'
    },
    {
      number: '03',
      title: 'Step 3: Lengkapi Persyaratan',
      description: 'Lampirkan dokumen yang dibutuhkan seperti KTP, KK, surat jaminan (bila ada), dan informasi pendukung lainnya.'
    },
    {
      number: '04',
      title: 'Step 4: Verifikasi dan Persetujuan',
      description: 'Petugas akan memverifikasi data dan menghubungi Anda terkait hasil persetujuan pinjaman, termasuk jumlah yang disetujui dan skema angsuran.'
    },
    {
      number: '05',
      title: 'Step 5: Pencairan Dana',
      description: 'Dana pinjaman akan dicairkan sesuai dengan kesepakatan melalui transfer ke rekening atau secara tunai di kantor BUMDes.'
    }
  ];

  const documents = [
    { icon: FileText, label: 'Fotocopy KTP' },
    { icon: FileText, label: 'Fotocopy KK' },
    { icon: Calculator, label: 'Ket Penghasilan' },
    { icon: DollarSign, label: 'Peryt Agunan' },
    { icon: UserCheck, label: 'Pas Foto 3x4' },
    { icon: FileCheck, label: 'Surat Ket Usaha' }
  ];

  const durationOptions = [
    { value: 12, label: '12 Bulan' },
    { value: 18, label: '18 Bulan' },
    { value: 24, label: '24 Bulan' }
  ];

  const totalBayar =
    results
      ? results.cicilan_per_bulan * duration
      : 0;

  const totalBunga =
    results
      ? totalBayar - loanAmount
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-white py-8 sm:py-10 md:py-12 px-4 sm:px-6 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-800 mb-3 sm:mb-4 leading-snug">
            Yakin Mau Ajukan Pinjaman? Pahami Dulu di Sini
          </h1>
          <p className="text-center text-gray-600 text-sm sm:text-base mb-8 sm:mb-10 md:mb-12 px-2">
            Sebelum mengajukan pinjaman, yuk kenali dulu langkah-langkah, tabel simulasi angsuran, dan syarat penting lainnya.
          </p>

          {/* Steps Section */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
            {/* Illustration */}
            <div className="flex justify-center md:mr-12">
              <img
                src="/icon/panduan.jpg"
                alt="Ilustrasi Digitalisasi BUMDes"
                className="w-40 sm:w-56 md:w-auto max-w-full h-auto object-contain"
              />
            </div>

            {/* Steps List */}
            <div className="space-y-5 sm:space-y-6">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-md">
                      {step.number}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-1 sm:mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Terms Button */}
      <div className="flex justify-center my-6 sm:my-8 px-4">
        <button className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 sm:px-8 py-3 rounded-full font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
          <FileCheck className="w-5 h-5 flex-shrink-0" />
          Syarat Pengajuan Pinjaman
        </button>
      </div>

      {/* Documents Section */}
      <div className="bg-white py-6 px-4 sm:px-6 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-gray-700 text-sm sm:text-base mb-6 sm:mb-8 px-2">
            Kami menyediakan kemudahan bagi Anda yang ingin mengajukan pinjaman di BUMDes Tuah Negeri. Pastikan Anda memenuhi syarat berikut:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {documents.map((doc, index) => {
              const Icon = doc.icon;
              return (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 transition-all rounded-xl p-4 sm:p-6 flex items-center gap-3 sm:gap-4 cursor-pointer shadow-sm hover:shadow-md border border-gray-200">
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
                  <span className="font-semibold text-gray-700 text-sm sm:text-base">{doc.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Calculator Section */}
      <div className="py-8 sm:py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">Simulasi Pinjaman</h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg px-2">Hitung estimasi angsuran Anda dengan bunga 1,5% per bulan (18% per tahun)</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Input Section - 3 columns on desktop */}
            <div className="lg:col-span-3 space-y-6 sm:space-y-8">
              {/* Loan Amount */}
              <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 md:p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 sm:p-3 rounded-xl flex-shrink-0">
                    <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <label className="block text-gray-700 font-bold text-base sm:text-lg">Jumlah Pinjaman</label>
                    <p className="text-xs sm:text-sm text-gray-500">Nominal pinjaman antara Rp 1.000.000 - Rp 30.000.000</p>
                  </div>
                </div>

                <div className="mb-4 sm:mb-6">
                  <div className="relative">
                    <span className="absolute left-4 sm:left-5 md:left-6 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-base sm:text-lg">
                      Rp
                    </span>

                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={formatNumber(loanAmount)}
                      onChange={(e) => {

                        const angka = Number(
                          e.target.value.replace(/\D/g, "")
                        );

                        if (angka <= 30000000) {
                          setLoanAmount(angka);
                        }

                      }}
                      className="
                      w-full
                      pl-12 sm:pl-14 md:pl-16
                      pr-4 sm:pr-6
                      py-4 sm:py-5
                      text-2xl sm:text-3xl md:text-4xl
                      font-extrabold
                      border-2
                      border-gray-200
                      rounded-xl
                      bg-gray-50
                      focus:border-blue-500
                      outline-none
                      "
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap justify-between gap-x-2 gap-y-1 text-xs sm:text-sm">
                    <span className="text-gray-500">
                      Minimal Rp1.000.000
                    </span>

                    <span className="text-gray-500">
                      Maksimal Rp30.000.000
                    </span>
                  </div>
                </div>

                {nominalValid ? (
                  <p className="text-green-600 text-xs sm:text-sm font-semibold">
                    ✓ Nominal tersedia
                  </p>
                ) : (
                  <p className="text-red-500 text-xs sm:text-sm">
                    Nominal harus kelipatan Rp1.000.000
                  </p>
                )}
              </div>

              {/* Duration */}
              <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 md:p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-2.5 sm:p-3 rounded-xl flex-shrink-0">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <label className="block text-gray-700 font-bold text-base sm:text-lg">Jangka Waktu</label>
                    <p className="text-xs sm:text-sm text-gray-500">Pilih tenor angsuran Anda</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                  {durationOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setDuration(option.value)}
                      className={`py-3 sm:py-4 px-2 sm:px-4 rounded-xl font-bold text-center transition-all ${duration === option.value
                        ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      <div className="text-lg sm:text-xl md:text-2xl">{option.value}</div>
                      <div className="text-[11px] sm:text-xs mt-1">Bulan</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Section - 2 columns on desktop */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-green-700 to-green-700 rounded-2xl shadow-2xl p-5 sm:p-6 md:p-8 text-white lg:sticky lg:top-4">
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="bg-white/20 p-2.5 sm:p-3 rounded-xl backdrop-blur-sm flex-shrink-0">
                    <Receipt className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold">Hasil Kalkulasi</h3>
                </div>

                <div className={`space-y-4 sm:space-y-6 transition-opacity duration-300 ${isCalculating ? 'opacity-50' : 'opacity-100'}`}>
                  {/* Monthly Payment */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 flex-shrink-0" />
                      <p className="text-xs sm:text-sm font-medium text-blue-100">Angsuran per Bulan</p>
                    </div>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold break-words">{results ? formatCurrency(results.cicilan_per_bulan) : "-"}</p>
                    <p className="text-[11px] sm:text-xs text-blue-200 mt-2">Dibayar setiap bulan selama {duration} bulan</p>
                  </div>

                  {/* Interest Rate Info */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs sm:text-sm text-blue-100">
                        Suku Bunga
                      </span>

                      <span className="text-lg sm:text-xl font-bold">
                        1.5% / bulan
                      </span>
                    </div>

                    <p className="text-[11px] sm:text-xs text-blue-200 mt-2">
                      Flat Rate (18% per tahun)
                    </p>
                  </div>

                  {/* Total Interest */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">

                    <div className="flex justify-between items-center gap-2 mb-1">

                      <span className="text-xs sm:text-sm text-blue-100">
                        Total Bunga
                      </span>

                      <span className="text-lg sm:text-xl font-bold break-words text-right">
                        {formatCurrency(totalBunga)}
                      </span>

                    </div>

                    <div className="w-full bg-white/20 rounded-full h-2 mt-2">

                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                        style={{
                          width:
                            totalBayar > 0
                              ? `${(totalBunga / totalBayar) * 100}%`
                              : "0%",
                        }}
                      />

                    </div>

                  </div>

                  {/* Total Payment */}
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/30">
                    <p className="text-xs sm:text-sm font-medium text-blue-100 mb-2">Total Pembayaran</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold break-words">{results ? formatCurrency(results.cicilan_per_bulan * duration) : "-"}</p>
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/20">
                      <div className="flex justify-between items-center gap-2 text-xs sm:text-sm">
                        <span className="text-blue-100">Pokok Pinjaman</span>
                        <span className="font-semibold break-words text-right">{formatCurrency(loanAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="bg-white backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-yellow-400/30">
                    <p className="text-[11px] sm:text-xs text-black leading-relaxed">
                      💡 <span className="font-semibold">Tips:</span> Semakin pendek jangka waktu, semakin kecil total bunga yang dibayarkan!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="mt-6 sm:mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-r-xl p-4 sm:p-6 shadow-md">
            <div className="flex items-start gap-3">
              <div className="bg-amber-500 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-gray-800 font-semibold text-sm sm:text-base mb-1">Informasi Penting</p>
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                  Untuk Nasabah baru hanya dapat mengajukan pinjaman{' '}
                  <span className="font-bold text-amber-700">maksimal Rp 30.000.000</span>.
                  Perhitungan ini menggunakan bunga flat <span className="font-bold">1,5% per bulan</span> atau <span className="font-bold">18% per tahun</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;