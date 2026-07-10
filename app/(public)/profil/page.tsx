"use client";

import React from 'react';
import { Building2, Target, Eye, Users, Award } from 'lucide-react';

// ====== Komponen Node untuk Struktur Organisasi ======
type OrgNodeProps = {
  title: string;
  names: string[];
  variant?: 'primary' | 'secondary' | 'unit' | 'support';
};

const OrgNode = ({ title, names, variant = 'primary' }: OrgNodeProps) => {
  const bgClass =
    variant === 'primary'
      ? 'bg-teal-600'
      : variant === 'secondary'
      ? 'bg-emerald-500'
      : variant === 'support'
      ? 'bg-cyan-600'
      : 'bg-amber-500';

  return (
    <div className="flex flex-col items-center">
      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border-[3px] sm:border-4 border-teal-100 shadow-md flex items-center justify-center -mb-4 sm:-mb-5 z-10 shrink-0">
        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
      </div>
      <div
        className={`${bgClass} rounded-xl shadow-lg px-3 pt-5 pb-3 sm:px-4 sm:pt-6 sm:pb-3.5 min-w-[128px] sm:min-w-[160px] text-center`}
      >
        <div className="text-white font-bold text-[10px] sm:text-xs uppercase tracking-wide mb-1">
          {title}
        </div>
        {names.map((n, i) => (
          <div key={i} className="text-white/90 text-[10px] sm:text-xs leading-snug">
            {n}
          </div>
        ))}
      </div>
    </div>
  );
};

// Garis vertikal penghubung antar level
const VLine = ({ h = 'h-6 sm:h-8' }: { h?: string }) => (
  <div className="flex justify-center">
    <div className={`w-px ${h} bg-emerald-300`} />
  </div>
);

