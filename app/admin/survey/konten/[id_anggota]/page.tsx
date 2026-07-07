import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Prisma } from "@prisma/client";

type PeminjamanWithRelasi =
  Prisma.peminjamanGetPayload<{
    include: {
      anggota: true;
      jadwalSurvey: true;
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

  const data:
    PeminjamanWithRelasi[] =
    await prisma.peminjaman.findMany({
      where: {
        id_anggota: id,
        status: "APPROVED",
      },

      include: {
        anggota: true,
        jadwalSurvey: true,
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
            href="/admin/survey"
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
              Detail Survey
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

              const survey =
                item
                  .jadwalSurvey?.[0];

              const sudahSurvey =
                item.status_survey ===
                "SUDAH";

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
                      ${
                        sudahSurvey
                          ? "bg-gradient-to-r from-blue-500 to-cyan-400"
                          : "bg-gradient-to-r from-orange-500 to-yellow-400"
                      }
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

                      {/* STATUS */}
                      <span
                        className={`
                          text-xs
                          px-3
                          py-1
                          rounded-full
                          font-medium
                          ${
                            sudahSurvey
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                          }
                        `}
                      >
                        {sudahSurvey
                          ? "Sudah Survey"
                          : "Belum Survey"}
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
                          {
                            item.jangka_waktu
                          }{" "}
                          Bulan
                        </p>

                      </div>

                      {/* SURVEY */}
                      <div className="bg-gray-50 border rounded-2xl p-4">

                        <p className="text-xs text-gray-400">
                          Jadwal Survey
                        </p>

                        <p className="text-sm font-semibold text-gray-700 mt-1">

                          {survey
                            ? new Date(
                                survey.tanggal_survey
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
                              )
                            : "-"}

                        </p>

                      </div>

                    </div>

                    {/* LOKASI */}
                    {survey?.lokasi && (
                      <div className="bg-gray-50 border rounded-2xl p-4">

                        <p className="text-xs text-gray-400 mb-1">
                          Lokasi Survey
                        </p>

                        <p className="text-sm text-gray-700">
                          {
                            survey.lokasi
                          }
                        </p>

                      </div>
                    )}

                    {/* ACTION */}
                    <div className="flex justify-end">

                      <Link
                        href={`/admin/survey/konten/${id}/${item.id_peminjaman}`}
                        className={`
                          px-5
                          py-3
                          rounded-xl
                          text-sm
                          font-medium
                          text-white
                          shadow-sm
                          transition
                          ${
                            sudahSurvey
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "bg-orange-500 hover:bg-orange-600"
                          }
                        `}
                      >
                        {sudahSurvey
                          ? "Lihat Jadwal"
                          : "Buat Jadwal Survey"}
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