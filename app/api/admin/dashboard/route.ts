import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type PeriodPoint = {
  label: string;
  wajib: number;
  pendidikan: number;
  pinjaman: number;
};

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agt",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

function toYearKey(date: Date) {
  return String(date.getFullYear());
}

function sumByPeriod(
  points: PeriodPoint[],
  key: string,
  field: "wajib" | "pendidikan" | "pinjaman",
  value: number
) {
  const point = points.find((item) => item.label === key);

  if (point) {
    point[field] += value;
  }
}

export async function GET() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const firstYear = currentYear - 4;

  const monthly: PeriodPoint[] = MONTH_LABELS.map((label) => ({
    label,
    wajib: 0,
    pendidikan: 0,
    pinjaman: 0,
  }));

  const yearly: PeriodPoint[] = Array.from({ length: 5 }, (_, index) => {
    const year = String(firstYear + index);

    return {
      label: year,
      wajib: 0,
      pendidikan: 0,
      pinjaman: 0,
    };
  });

  try {
    const [
      totalNasabah,
      totalPinjamanAktif,
      saldoWajib,
      saldoPendidikan,
      pembayaran,
      pinjaman,
    ] = await Promise.all([
      prisma.anggota.count({
        where: {
          role: "nasabah",
        },
      }),
      prisma.peminjaman.count({
        where: {
          status: "ACTIVE",
        },
      }),
      prisma.pembayaranSimpanan.aggregate({
        where: {
          status: "BERHASIL",
          simpanan: {
            jenis_simpanan: "WAJIB",
          },
        },
        _sum: {
          nominal_bayar: true,
        },
      }),
      prisma.pembayaranSimpanan.aggregate({
        where: {
          status: "BERHASIL",
          simpanan: {
            jenis_simpanan: "PENDIDIKAN",
          },
        },
        _sum: {
          nominal_bayar: true,
        },
      }),
      prisma.pembayaranSimpanan.findMany({
        where: {
          status: "BERHASIL",
          tanggal_bayar: {
            gte: new Date(firstYear, 0, 1),
          },
          simpanan: {
            jenis_simpanan: {
              in: ["WAJIB", "PENDIDIKAN"],
            },
          },
        },
        select: {
          tanggal_bayar: true,
          nominal_bayar: true,
          simpanan: {
            select: {
              jenis_simpanan: true,
            },
          },
        },
      }),
      prisma.peminjaman.findMany({
        where: {
          status: {
            in: ["APPROVED", "ACTIVE"],
          },
          tanggal_pengajuan: {
            gte: new Date(firstYear, 0, 1),
          },
        },
        select: {
          tanggal_pengajuan: true,
          total_pinjaman: true,
        },
      }),
    ]);

    for (const item of pembayaran) {
      const type =
        item.simpanan.jenis_simpanan === "PENDIDIKAN"
          ? "pendidikan"
          : "wajib";

      if (item.tanggal_bayar.getFullYear() === currentYear) {
        monthly[item.tanggal_bayar.getMonth()][type] += item.nominal_bayar;
      }

      sumByPeriod(
        yearly,
        toYearKey(item.tanggal_bayar),
        type,
        item.nominal_bayar
      );
    }

    for (const item of pinjaman) {
      if (item.tanggal_pengajuan.getFullYear() === currentYear) {
        monthly[item.tanggal_pengajuan.getMonth()].pinjaman +=
          item.total_pinjaman;
      }

      sumByPeriod(
        yearly,
        toYearKey(item.tanggal_pengajuan),
        "pinjaman",
        item.total_pinjaman
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        scorecards: {
          totalNasabah,
          totalPinjamanAktif,
          saldoWajib: saldoWajib._sum.nominal_bayar ?? 0,
          saldoPendidikan: saldoPendidikan._sum.nominal_bayar ?? 0,
        },
        charts: {
          monthly,
          yearly,
          currentYear,
        },
      },
    });
  } catch (error) {
    console.error("GET ADMIN DASHBOARD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data dashboard",
      },
      {
        status: 500,
      }
    );
  }
}