// ====== Komponen Struktur Organisasi ======
const StrukturOrganisasi = () => {
  const units = [
    { title: 'Unit UEK-SP', names: ['Dewa Kusuma, S.Hut'] },
    { title: 'Unit BRI Link', names: ['Dewa Kusuma, S.Hut'] },
    { title: 'Unit Jasa Angkutan', names: ['Deshendri'] },
    { title: 'Unit Usaha Pariwisata', names: ['M. Fauzi, S.H'] },
  ];

  return (
    <div className="overflow-x-auto pb-2">
      <div className="min-w-[700px] px-4">
        {/* Row 1: Fasilitator - Penasehat - Pengawas */}
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <OrgNode title="Fasilitator" names={['Dewi Kurniawati, S.Pd']} variant="support" />
          <div className="w-8 sm:w-14 border-t-2 border-dashed border-emerald-300 mt-1" />
          <OrgNode title="Penasehat" names={['Rudi Hardianto']} variant="primary" />
          <div className="w-8 sm:w-14 border-t-2 border-dashed border-emerald-300 mt-1" />
          <OrgNode
            title="Pengawas"
            names={['1. Ramli Adnan', '2. Syamsulrizal', '3. Asmidar, S.E']}
            variant="support"
          />
        </div>

        {/* Turun ke Direktur */}
        <VLine />
        <div className="flex justify-center">
          <OrgNode title="Direktur" names={['Atika Hariani, S.E., M.Pd']} variant="primary" />
        </div>

        {/* Cabang ke Bendahara & Sekretaris */}
        <VLine h="h-5 sm:h-6" />
        <div className="relative flex justify-center gap-10 sm:gap-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] sm:w-[230px] border-t-2 border-emerald-300" />
          <div className="flex flex-col items-center">
            <div className="w-px h-4 bg-emerald-300" />
            <OrgNode title="Bendahara" names={['Winda Rahmadani, S.I.Kom']} variant="secondary" />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-px h-4 bg-emerald-300" />
            <OrgNode title="Sekretaris" names={['Sri Martina']} variant="secondary" />
          </div>
        </div>

        {/* Cabang ke 4 Unit Usaha */}
        <VLine h="h-5 sm:h-6" />
        <div className="relative flex justify-center gap-4 sm:gap-6">
          <div className="absolute top-0 left-[10%] right-[10%] border-t-2 border-emerald-300" />
          {units.map((u, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-px h-4 bg-emerald-300" />
              <OrgNode title={u.title} names={u.names} variant="unit" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ====== Komponen Utama Profil ======
const Profil = () => {
  const misiItems = [
    'Mengembangkan Potensi Lokal dengan akhlak mulia',
    'Meningkatkan Kualitas pelayanan',
    'Pemberdayaan masyarakat melalui kolaborasi lembaga terkait',
    'Kemitraan yang bersinergi dan solid',
    'Transparansi dan juga akuntabilitas dalam pengelolaan'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8 md:px-8 md:py-12">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-4">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-700 font-semibold text-sm">Profil BUMDes</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            BUMDes Tuah Negeri
          </h1>
          <p className="text-gray-600 text-base md:text-lg px-2">Membangun Ekonomi Desa Bersama Masyarakat</p>
        </div>

        {/* Sejarah & Gambar */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 md:mb-12 transform transition-all duration-500 hover:shadow-2xl">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 relative overflow-hidden group">
              <img
                src="/img/pfbg.png"
                alt="Gedung BUMDes"
                className="w-full h-56 sm:h-72 md:h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-transparent" />
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-white/95 backdrop-blur-sm px-4 py-2 md:px-6 md:py-3 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-gray-800 text-sm md:text-base">Sejak 2022</span>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 p-6 sm:p-8 md:p-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-12 bg-gradient-to-b from-emerald-500 to-emerald-300 rounded-full" />
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                  Didirikan Sejak Tahun 2022
                </h2>
              </div>
              <p className="text-gray-700 text-sm sm:text-base text-justify leading-relaxed">
                Sejak resmi beroperasi, BUMDes Tuah Negeri terus bergerak maju mendampingi pertumbuhan ekonomi masyarakat
                Kampung Pinang Sebatang Barat. Melalui pengelolaan aset yang transparan dan profesional ,
                saat ini kami telah menggerakkan enam unit usaha produktif yang menjadi pilar utama Pendapatan Asli Kampung.
                Kami percaya bahwa sinergi yang solid antara pengelola dan warga adalah kunci utama untuk mewujudkan desa yang mandiri, sejahtera, dan berdaya saing tinggi.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <div className="bg-emerald-50 px-6 py-4 rounded-xl flex-1">
                  <div className="text-3xl font-bold text-emerald-600 mb-1">3+</div>
                  <div className="text-sm text-gray-600">Tahun Beroperasi</div>
                </div>
                <div className="bg-teal-50 px-6 py-4 rounded-xl flex-1">
                  <div className="text-3xl font-bold text-teal-600 mb-1">100+</div>
                  <div className="text-sm text-gray-600">Mitra Usaha</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nilai Kami */}
        <div className="mb-8 md:mb-12">
          <div className="text-center mb-6 md:mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">Nilai Kami</h3>
            <p className="text-gray-600 text-base md:text-lg max-full mx-auto px-2">
              Kami di BUMDes Tuah Negeri mewujudkan nilai-nilai inti ini dalam setiap langkah
            </p>
          </div>

          <div className="max-w-4xl mx-auto flex flex-col gap-4 md:gap-6">
            {/* Visi */}
            <div className="bg-green-700 rounded-2xl p-6 sm:p-8 shadow-xl">
              <h4 className="text-white font-bold text-xl sm:text-2xl text-center mb-4">Visi Kami</h4>
              <p className="text-white/95 text-sm sm:text-base leading-relaxed text-center">
                "Mewujudkan Badan Usaha Milik Kampung Tuah Negeri sebagai lembaga usaha desa yang berkualitas, yang mampu melayani masyarakat untuk mencapai kesejahteraan bersama"
              </p>
            </div>

            {/* Misi */}
            <div className="bg-green-700 rounded-2xl p-6 sm:p-8 shadow-xl">
              <h4 className="text-white font-bold text-xl sm:text-2xl text-center mb-5">Misi Kami</h4>
              <ol className="space-y-3 text-white/95 text-sm sm:text-base leading-relaxed">
                {misiItems.map((item, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="font-semibold">{idx + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Struktur Organisasi */}
        <div className="bg-white rounded-3xl shadow-xl p-5 sm:p-8 md:p-12">
          <div className="text-center mb-6 md:mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-100 px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-4">
              <Users className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold text-sm">Tim Kami</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Struktur Organisasi</h3>
            <p className="text-gray-600 text-sm sm:text-base px-2">Dipimpin oleh tim profesional dan berpengalaman</p>
          </div>

          <StrukturOrganisasi />
        </div>
      </div>
    </div>
  );
};

export default Profil;