import { prisma } from "@/lib/prisma";
import Client from "./client";
import Pagination from "../component/Pagination";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_SIZE = 10;

type Props = {
  searchParams?: Promise<{
    page?: string;
    q?: string;
    sort?: string;
  }>;
};

export default async function Page({
  searchParams,
}: Props) {
  const params = await searchParams;

  // =====================================================
  // PAGINATION PARAMETER
  // =====================================================
  const currentPage = Math.max(
    Number(params?.page || 1),
    1
  );

  const query =
    params?.q?.trim() || "";

  const sort =
    params?.sort || "terbaru";

  const skip =
    (currentPage - 1) *
    PAGE_SIZE;


  // =====================================================
  // NASABAH
  // =====================================================
  const dataRaw =
    await prisma.peminjaman.findMany({
      where: {
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
      },

      orderBy: {
        tanggal_pengajuan:
          "desc",
      },
    });


  // =====================================================
  // GROUPING NASABAH
  // =====================================================
  const grouped: any = {};

  dataRaw.forEach((item) => {
    const id =
      item.id_anggota;

    if (!grouped[id]) {
      grouped[id] = {
        id_anggota: id,

        nama:
          item.anggota
            ?.nama ||
          "Tanpa Nama",

        total_pengajuan: 0,

        terakhir:
          item.tanggal_pengajuan,
      };
    }

    grouped[id].total_pengajuan += 1;

    if (
      new Date(
        item.tanggal_pengajuan
      ) >
      new Date(
        grouped[id].terakhir
      )
    ) {
      grouped[id].terakhir =
        item.tanggal_pengajuan;
    }
  });


  // =====================================================
  // UBAH OBJECT → ARRAY
  // =====================================================
  let nasabahAll =
    Object.values(
      grouped
    ) as any[];


  // =====================================================
  // SEARCH
  // =====================================================
  if (query) {
    const keyword =
      query.toLowerCase();

    nasabahAll =
      nasabahAll.filter(
        (item: any) =>
          item.nama
            ?.toLowerCase()
            .includes(keyword)
      );
  }


  // =====================================================
  // SORT
  // =====================================================
  nasabahAll.sort(
    (a: any, b: any) => {

      switch (sort) {

        case "terlama":
          return (
            new Date(
              a.terakhir
            ).getTime() -
            new Date(
              b.terakhir
            ).getTime()
          );

        case "az":
          return (
            a.nama || ""
          ).localeCompare(
            b.nama || "",
            "id"
          );

        case "za":
          return (
            b.nama || ""
          ).localeCompare(
            a.nama || "",
            "id"
          );

        case "terbaru":
        default:
          return (
            new Date(
              b.terakhir
            ).getTime() -
            new Date(
              a.terakhir
            ).getTime()
          );
      }

    }
  );


  // =====================================================
  // TOTAL DATA
  // =====================================================
  const totalData =
    nasabahAll.length;


  // =====================================================
  // TOTAL PAGE
  // =====================================================
  const totalPages =
    Math.max(
      Math.ceil(
        totalData /
          PAGE_SIZE
      ),
      1
    );


  // =====================================================
  // AMBIL 10 NASABAH SESUAI HALAMAN
  // =====================================================
  const nasabah =
    nasabahAll.slice(
      skip,
      skip + PAGE_SIZE
    );


  // =====================================================
  // JADWAL
  // =====================================================
  const jadwal =
    await prisma.jadwal_angsuran.findMany({
      include: {
        peminjaman: {
          include: {
            anggota: true,
          },
        },
      },

      orderBy: {
        jatuh_tempo:
          "asc",
      },
    });


  // =====================================================
  // RETURN
  // =====================================================
  return (
    <>
      <Client
        nasabah={nasabah}
        jadwal={jadwal}
      />

      {/* =================================================
          PAGINATION
      ================================================== */}
      <div className="bg-gray-50 px-2 pb-6">
        <div className="mx-auto max-w-7xl">

          <Pagination
            currentPage={
              currentPage
            }
            totalPages={
              totalPages
            }
            basePath="/admin/cicilan"
            totalItems={
              totalData
            }
            pageSize={
              PAGE_SIZE
            }
            searchParams={{
              q: query,
              sort,
            }}
          />

        </div>
      </div>
    </>
  );
}