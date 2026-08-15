"use client";

type Props = {
  data?: any[];
};

export default function ClientPage({ data = [] }: Props) {
  const formatTanggal = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatJam = (date: string) =>
    new Date(date).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <div className="relative overflow-hidden border-b border-gray-200 bg-white">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Jadwal Survey Nasabah
            </div>

            <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-gray-800 sm:text-[30px]">
              Informasi Jadwal Survey Lapangan
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Berikut adalah jadwal survey yang telah dibuat oleh admin
              untuk proses verifikasi pengajuan pinjaman Anda.
              Pastikan Anda berada di lokasi sesuai jadwal yang ditentukan.
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        {data.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
              📅
            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-800 sm:text-xl">
              Belum Ada Jadwal Survey
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">
              Saat ini admin belum membuat jadwal survey
              untuk pengajuan pinjaman Anda.
              Silakan cek secara berkala.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {data.map((item, index) => {
              const isDone = item.status === "SELESAI";

              return (
                <div
                  key={`${item.id_survey}-${index}`}
                  className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-emerald-50 blur-3xl" />

                  <div className="relative p-5 sm:p-6">
                    {/* TOP */}
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl ${
                            isDone ? "bg-green-50" : "bg-yellow-50"
                          }`}
                        >
                          {isDone ? "✅" : "🚗"}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-base font-semibold text-gray-800 sm:text-lg">
                              Jadwal Survey Lapangan
                            </h2>

                            <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500">
                              REF-{item.id_peminjaman}
                            </span>
                          </div>

                          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
                            Tim survey akan melakukan kunjungan ke lokasi Anda
                            sesuai jadwal yang telah ditentukan untuk proses
                            verifikasi pengajuan pinjaman.
                          </p>
                        </div>
                      </div>

                      {/* STATUS */}
                      <div
                        className={`inline-flex items-center gap-2 self-start whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${
                          isDone
                            ? "border-green-200 bg-green-100 text-green-700"
                            : "border-yellow-200 bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isDone ? "bg-green-500" : "bg-yellow-500"
                          }`}
                        />
                        {isDone ? "Survey Selesai" : "Menunggu Jadwal"}
                      </div>
                    </div>

                    {/* MAIN INFO */}
                    <div className="mt-6 grid gap-3 lg:grid-cols-3">
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          Tanggal Survey
                        </p>
                        <p className="mt-2 text-sm font-semibold leading-relaxed text-gray-800">
                          {formatTanggal(item.tanggal_survey)}
                        </p>
                      </div>

                      <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          Waktu Kunjungan
                        </p>
                        <p className="mt-2 text-lg font-semibold text-[#1a3c2e]">
                          {formatJam(item.tanggal_survey)}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">WIB</p>
                      </div>

                      <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          Status Survey
                        </p>
                        <p
                          className={`mt-2 text-sm font-semibold ${
                            isDone ? "text-green-600" : "text-yellow-600"
                          }`}
                        >
                          {item.status}
                        </p>
                      </div>
                    </div>

                    {/* LOKASI */}
                    <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Lokasi Survey
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-gray-700">
                        {item.lokasi || "Lokasi belum dicantumkan"}
                      </p>
                    </div>

                    {/* CATATAN */}
                    {item.catatan && (
                      <div className="mt-3 rounded-xl border border-yellow-100 bg-yellow-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">
                          Catatan Admin
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-gray-700">
                          {item.catatan}
                        </p>
                      </div>
                    )}

                    {/* FOOTER INFO */}
                    <div className="mt-4 flex gap-3 rounded-xl border border-gray-200 bg-white p-4">
                      <div className="shrink-0 text-xl">ℹ️</div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Persiapan Survey
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-gray-500">
                          Pastikan Anda berada di lokasi sesuai jadwal dan
                          menyiapkan dokumen pendukung apabila diperlukan
                          saat proses survey berlangsung.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}