import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import DetailButton from "./DetailButton";

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
  const id = Number(params.id_anggota);

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
        tanggal_pengajuan: "desc",
      },
    });

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-gray-400">
              Tidak ada pengajuan
            </p>
          </div>
        </div>
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
    num.toLocaleString("id-ID");

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =====================================================
          HEADER
      ===================================================== */}
<div className="border-b bg-white">
  <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-10">

    {/* BACK */}
    <Link
      href="/admin/cicilan"
      className="
        flex h-10 w-10 shrink-0
        items-center justify-center
        rounded-xl
        border border-gray-200
        bg-white
        text-lg text-gray-600
        transition-all
        hover:border-blue-200
        hover:bg-blue-50
        hover:text-blue-700
      "
      aria-label="Kembali"
    >
      ←
    </Link>

    {/* TITLE */}
    <div className="min-w-0">
      <h1 className="text-2xl font-bold text-gray-800">
        Detail Pengajuan
      </h1>

      <p className="mt-0.5 text-sm text-gray-500">
        {nama} • {data.length} pengajuan
      </p>
    </div>

  </div>
</div>


      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div className="w-full px-4 py-6 sm:px-6 lg:px-10">

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          {/* =================================================
              TABLE
          ================================================= */}
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              {/* =================================================
                  HEADER
              ================================================= */}
              <thead>

                <tr className="bg-blue-800 text-white">

                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide">
                    Pengajuan
                  </th>

                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide">
                    Jangka Waktu
                  </th>

                  <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide">
                    Progress
                  </th>

                  <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide">
                    Status
                  </th>

                  <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide">
                    Aksi
                  </th>

                </tr>

              </thead>


              {/* =================================================
                  BODY
              ================================================= */}
              <tbody>

                {data.map((item) => {

                  const total =
                    item.jangka_waktu || 0;

                  const jadwal =
                    item.jadwal || [];

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


                  // ============================================
                  // STATUS
                  // ============================================
                  let status:
                    | "baru"
                    | "Berjalan"
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

                  } else if (
                    item.status ===
                    "ACTIVE"
                  ) {

                    status =
                      "Berjalan";

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
                      status =
                        "telat";
                    }
                  }


                  // ============================================
                  // STATUS STYLE
                  // ============================================
                  const badgeClass =
                    status === "baru"
                      ? "bg-blue-100 text-blue-700"
                      : status === "Berjalan"
                      ? "bg-yellow-100 text-yellow-700"
                      : status === "lunas"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700";


                  const badgeLabel =
                    status === "baru"
                      ? "Baru"
                      : status === "Berjalan"
                      ? "Berjalan"
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
                    status === "telat"
                      ? "border-red-200 text-red-600 hover:bg-red-600 hover:text-white"
                      : "border-blue-200 text-blue-700 hover:bg-blue-700 hover:text-white";


                  const buttonLabel =
                    status === "baru"
                      ? "Buat Jadwal"
                      : status === "Berjalan"
                      ? "Detail"
                      : status === "lunas"
                      ? "Selesai"
                      : "Lihat";


                  const belumAdaJadwal =
                    jadwal.length === 0;


                  return (

                    <tr
                      key={
                        item.id_peminjaman
                      }
                      className="
                        border-t
                        border-gray-100
                        transition-colors
                        hover:bg-blue-50/40
                      "
                    >

                      {/* ======================================
                          PENGAJUAN
                      ======================================= */}
                      <td className="px-5 py-4">

                        <div>

                          <p className="text-sm font-semibold text-gray-800">
                            {formatRupiah(
                              item.total_pinjaman
                            )}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Pengajuan{" "}
                            {new Date(
                              item.tanggal_pengajuan
                            ).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>

                        </div>

                      </td>


                      {/* ======================================
                          JANGKA WAKTU
                      ======================================= */}
                      <td className="px-5 py-4">

                        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                          {total} Bulan
                        </span>

                      </td>


                      {/* ======================================
                          PROGRESS
                      ======================================= */}
                      <td className="px-5 py-4">

                        {belumAdaJadwal ? (

                          <div className="flex min-w-[150px] items-center gap-2">

                            <span className="text-xs text-gray-400">
                              Belum ada jadwal
                            </span>

                          </div>

                        ) : (

                          <div className="min-w-[150px]">

                            <div className="mb-1 flex items-center justify-between">

                              <span className="text-xs font-semibold text-gray-700">
                                {sudahBayar}/{total}
                              </span>

                              <span className="text-[11px] text-gray-400">
                                {Math.round(
                                  progress
                                )}%
                              </span>

                            </div>

                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">

                              <div
                                className={`h-full rounded-full transition-all ${progressBarClass}`}
                                style={{
                                  width: `${progress}%`,
                                }}
                              />

                            </div>

                          </div>

                        )}

                      </td>


                      {/* ======================================
                          STATUS
                      ======================================= */}
                      <td className="px-5 py-4 text-center">

                        <span
                          className={`
                            inline-flex
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            ${badgeClass}
                          `}
                        >
                          {badgeLabel}
                        </span>

                      </td>


                      {/* ======================================
                          AKSI
                      ======================================= */}
                      <td className="px-5 py-4 text-center">

<DetailButton
  href={`/admin/cicilan/konten/${id}/${item.id_peminjaman}`}
  label={buttonLabel}
  className={buttonClass}
/>

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}