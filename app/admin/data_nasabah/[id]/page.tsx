"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";

import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  CreditCard,
  Mail,
  Briefcase,
  Calendar,
} from "lucide-react";

export default function DetailNasabah() {
  const [data, setData] = useState<any>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const router = useRouter();
  const params = useParams();

  const id = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id;

  useEffect(() => {
    if (!id) return;

    fetch(`/api/nasabah/${id}`)
      .then((res) => res.json())
      .then((res) => setData(res.data));
  }, [id]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-gray-200 border-t-blue-500" />

          <p className="text-sm text-gray-400">
            Memuat data nasabah...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // STATUS
  // =========================

  const statusMap: Record<
    string,
    {
      label: string;
      cls: string;
    }
  > = {
    active: {
      label: "Aktif",
      cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    },

    disabled: {
      label: "Nonaktif",
      cls: "bg-red-50 text-red-600 border border-red-200",
    },
  };

  const statusInfo =
    statusMap[data.status] ?? {
      label: data.status,
      cls: "bg-gray-100 text-gray-600",
    };

  // =========================
  // UPDATE STATUS
  // =========================

  const handleToggleStatus = async (
    newStatus: "active" | "disabled"
  ) => {
    if (updatingStatus) return;

    try {
      setUpdatingStatus(true);

      const res = await fetch(`/api/nasabah/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok || !result.success) {
        throw new Error(
          result?.message ||
            result?.error ||
            "Gagal memperbarui status akun."
        );
      }

      const message =
        newStatus === "active"
          ? "Akun nasabah berhasil diaktifkan."
          : "Akun nasabah berhasil dinonaktifkan.";

      toast.success(message, {
        position: "top-right",
        autoClose: 2500,
      });

      setTimeout(() => {
        router.push("/admin/data_nasabah");
      }, 1200);
    } catch (error: any) {
      console.error(
        "ERROR UPDATE STATUS:",
        error
      );

      toast.error(
        error?.message ||
          "Terjadi kesalahan saat memperbarui status akun.",
        {
          position: "top-right",
          autoClose: 3500,
        }
      );
    } finally {
      setUpdatingStatus(false);
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

        {/* =====================================================
            BREADCRUMB
        ===================================================== */}

        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 sm:px-6">

            <button
              onClick={() =>
                router.push("/admin/data_nasabah")
              }
              className="flex items-center gap-2 text-sm text-slate-500 transition hover:text-blue-800"
            >
              <ArrowLeft size={16} />
              Kembali
            </button>

            <span className="text-slate-300">
              /
            </span>

            <span className="text-sm text-slate-400">
              Data Nasabah
            </span>

            <span className="text-slate-300">
              /
            </span>

            <span className="text-sm font-semibold text-slate-700">
              Detail Nasabah
            </span>

          </div>
        </div>


        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6">

          {/* ===================================================
              HEADER
          =================================================== */}

          <div className="rounded-3xl bg-gradient-to-r from-blue-800 to-blue-700 p-5 text-white shadow-lg sm:p-6">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              {/* PROFILE */}
              <div className="flex items-center gap-3 sm:gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur sm:h-16 sm:w-16">
                  <User size={28} />
                </div>

                <div className="min-w-0">

                  <p className="text-sm text-blue-100">
                    Data Nasabah
                  </p>

                  <h1 className="text-2xl font-bold leading-tight md:text-3xl">
                    {data.nama}
                  </h1>

                </div>

              </div>

              {/* STATUS */}
              <div className="shrink-0">

                <span
                  className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${statusInfo.cls}`}
                >
                  {statusInfo.label}
                </span>

              </div>

            </div>

          </div>


          {/* ===================================================
              SUMMARY
          =================================================== */}

          <div className="mt-4 grid gap-3 md:grid-cols-3">

            {/* NIK */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4">

              <div className="flex items-center gap-3">

                <CreditCard
                  className="shrink-0 text-blue-800"
                  size={20}
                />

                <div className="min-w-0">

                  <p className="text-xs text-slate-500">
                    NIK
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-slate-800 break-all">
                    {data.nik || "-"}
                  </p>

                </div>

              </div>

            </div>


            {/* NOMOR HP */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4">

              <div className="flex items-center gap-3">

                <Phone
                  className="shrink-0 text-blue-800"
                  size={20}
                />

                <div className="min-w-0">

                  <p className="text-xs text-slate-500">
                    Nomor HP
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-slate-800">
                    {data.no_hp || "-"}
                  </p>

                </div>

              </div>

            </div>


            {/* EMAIL */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4">

              <div className="flex items-center gap-3">

                <Mail
                  className="shrink-0 text-blue-800"
                  size={20}
                />

                <div className="min-w-0">

                  <p className="text-xs text-slate-500">
                    Email
                  </p>

                  <p
                    className="mt-0.5 break-all text-sm font-semibold leading-relaxed text-slate-800"
                    title={data.email}
                  >
                    {data.email || "-"}
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* ===================================================
              INFORMASI PRIBADI
          =================================================== */}

          <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white">

            {/* SECTION HEADER */}
            <div className="border-b border-slate-200 px-5 py-4">

              <h2 className="text-lg font-bold text-slate-800">
                Informasi Pribadi
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Detail lengkap identitas nasabah.
              </p>

            </div>


            {/* CONTENT */}
            <div className="p-5">

              <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">

                {/* NAMA */}
                <div>

                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Nama Lengkap
                  </label>

                  <p className="mt-1.5 text-sm font-medium text-slate-800">
                    {data.nama || "-"}
                  </p>

                </div>


                {/* JENIS KELAMIN */}
                <div>

                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Jenis Kelamin
                  </label>

                  <p className="mt-1.5 text-sm font-medium text-slate-800">
                    {data.jenis_kelamin || "-"}
                  </p>

                </div>


                {/* TANGGAL LAHIR */}
                <div>

                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Tanggal Lahir
                  </label>

                  <div className="mt-1.5 flex items-center gap-2 text-sm text-slate-800">

                    <Calendar
                      size={16}
                      className="shrink-0"
                    />

                    <span>
                      {data.tanggal_lahir
                        ? new Date(
                            data.tanggal_lahir
                          ).toLocaleDateString(
                            "id-ID",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : "-"}
                    </span>

                  </div>

                </div>


                {/* PEKERJAAN */}
                <div>

                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Pekerjaan
                  </label>

                  <div className="mt-1.5 flex items-center gap-2 text-sm text-slate-800">

                    <Briefcase
                      size={16}
                      className="shrink-0"
                    />

                    <span>
                      {data.pekerjaan || "-"}
                    </span>

                  </div>

                </div>


                {/* ALAMAT */}
                <div className="md:col-span-2">

                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Alamat
                  </label>

                  <div className="mt-1.5 flex gap-2">

                    <MapPin
                      size={16}
                      className="mt-0.5 shrink-0 text-slate-500"
                    />

                    <p className="text-sm leading-relaxed text-slate-800">
                      {data.alamat || "-"}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* ===================================================
              MANAJEMEN STATUS
          =================================================== */}

          <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-5">

            <div className="mb-4">

              <h3 className="text-lg font-bold text-slate-800">
                Manajemen Status Akun
              </h3>

              <p className="mt-0.5 text-sm text-slate-500">
                Aktifkan atau nonaktifkan akun nasabah sesuai kebutuhan.
              </p>

            </div>


            <div className="grid gap-3 md:grid-cols-2">

              <button
                onClick={() =>
                  handleToggleStatus("active")
                }
                disabled={updatingStatus}
                className="h-11 rounded-xl bg-blue-800 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Aktifkan Akun
              </button>

              <button
                onClick={() =>
                  handleToggleStatus("disabled")
                }
                disabled={updatingStatus}
                className="h-11 rounded-xl border border-red-200 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
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