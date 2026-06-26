"use client";

type Props = {
  data?: any[];
};

export default function ClientPage({
  data = [],
}: Props) {

  const formatTanggal = (
    date: string
  ) => {

    return new Date(
      date
    ).toLocaleDateString(
      "id-ID",
      {
        weekday:
          "long",
        day:
          "numeric",
        month:
          "long",
        year:
          "numeric",
      }
    );
  };

  const formatJam = (
    date: string
  ) => {

    return new Date(
      date
    ).toLocaleTimeString(
      "id-ID",
      {
        hour:
          "2-digit",
        minute:
          "2-digit",
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white">

      {/* HERO */}
      <div className="relative overflow-hidden border-b bg-white">

        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3" />

        <div className="max-w-7xl mx-auto px-5 md:px-10 py-12 relative">

          <div className="max-w-2xl">

            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">

              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />

              Jadwal Survey Nasabah

            </div>

            <h1 className="mt-5 text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
              Informasi Jadwal
              Survey Lapangan
            </h1>

            <p className="mt-4 text-gray-500 leading-relaxed text-sm md:text-base">
              Berikut adalah jadwal survey yang telah dibuat oleh admin
              untuk proses verifikasi pengajuan pinjaman Anda.
              Pastikan Anda berada di lokasi sesuai jadwal yang ditentukan.
            </p>

          </div>

        </div>

      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-10">

        {data.length === 0 ? (

          <div className="bg-white border rounded-3xl p-10 text-center shadow-sm">

            <div className="w-20 h-20 mx-auto rounded-full bg-orange-100 flex items-center justify-center text-3xl">
              📅
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-800">
              Belum Ada Jadwal Survey
            </h2>

            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              Saat ini admin belum membuat jadwal survey
              untuk pengajuan pinjaman Anda.
              Silakan cek secara berkala.
            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {data.map(
              (
                item,
                index
              ) => {

                const isDone =
                  item.status ===
                  "SELESAI";

                return (
<div
  key={`${item.id_survey}-${index}`}
  className="
    relative
    overflow-hidden
    rounded-[32px]
    border
    bg-white
    shadow-sm
    hover:shadow-2xl
    transition-all
    duration-300
  "
>

  {/* BACKGROUND DECOR */}
  <div className="absolute top-0 right-0 w-52 h-52 rounded-full bg-orange-100 blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />

  <div className="relative p-6 md:p-8">

    {/* TOP */}
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

      {/* LEFT */}
      <div className="flex items-start gap-5">

        {/* ICON */}
        <div
          className={`
            w-16
            h-16
            rounded-3xl
            flex
            items-center
            justify-center
            text-3xl
            shrink-0
            ${
              isDone
                ? "bg-green-100"
                : "bg-orange-100"
            }
          `}
        >
          {isDone ? "✅" : "🚗"}
        </div>

        {/* TEXT */}
        <div>

          <div className="flex items-center gap-2 flex-wrap">

            <h2 className="text-2xl font-bold text-gray-800">
              Jadwal Survey Lapangan
            </h2>

            <span className="text-[11px] px-3 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
              REF-{item.id_peminjaman}
            </span>

          </div>

          <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-2xl">
            Tim survey akan melakukan kunjungan ke lokasi Anda
            sesuai jadwal yang telah ditentukan untuk proses
            verifikasi pengajuan pinjaman.
          </p>

        </div>

      </div>

      {/* STATUS */}
      <div
        className={`
          inline-flex
          items-center
          gap-2
          px-4
          py-2
          rounded-2xl
          text-sm
          font-semibold
          whitespace-nowrap
          ${
            isDone
              ? "bg-green-100 text-green-700"
              : "bg-orange-100 text-orange-700"
          }
        `}
      >

        <span
          className={`
            w-2
            h-2
            rounded-full
            ${
              isDone
                ? "bg-green-500"
                : "bg-orange-500 animate-pulse"
            }
          `}
        />

        {isDone
          ? "Survey Selesai"
          : "Menunggu Jadwal"}

      </div>

    </div>

    {/* MAIN INFO */}
    <div className="mt-8 grid lg:grid-cols-3 gap-5">

      {/* TANGGAL */}
      <div className="rounded-3xl border bg-gradient-to-br from-orange-50 to-white p-6">

        <p className="text-xs uppercase tracking-wide text-gray-400 font-medium">
          Tanggal Survey
        </p>

        <p className="mt-3 text-lg font-bold text-gray-800 leading-relaxed">
          {formatTanggal(
            item.tanggal_survey
          )}
        </p>

      </div>

      {/* JAM */}
      <div className="rounded-3xl border bg-white p-6">

        <p className="text-xs uppercase tracking-wide text-gray-400 font-medium">
          Waktu Kunjungan
        </p>

        <p className="mt-3 text-3xl font-bold text-orange-600">
          {formatJam(
            item.tanggal_survey
          )}
        </p>

        <p className="text-sm text-gray-400 mt-1">
          WIB
        </p>

      </div>

      {/* STATUS */}
      <div className="rounded-3xl border bg-white p-6">

        <p className="text-xs uppercase tracking-wide text-gray-400 font-medium">
          Status Survey
        </p>

        <p
          className={`
            mt-3
            text-lg
            font-bold
            ${
              isDone
                ? "text-green-600"
                : "text-orange-600"
            }
          `}
        >
          {item.status}
        </p>

      </div>

    </div>

    {/* LOKASI */}
    <div className="mt-5 rounded-3xl border bg-gray-50 p-6">

      <p className="text-xs uppercase tracking-wide text-gray-400 font-medium">
        Lokasi Survey
      </p>

      <p className="mt-3 text-sm text-gray-700 leading-relaxed">
        {item.lokasi ||
          "Lokasi belum dicantumkan"}
      </p>

    </div>

    {/* CATATAN */}
    {item.catatan && (

      <div className="mt-5 rounded-3xl border border-orange-100 bg-orange-50 p-6">

        <p className="text-xs uppercase tracking-wide text-orange-600 font-semibold">
          Catatan Admin
        </p>

        <p className="mt-3 text-sm text-gray-700 leading-relaxed">
          {item.catatan}
        </p>

      </div>
    )}

    {/* FOOTER INFO */}
    <div className="mt-6 rounded-3xl border bg-white p-5 flex gap-4">

      <div className="text-2xl">
        ℹ️
      </div>

      <div>

        <p className="font-semibold text-gray-800">
          Persiapan Survey
        </p>

        <p className="mt-1 text-sm text-gray-500 leading-relaxed">
          Pastikan Anda berada di lokasi sesuai jadwal dan
          menyiapkan dokumen pendukung apabila diperlukan
          saat proses survey berlangsung.
        </p>

      </div>

    </div>

  </div>

</div>
                );
              }
            )}

          </div>
        )}

      </div>

    </div>
  );
}