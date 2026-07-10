"use client";
import React from "react";

const services = [
  { title: "Simpan Pinjam", img: "/icon/sp.jpg", alt: "Simpan Pinjam", scale: "scale-[1.25]" },
  { title: "Peternakan", img: "/icon/petani.jpg", alt: "Peternakan", scale: "scale-[1.25]" },
  { title: "Jasa Angkutan", img: "/icon/angkutan.jpg", alt: "Jasa Angkutan", scale: "scale-[1.25]" },
  { title: "Pariwisata", img: "/icon/tour.jpg", alt: "Pariwisata", scale: "scale-[1.25]" },
  { title: "Usaha Pasar", img: "/icon/pas32.jpg", alt: "Usaha Pasar", scale: "scale-[1.35]" },
  { title: "Penyedia Tenaga Kerja", img: "/icon/pyk.png", alt: "Penyedia Tenaga Kerja", scale: "scale-[1.25]" },
];

const Layanan: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-green-700 to-green-600 py-14">
      <div className="container mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">
            Layanan Kami
          </h2>
          <p className="text-green-100 text-sm">
            Pilihan layanan yang tersedia untuk masyarakat
          </p>
        </div>

        {/* GRID */}
        <div className="
          grid 
          grid-cols-2 
          md:grid-cols-3 
          gap-5
        ">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="
                group
                bg-white
                rounded-2xl
                shadow-sm
                hover:shadow-xl
                transition-all duration-300
                p-6 md:p-7
                flex flex-col items-center justify-center
                text-center
                cursor-pointer

                hover:-translate-y-1
                active:scale-[0.97]
              "
            >
{/* ICON (NO BG) */}
<div className="
  mb-4
  h-14 w-14
  md:h-16 md:w-16
  lg:h-20 lg:w-20
  flex items-center justify-center
">
<img
  src={service.img}
  alt={service.alt}
  className={`max-h-full max-w-full object-contain ${service.scale}`}
/>
</div>

              {/* TITLE */}
              <span
                className="
                  text-gray-800
                  font-semibold
                  leading-tight
                  
                  text-sm            /* mobile */
                  md:text-base       /* tablet */
                  lg:text-lg         /* desktop */

                  line-clamp-2
                  h-[44px] md:h-[48px]
                  flex items-center justify-center
                "
              >
                {service.title}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Layanan;