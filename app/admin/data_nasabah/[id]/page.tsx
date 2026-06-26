"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  CreditCard,
  Mail,
  Briefcase,
  Calendar,
  ShieldCheck,
} from "lucide-react";

export default function DetailNasabah() {
  const [data, setData] = useState<any>(null);
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  useEffect(() => {
    if (!id) return;
    fetch(`/api/nasabah/${id}`)
      .then((res) => res.json())
      .then((res) => setData(res.data));
  }, [id]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-[3px] border-gray-200 border-t-[#1a4731] rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Memuat data nasabah...</p>
        </div>
      </div>
    );
  }

  // const handleAction = async (status: "active" | "disabled") => {
  //   try {
  //     const res = await fetch(`/api/nasabah/${params.id}`, {
  //       method: "PATCH",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ status }),
  //     });

  //     const result = await res.json();

  //     if (result.success) {
  //       alert(`Akun berhasil ${status === "active" ? "diaktifkan" : "dinonaktifkan"}`);
  //       router.push("/admin/data_nasabah");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const statusMap: Record<string, { label: string; cls: string }> = {
    active: { label: "Aktif", cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
    disabled: { label: "Nonaktif", cls: "bg-red-50 text-red-600 border border-red-200" },
  };
  const statusInfo = statusMap[data.status] ?? { label: data.status, cls: "bg-gray-100 text-gray-600" };

  const handleToggleStatus = async (newStatus: "active" | "disabled") => {
    try {
      const res = await fetch(`/api/nasabah/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await res.json();

      if (result.success) {
        alert("Status berhasil diupdate");
        window.location.reload(); // refresh biar update
      } else {
        alert("Gagal update status");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      .dp-root {
        font-family: 'Plus Jakarta Sans', sans-serif;
      }
    `}</style>

      <div className="dp-root min-h-screen bg-slate-50">

        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-2 text-sm">
            <button
              onClick={() => router.push("/admin/data_nasabah")}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-800 transition"
            >
              <ArrowLeft size={16} />
              Kembali
            </button>

            <span className="text-slate-300">/</span>

            <span className="text-slate-400">
              Data Nasabah
            </span>

            <span className="text-slate-300">/</span>

            <span className="font-semibold text-slate-700">
              Detail Nasabah
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-700 rounded-3xl p-6 md:p-8 shadow-lg text-white">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div className="flex items-center gap-4">

                <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                  <User size={30} />
                </div>

                <div>
                  <p className="text-blue-100 text-sm">
                    Data Nasabah
                  </p>

                  <h1 className="text-2xl md:text-3xl font-bold">
                    {data.nama}
                  </h1>

                  {/* <p className="text-blue-200 text-sm mt-1">
                  ID #{String(params?.id).padStart(5, "0")}
                </p> */}
                </div>
              </div>

              <div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.cls}`}
                >
                  {statusInfo.label}
                </span>
              </div>

            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-4 mt-6">

            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <CreditCard className="text-blue-800" size={20} />
                <div>
                  <p className="text-xs text-slate-500">
                    NIK
                  </p>
                  <p className="font-semibold text-slate-800">
                    {data.nik || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <Phone className="text-blue-800" size={20} />
                <div>
                  <p className="text-xs text-slate-500">
                    Nomor HP
                  </p>
                  <p className="font-semibold text-slate-800">
                    {data.no_hp || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <Mail className="text-blue-800" size={20} />
                <div>
                  <p className="text-xs text-slate-500">
                    Email
                  </p>
                  <p
                    className="font-semibold text-slate-800 break-all text-sm leading-relaxed"
                    title={data.email}
                  >
                    {data.email || "-"}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Detail */}
          <div className="bg-white rounded-3xl border border-slate-200 mt-6 overflow-hidden">

            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-lg font-bold text-slate-800">
                Informasi Pribadi
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Detail lengkap identitas nasabah.
              </p>
            </div>

            <div className="p-6">

              <div className="grid md:grid-cols-2 gap-6">

                <div>
                  <label className="text-xs font-semibold uppercase text-slate-400">
                    Nama Lengkap
                  </label>

                  <p className="mt-2 text-slate-800 font-medium">
                    {data.nama || "-"}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase text-slate-400">
                    Jenis Kelamin
                  </label>

                  <p className="mt-2 text-slate-800 font-medium">
                    {data.jenis_kelamin || "-"}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase text-slate-400">
                    Tanggal Lahir
                  </label>

                  <div className="flex items-center gap-2 mt-2 text-slate-800">
                    <Calendar size={16} />
                    <span>
                      {data.tanggal_lahir
                        ? new Date(
                          data.tanggal_lahir
                        ).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                        : "-"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase text-slate-400">
                    Pekerjaan
                  </label>

                  <div className="flex items-center gap-2 mt-2 text-slate-800">
                    <Briefcase size={16} />
                    <span>
                      {data.pekerjaan || "-"}
                    </span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-semibold uppercase text-slate-400">
                    Alamat
                  </label>

                  <div className="flex gap-2 mt-2">
                    <MapPin
                      size={16}
                      className="text-slate-500 mt-1"
                    />

                    <p className="text-slate-800 leading-relaxed">
                      {data.alamat || "-"}
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Action Card */}
          <div className="bg-white rounded-3xl border border-slate-200 mt-6 p-6">

            <h3 className="font-bold text-slate-800">
              Manajemen Status Akun
            </h3>

            <p className="text-sm text-slate-500 mt-1 mb-5">
              Aktifkan atau nonaktifkan akun nasabah sesuai kebutuhan.
            </p>

            <div className="grid md:grid-cols-2 gap-3">

              <button
                onClick={() => handleToggleStatus("active")}
                className="h-12 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-semibold transition"
              >
                Aktifkan Akun
              </button>

              <button
                onClick={() => handleToggleStatus("disabled")}
                className="h-12 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold transition"
              >
                Nonaktifkan Akun
              </button>

            </div>

          </div>

        </div>
      </div>
    </>
  );
}