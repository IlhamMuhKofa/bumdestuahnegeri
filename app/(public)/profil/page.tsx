"use client";

import React, { useState } from 'react';
import { Building2, Target, Eye, Users, Award, ChevronDown } from 'lucide-react';

const Profil = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const orgStructure = {
    top: [
      { name: 'Maverick Ross', role: 'FASILITATOR', color: 'from-emerald-400 to-emerald-500' },
      { name: 'Dana Gomez', role: 'PENASIHAT', color: 'from-emerald-400 to-emerald-500' },
      { name: 'Ken Yamato', role: 'PENGAWAS', color: 'from-emerald-400 to-emerald-500' }
    ],
    director: { name: 'Sasha Evergrey', role: 'DIREKTUR', color: 'from-rose-400 to-pink-500' },
    middle: [
      { name: 'Jose Moretti', role: 'BENDAHARA', color: 'from-amber-400 to-yellow-500' },
      { name: 'Luke Hobson', role: 'SEKRETARIS', color: 'from-amber-400 to-yellow-500' }
    ],
    units: [
      { name: 'Karina Wolfe', role: 'UNIT LUK - SP', color: 'from-slate-300 to-slate-400' },
      { name: 'Joanna Dwayne', role: 'UNIT BP LUK', color: 'from-slate-300 to-slate-400' },
      { name: 'Alice Summer', role: 'UNIT JA', color: 'from-slate-300 to-slate-400' },
      { name: 'David Elias', role: 'UNIT UP', color: 'from-slate-300 to-slate-400' }
    ]
  };

  const misiItems = [
    'Mengembangkan Potensi Lokal dengan akhlak mulia',
    'Meningkatkan Kualitas pelayanan',
    'Pemberdayaan masyarakat melalui kolaborasi lembaga terkait',
    'Kemitraan yang bersinergi dan solid',
    'Transparansi dan juga akuntabilitas dalam pengelolaan'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full mb-4">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-700 font-semibold text-sm">Profil BUMDes</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            BUMDes Tuah Negeri
          </h1>
          <p className="text-gray-600 text-lg">Membangun Ekonomi Desa Bersama Masyarakat</p>
        </div>

        {/* Sejarah & Gambar */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12 transform transition-all duration-500 hover:shadow-2xl">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 relative overflow-hidden group">
              <img
                src="/img/pfbg.png"
                alt="Gedung BUMDes"
                className="w-full h-80 md:h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-transparent" />
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-gray-800">Sejak 2022</span>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 p-8 md:p-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-12 bg-gradient-to-b from-emerald-500 to-emerald-300 rounded-full" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Didirikan Sejak Tahun 2022
                </h2>
              </div>
              <p className="text-gray-700 text-justify leading-relaxed">
                Sejak resmi beroperasi, BUMDes Tuah Negeri terus bergerak maju mendampingi pertumbuhan ekonomi masyarakat 
                Kampung Pinang Sebatang Barat. Melalui pengelolaan aset yang transparan dan profesional , 
                saat ini kami telah menggerakkan enam unit usaha produktif yang menjadi pilar utama Pendapatan Asli Kampung. 
                Kami percaya bahwa sinergi yang solid antara pengelola dan warga adalah kunci utama untuk mewujudkan desa yang mandiri, sejahtera, dan berdaya saing tinggi.
              </p>
              <div className="mt-6 flex gap-4">
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
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-3">Nilai Kami</h3>
            <p className="text-gray-600 text-lg max-full mx-auto">
              Kami di BUMDes Tuah Negeri mewujudkan nilai-nilai inti ini dalam setiap langkah
            </p>
          </div>

          <div className="max-w-full mx-auto grid md:grid-cols-2 gap-6">
            {/* Visi */}
            <div className="group">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-8 shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-white font-bold text-2xl">Visi Kami</h4>
                </div>
                <p className="text-white/95 leading-relaxed text-justify">
                  "Mewujudkan Badan Usaha Milik Kampung Tuah Negeri sebagai lembaga usaha desa yang berkualitas, yang mampu melayani masyarakat untuk mencapai kesejahteraan bersama"
                </p>
              </div>
            </div>

            {/* Misi */}
            <div className="group">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 shadow-xl border-2 border-emerald-200 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-emerald-500 p-3 rounded-xl">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-emerald-700 font-bold text-2xl">Misi Kami</h4>
                </div>
                <ul className="space-y-3">
                  {misiItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 group/item">
                      <div className="bg-emerald-500 text-white rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5 group-hover/item:scale-110 transition-transform">
                        {idx + 1}
                      </div>
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Struktur Organisasi */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full mb-4">
              <Users className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold text-sm">Tim Kami</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">Struktur Organisasi</h3>
            <p className="text-gray-600">Dipimpin oleh tim profesional dan berpengalaman</p>
          </div>

          <div className="flex flex-col items-center space-y-6">
            {/* Top Level */}
            <div className="flex flex-wrap gap-4 justify-center">
              {orgStructure.top.map((person, idx) => (
                <div
                  key={idx}
                  className="group relative"
                >
                  <div className={`bg-gradient-to-br ${person.color} rounded-xl px-6 py-4 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl min-w-[180px]`}>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full mx-auto mb-3 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{person.name.charAt(0)}</span>
                      </div>
                      <span className="font-bold text-white block mb-1">{person.name}</span>
                      <div className="text-xs text-white/90 font-semibold bg-white/20 px-3 py-1 rounded-full">
                        {person.role}
                      </div>
                    </div>
                  </div>
                  {/* Connector Line */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-emerald-300 to-transparent" />
                </div>
              ))}
            </div>

            {/* Vertical Connector */}
            <div className="w-0.5 h-4 bg-gradient-to-b from-emerald-300 to-rose-300" />

            {/* Director */}
            <div className="relative">
              <div className={`bg-gradient-to-br ${orgStructure.director.color} rounded-xl px-8 py-5 shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl min-w-[220px]`}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full mx-auto mb-3 flex items-center justify-center ring-4 ring-white/40">
                    <span className="text-white font-bold text-2xl">{orgStructure.director.name.charAt(0)}</span>
                  </div>
                  <span className="font-bold text-white block mb-2 text-lg">{orgStructure.director.name}</span>
                  <div className="text-sm text-white/95 font-bold bg-white/30 px-4 py-1.5 rounded-full">
                    {orgStructure.director.role}
                  </div>
                </div>
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-rose-300 to-amber-300" />
            </div>

            {/* Middle Level */}
            <div className="flex flex-wrap gap-4 justify-center">
              {orgStructure.middle.map((person, idx) => (
                <div key={idx} className="relative">
                  <div className={`bg-gradient-to-br ${person.color} rounded-xl px-6 py-4 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl min-w-[180px]`}>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full mx-auto mb-3 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{person.name.charAt(0)}</span>
                      </div>
                      <span className="font-bold text-white block mb-1">{person.name}</span>
                      <div className="text-xs text-white/90 font-semibold bg-white/20 px-3 py-1 rounded-full">
                        {person.role}
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-amber-300 to-slate-300" />
                </div>
              ))}
            </div>

            {/* Bottom Level - Units */}
            <div className="flex flex-wrap gap-4 justify-center max-w-4xl">
              {orgStructure.units.map((person, idx) => (
                <div
                  key={idx}
                  className={`bg-gradient-to-br ${person.color} rounded-xl px-5 py-4 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl min-w-[160px]`}
                >
                  <div className="text-center">
                    <div className="w-10 h-10 bg-white/40 backdrop-blur-sm rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-gray-700 font-bold">{person.name.charAt(0)}</span>
                    </div>
                    <span className="font-bold text-gray-800 block mb-1 text-sm">{person.name}</span>
                    <div className="text-xs text-gray-700 font-semibold bg-white/40 px-2 py-1 rounded-full">
                      {person.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;