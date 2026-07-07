import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Prisma } from "@prisma/client";

type PeminjamanWithRelasi =
  Prisma.peminjamanGetPayload<{
    include: {
      anggota: true;
      jadwal: true;
    };
  }>;

export default async function DetailNasabah({
  params,
}: {
  params: {
    id_anggota: string;
  };
}) {
  const id = Number(
    params.id_anggota
  );

  if (isNaN(id)) {
    return (
      <div className="p-6 text-red-400">
        ID tidak valid
      </div>
    );
  }

  const data: PeminjamanWithRelasi[] =
    await prisma.peminjaman.findMany({
      where: {
        id_anggota: id,

        status: {
          in: [
            "APPROVED",
            "ACTIVE",
            "LUNAS",
          ],
        },
      },

      include: {
        anggota: true,
        jadwal: true,
      },

      orderBy: {
        tanggal_pengajuan:
          "desc",
      },
    });

  if (
    !data ||
    data.length === 0
  ) {
    return (
      <div className="p-6 text-gray-400">
        Tidak ada pengajuan
      </div>
    );
  }

  const nama =
    data[0].anggota?.nama ||
    "Tanpa Nama";

  const formatRupiah = (
    num: number
  ) =>
    "Rp " +
    num.toLocaleString(
      "id-ID"
    );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="bg-white border-b">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center gap-4">

          {/* BACK */}
          <Link
            href="/admin/cicilan"
            className="
              flex
              items-center
              justify-center
              w-10
              h-10
              rounded-xl
              border
              hover:bg-gray-100
              transition
            "
          >
            ←
          </Link>

          {/* TITLE */}
          <div>

            <h1 className="text-2xl font-bold text-gray-800">
              Detail Pengajuan
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              {nama} •{" "}
              {data.length} pengajuan
            </p>

          </div>

        </div>

      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-6">

        <div className="grid md:grid-cols-2 gap-5">

          {data.map(
            (item) => {

              const total =
                item.jangka_waktu ||
                0;

              const jadwal =
                item.jadwal ||
                [];

              const sudahBayar =
                jadwal.filter(
                  (j) =>
                    j.status ===
                    "LUNAS"
                ).length;

              const progress =
                total === 0
                  ? 0
                  : (sudahBayar /
                      total) *
                    100;

              let status:
                | "baru"
                | "aktif"
                | "telat"
                | "lunas" =
                "baru";

              const today =
                new Date();

              today.setHours(
                0,
                0,
                0,
                0
              );

              if (
                item.status ===
                "LUNAS"
              ) {
                status = "lunas";
              } else if (
                item.status ===
                "ACTIVE"
              ) {
                status = "aktif";

                const telat =
                  jadwal.some(
                    (j) => {
                      if (
                        j.status ===
                        "LUNAS"
                      ) {
                        return false;
                      }

                      const dueDate =
                        new Date(
                          j.jatuh_tempo
                        );

                      dueDate.setHours(
                        0,
                        0,
                        0,
                        0
                      );

                      return (
                        dueDate <
                        today
                      );
                    }
                  );

                if (telat) {
                  status = "telat";
                }
              }

              const accentGradient =
                status === "telat"
                  ? "from-red-500 to-rose-400"
                  : status === "lunas"
                  ? "from-emerald-500 to-teal-400"
                  : status === "aktif"
                  ? "from-blue-500 to-blue-700"
                  : "from-blue-500 to-cyan-400";

              const badgeClass =
                status === "baru"
                  ? "bg-blue-100 text-blue-700"
                  : status === "aktif"
                  ? "bg-blue-100 text-blue-700"
                  : status === "lunas"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700";

              const badgeLabel =
                status === "baru"
                  ? "Baru"
                  : status === "aktif"
                  ? "Aktif"
                  : status === "lunas"
                  ? "Lunas"
                  : "Telat";

              const progressBarClass =
                status === "telat"
                  ? "bg-red-500"
                  : status === "lunas"
                  ? "bg-emerald-500"
                  : "bg-blue-500";

              const buttonClass =
                status === "baru"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : status === "aktif"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : status === "lunas"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-red-500 hover:bg-red-600";

              const buttonLabel =
                status === "baru"
                  ? "Buat Jadwal"
                  : status === "aktif"
                  ? "Detail"
                  : status === "lunas"
                  ? "Selesai"
                  : "Lihat";

              const belumAdaJadwal =
                jadwal.length === 0;

              return (
                <div
                  key={
                    item.id_peminjaman
                  }
                  className="
                    relative
                    bg-white
                    rounded-3xl
                    border
                    shadow-sm
                    hover:shadow-xl
                    hover:-translate-y-1
                    transition-all
                    duration-300
                    overflow-hidden
                    p-6
                  "
                >

                  {/* ACCENT */}
                  <div
                    className={`
                      absolute
                      top-0
                      left-0
                      w-full
                      h-1
                      bg-gradient-to-r
                      ${accentGradient}
                    `}
                  />

                  <div className="flex flex-col gap-6">

                    {/* TOP */}
                    <div className="flex items-start justify-between">

                      <div>

                        <p className="text-2xl font-bold text-gray-800">
                          {formatRupiah(
                            item.total_pinjaman
                          )}
                        </p>

                        <p className="text-xs text-gray-400 mt-2">
                          Pengajuan:
                        </p>

                        <p className="text-sm text-gray-600">
                          {new Date(
                            item.tanggal_pengajuan
                          ).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </p>

                      </div>

                      {/* STATUS */}
                      <span
                        className={`
                          text-xs
                          px-3
                          py-1
                          rounded-full
                          font-medium
                          ${badgeClass}
                        `}
                      >
                        {badgeLabel}
                      </span>

                    </div>

                    {/* INFO */}
                    <div className="grid grid-cols-2 gap-4">

                      {/* TENOR */}
                      <div className="bg-gray-50 border rounded-2xl p-4">

                        <p className="text-xs text-gray-400">
                          Jangka Waktu
                        </p>

                        <p className="text-lg font-bold text-gray-800 mt-1">
                          {total} Bulan
                        </p>

                      </div>

                      {/* PROGRESS COUNT */}
                      <div className="bg-gray-50 border rounded-2xl p-4">

                        <p className="text-xs text-gray-400">
                          Progress
                        </p>

                        {belumAdaJadwal ? (
                          <p className="text-sm font-semibold text-gray-400 mt-1">
                            Belum ada
                          </p>
                        ) : (
                          <p className="text-lg font-bold text-gray-800 mt-1">
                            {sudahBayar}/{total}
                          </p>
                        )}

                      </div>

                    </div>

                    {/* PROGRESS BAR */}
                    {belumAdaJadwal ? (
                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          bg-gray-50
                          border
                          border-dashed
                          border-gray-300
                          rounded-2xl
                          p-4
                        "
                      >

                        <div className="w-9 h-9 shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-base">
                          🗓️
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-600">
                            Jadwal cicilan belum dibuat
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Buat jadwal untuk mulai memantau progress pembayaran
                          </p>
                        </div>

                      </div>
                    ) : (
                      <div className="bg-gray-50 border rounded-2xl p-4">

                        <p className="text-xs text-gray-400 mb-2">
                          Progress Pembayaran
                        </p>

                        <div className="w-full h-2.5 bg-white border rounded-full overflow-hidden">

                          <div
                            className={`h-full transition-all ${progressBarClass}`}
                            style={{
                              width: `${progress}%`,
                            }}
                          />

                        </div>

                        <p className="text-[11px] text-right mt-1 text-gray-400">
                          {Math.round(progress)}%
                        </p>

                      </div>
                    )}

                    {/* ACTION */}
                    <div className="flex justify-end">

                      <Link
                        href={`/admin/cicilan/konten/${id}/${item.id_peminjaman}`}
                        className={`
                          px-5
                          py-3
                          rounded-xl
                          text-sm
                          font-medium
                          text-white
                          shadow-sm
                          transition
                          ${buttonClass}
                        `}
                      >
                        {buttonLabel}
                      </Link>

                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>

    </div>
  );
}