import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Prisma } from "@prisma/client";

type PeminjamanWithRelasi =
  Prisma.PeminjamanGetPayload<{
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
        Tidak ada
        pengajuan
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

          <Link
            href="/admin/cicilan"
            className="flex items-center justify-center w-10 h-10 rounded-lg border hover:bg-gray-100"
          >
            ←
          </Link>

          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Detail
              Pengajuan
            </h1>

            <p className="text-sm text-gray-500">
              {nama} •{" "}
              {
                data.length
              }{" "}
              pengajuan
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

              // FIX
              const sudahBayar =
                jadwal.filter(
                  (
                    j
                  ) =>
                    j.status ===
                    "LUNAS"
                )
                  .length;

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
                status =
                  "lunas";
              }

              else if (
                item.status ===
                "ACTIVE"
              ) {
                status =
                  "aktif";

                const telat =
                  jadwal.some(
                    (
                      j
                    ) => {
                      // FIX
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

                if (
                  telat
                ) {
                  status =
                    "telat";
                }
              }

              return (
                <div
                  key={
                    item.id_peminjaman
                  }
                  className="relative bg-white rounded-2xl p-5 border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
                >

                  {/* BAR */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-400" />

                  <div className="flex flex-col gap-5">

                    {/* HEADER */}
                    <div className="flex justify-between">

                      <div>
                        <p className="text-xl font-bold text-gray-800">
                          {formatRupiah(
                            item.total_pinjaman
                          )}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(
                            item.tanggal_pengajuan
                          ).toLocaleDateString(
                            "id-ID",
                            {
                              day:
                                "numeric",
                              month:
                                "long",
                              year:
                                "numeric",
                            }
                          )}
                        </p>
                      </div>

                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          status ===
                          "baru"
                            ? "bg-blue-100 text-blue-600"
                            : status ===
                              "aktif"
                            ? "bg-green-100 text-green-600"
                            : status ===
                              "lunas"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {status ===
                          "baru" &&
                          "Baru"}

                        {status ===
                          "aktif" &&
                          "Aktif"}

                        {status ===
                          "telat" &&
                          "Telat"}

                        {status ===
                          "lunas" &&
                          "Lunas"}
                      </span>

                    </div>

                    {/* INFO */}
                    <div className="flex justify-between text-sm">

                      <div>
                        <p className="text-gray-400 text-xs">
                          Tenor
                        </p>

                        <p className="font-semibold">
                          {
                            total
                          }{" "}
                          bulan
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-gray-400 text-xs">
                          Progress
                        </p>

                        <p className="font-semibold">
                          {
                            sudahBayar
                          }
                          /
                          {
                            total
                          }
                        </p>
                      </div>

                    </div>

                    {/* PROGRESS */}
                    <div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">

                        <div
                          className={`h-full transition-all ${
                            status ===
                            "telat"
                              ? "bg-red-500"
                              : status ===
                                "lunas"
                              ? "bg-emerald-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${progress}%`,
                          }}
                        />

                      </div>

                      <p className="text-[11px] text-right mt-1 text-gray-400">
                        {Math.round(
                          progress
                        )}
                        %
                      </p>
                    </div>

                    {/* BUTTON */}
                    <div className="flex justify-end">

                      <Link
                        href={`/admin/cicilan/konten/${id}/${item.id_peminjaman}`}
                        className={`px-4 py-2 rounded-lg text-sm text-white ${
                          status ===
                          "baru"
                            ? "bg-blue-600"
                            : status ===
                              "aktif"
                            ? "bg-green-600"
                            : status ===
                              "lunas"
                            ? "bg-emerald-600"
                            : "bg-red-500"
                        }`}
                      >
                        {status ===
                        "baru"
                          ? "Buat Jadwal"
                          : status ===
                            "aktif"
                          ? "Detail"
                          : status ===
                            "lunas"
                          ? "Selesai"
                          : "Lihat"}
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