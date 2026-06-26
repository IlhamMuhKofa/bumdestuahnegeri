"use client";

import React, { useState, useEffect } from 'react';
import { FileText, UserCheck, DollarSign, FileCheck, Wallet, Calculator, TrendingUp, Clock, Receipt } from 'lucide-react';

const LoanCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(5000000);
  const [duration, setDuration] = useState<number>(12);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Interest rate: 1.5% per month = 18% per year
  const monthlyInterestRate = 0.015; // 1.5%

  useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => setIsCalculating(false), 300);
    return () => clearTimeout(timer);
  }, [loanAmount, duration]);

  const calculateResults = () => {
    // Calculate using flat interest rate method
    const totalInterest = loanAmount * monthlyInterestRate * duration;
    const totalPayment = loanAmount + totalInterest;
    const monthlyPayment = totalPayment / duration;
    
    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      interestRate: monthlyInterestRate * 100
    };
  };

  const results = calculateResults();

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
    { icon: UserCheck, label: 'pas foto 3x4' },
    { icon: FileCheck, label: 'surat ket usaha' }
  ];

  const loanPresets = [
    { value: 1000000, label: '1 Juta' },
    { value: 2000000, label: '2 Juta' },
    { value: 3000000, label: '3 Juta' },
    { value: 5000000, label: '5 Juta' },
    { value: 7000000, label: '7 Juta' },
    { value: 10000000, label: '10 Juta' }
  ];

  const durationOptions = [
    { value: 12, label: '12 Bulan' },
    { value: 18, label: '18 Bulan' },
    { value: 24, label: '24 Bulan' }
    
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-white py-12 px-4 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Yakin Mau Ajukan Pinjaman? Pahami Dulu di Sini
          </h1>
          <p className="text-center text-gray-600 mb-12">
            Sebelum mengajukan pinjaman, yuk kenali dulu langkah-langkah, tabel simulasi angsuran, dan syarat penting lainnya.
          </p>

          {/* Steps Section */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Illustration */}
      <div className="flex justify-center mr-12">
        <img
          src="/icon/panduan.jpg"
          alt="Ilustrasi Digitalisasi BUMDes"
          className="max-h-auto w-auto object-contain"
        />
      </div>


            {/* Steps List */}
            <div className="space-y-6">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      {step.number}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>
          {/* Terms Button */}
          <div className="flex justify-center mt-12">
            <button className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
              <FileCheck className="w-5 h-5" />
              Syarat Pengajuan Pinjaman
            </button>
          </div>
      {/* Documents Section */}
      <div className="bg-white py-12 px-4 mt-8 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-gray-700 mb-8">
            Kami menyediakan kemudahan bagi Anda yang ingin mengajukan pinjaman di BUMDes Tuah Negeri. Pastikan Anda memenuhi syarat berikut:
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {documents.map((doc, index) => {
              const Icon = doc.icon;
              return (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 transition-all rounded-xl p-6 flex items-center gap-4 cursor-pointer shadow-sm hover:shadow-md border border-gray-200">
                  <Icon className="w-8 h-8 text-blue-600" />
                  <span className="font-semibold text-gray-700">{doc.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Calculator Section */}
      <div className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-3">Simulasi Pinjaman</h2>
            <p className="text-gray-600 text-lg">Hitung estimasi angsuran Anda dengan bunga 1,5% per bulan (18% per tahun)</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Input Section - 3 columns */}
            <div className="lg:col-span-3 space-y-8">
              {/* Loan Amount */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold text-lg">Jumlah Pinjaman</label>
                    <p className="text-sm text-gray-500">Maksimal Rp 10.000.000 untuk nasabah baru</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold text-lg">Rp</span>
                    <input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Math.min(Number(e.target.value), 10000000))}
                      className="w-full pl-16 pr-6 py-4 text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-gray-50"
                      min="1000000"
                      max="10000000"
                      step="100000"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <input
                    type="range"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    min="1000000"
                    max="10000000"
                    step="100000"
                    className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-500 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {loanPresets.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setLoanAmount(preset.value)}
                      className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                        loanAmount === preset.value
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold text-lg">Jangka Waktu</label>
                    <p className="text-sm text-gray-500">Pilih tenor angsuran Anda</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {durationOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setDuration(option.value)}
                      className={`py-4 px-4 rounded-xl font-bold text-center transition-all ${
                        duration === option.value
                          ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="text-2xl">{option.value}</div>
                      <div className="text-xs mt-1">Bulan</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Section - 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-green-700 to-green-700 rounded-2xl shadow-2xl p-8 text-white sticky top-4">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <Receipt className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Hasil Kalkulasi</h3>
                </div>

                <div className={`space-y-6 transition-opacity duration-300 ${isCalculating ? 'opacity-50' : 'opacity-100'}`}>
                  {/* Monthly Payment */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-yellow-300" />
                      <p className="text-sm font-medium text-blue-100">Angsuran per Bulan</p>
                    </div>
                    <p className="text-4xl font-bold">{formatCurrency(results.monthlyPayment)}</p>
                    <p className="text-xs text-blue-200 mt-2">Dibayar setiap bulan selama {duration} bulan</p>
                  </div>

                  {/* Interest Rate Info */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-100">Suku Bunga</span>
                      <span className="text-xl font-bold">{results.interestRate}% / bulan</span>
                    </div>
                  </div>

                  {/* Total Interest */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-blue-100">Total Bunga</span>
                      <span className="text-xl font-bold">{formatCurrency(results.totalInterest)}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(results.totalInterest / results.totalPayment) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Total Payment */}
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                    <p className="text-sm font-medium text-blue-100 mb-2">Total Pembayaran</p>
                    <p className="text-3xl font-bold">{formatCurrency(results.totalPayment)}</p>
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-100">Pokok Pinjaman</span>
                        <span className="font-semibold">{formatCurrency(loanAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="bg-white backdrop-blur-sm rounded-xl p-4 border border-yellow-400/30">
                    <p className="text-xs text-black leading-relaxed">
                      💡 <span className="font-semibold">Tips:</span> Semakin pendek jangka waktu, semakin kecil total bunga yang dibayarkan!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-r-xl p-6 shadow-md">
            <div className="flex items-start gap-3">
              <div className="bg-amber-500 p-2 rounded-lg flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-gray-800 font-semibold mb-1">Informasi Penting</p>
                <p className="text-gray-700">
                  Untuk Nasabah baru hanya dapat mengajukan pinjaman{' '}
                  <span className="font-bold text-amber-700">maksimal Rp 10.000.000</span>.
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