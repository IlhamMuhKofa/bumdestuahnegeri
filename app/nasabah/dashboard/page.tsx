import DashboardHeader from "@/app/nasabah/item/banner";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ScoreCard from "@/app/nasabah/item/scorecard";
import CardPendidikan from "../item/cardpendidikan";
import CardPengingat from "../item/cardpengingat";

export default async function BerandaNasabahPage() {
  const session = await getServerSession(authOptions);

  // Kalau belum login → lempar ke login
  if (!session?.user || !(session.user as any).id) {
    redirect("/auth/login");
  }

  // Ambil user asli dari database
  const user = await prisma.anggota.findUnique({
    where: { id: Number((session.user as any).id) },
  });

  if (!user) {
    redirect("/auth/login");
  }

  const [
    saldoWajib,
    saldoPendidikan,
    totalPengajuan,
  ] = await Promise.all([
    prisma.pembayaranSimpanan.aggregate({
      _sum: {
        nominal_bayar: true,
      },
      where: {
        status: "BERHASIL",

        simpanan: {
          id_anggota: user.id,
          jenis_simpanan: "WAJIB",
        },
      },
    }),

    prisma.pembayaranSimpanan.aggregate({
      _sum: {
        nominal_bayar: true,
      },
      where: {
        status: "BERHASIL",

        simpanan: {
          id_anggota: user.id,
          jenis_simpanan: "PENDIDIKAN",
        },
      },
    }),

    prisma.peminjaman.count({
      where: {
        id_anggota: user.id,
        status: "ACTIVE",
      },
    }),
  ]);

  const totalSaldoWajib =
    saldoWajib._sum.nominal_bayar ?? 0;

  const totalSaldoPendidikan =
    saldoPendidikan._sum.nominal_bayar ?? 0;

  const tabunganPendidikan =
    await prisma.simpanan.findFirst({
      where: {
        id_anggota: user.id,
        jenis_simpanan: "PENDIDIKAN",
      },

      include: {
        pembayaran_simpanan: true,
      },

      orderBy: {
        created_at: "desc",
      },
    });

  const totalTerkumpul =
    tabunganPendidikan
      ?.pembayaran_simpanan
      .filter(
        (x) =>
          x.status === "BERHASIL"
      )
      .reduce(
        (a, b) =>
          a + b.nominal_bayar,
        0
      ) ?? 0;


  const cardPendidikan =
    tabunganPendidikan &&
      totalTerkumpul <
      (tabunganPendidikan.target_dana ?? 0)
      ? {
        id_simpanan:
          tabunganPendidikan.id_simpanan,

        tujuan:
          tabunganPendidikan.tujuan ?? "",

        target_dana:
          tabunganPendidikan.target_dana ?? 0,

        jangka_waktu:
          tabunganPendidikan.jangka_waktu ?? 0,

        total_terkumpul:
          totalTerkumpul,
      }
      : null;
  console.log({
    totalSaldoWajib,
    totalSaldoPendidikan,
    totalPengajuan,
  });

  const jadwalTerdekat =
    await prisma.jadwalAngsuran.findFirst({
      where: {
        peminjaman: {
          id_anggota: user.id,
          status: "ACTIVE",
        },

        status: {
          not: "LUNAS",
        },
      },

      include: {
        pembayaran: true,
        peminjaman: true,
      },

      orderBy: {
        jatuh_tempo: "asc",
      },
    });

  let statusAngsuran = "PENDING";

  if (jadwalTerdekat) {
    const payment =
      jadwalTerdekat.pembayaran?.[0];

    if (
      jadwalTerdekat.status ===
      "LUNAS"
    ) {
      statusAngsuran = "LUNAS";
    } else if (
      payment &&
      payment.status === "MENUNGGU"
    ) {
      statusAngsuran = "MENUNGGU";
    } else {
      const today = new Date();
      const due = new Date(
        jadwalTerdekat.jatuh_tempo
      );

      today.setHours(0, 0, 0, 0);
      due.setHours(0, 0, 0, 0);

      statusAngsuran =
        due < today
          ? "TELAT"
          : "PENDING";
    }
  }

  const pengingatAngsuran =
    jadwalTerdekat
      ? {
        cicilanKe:
          jadwalTerdekat.cicilan_ke,

        totalCicilan:
          jadwalTerdekat.peminjaman
            .jangka_waktu,

        jatuhTempo:
          jadwalTerdekat.jatuh_tempo,

        nominal:
          jadwalTerdekat.jumlah_tagihan,

        status:
          statusAngsuran,

        idJadwal:
          jadwalTerdekat.id_jadwal,

        idPeminjaman:
          jadwalTerdekat.id_peminjaman,
      }
      : null;

  return (
<div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8 space-y-8">

  {/* ================= HEADER ================= */}
  <DashboardHeader user={user} />

  {/* ================= SCORECARD ================= */}
  <ScoreCard
    saldoWajib={totalSaldoWajib}
    saldoPendidikan={totalSaldoPendidikan}
    totalPengajuan={totalPengajuan}
  />

  {/* ================= MAIN GRID ================= */}
  <div className="grid gap-6 xl:grid-cols-3 items-stretch">

    {/* LEFT (PENDIDIKAN) */}
    <div className="xl:col-span-2 flex flex-col h-full">
      {cardPendidikan && (
        <div className="h-full">
          <CardPendidikan data={cardPendidikan} />
        </div>
      )}
    </div>

    {/* RIGHT (PENGINGAT) */}
    <div className="flex flex-col h-full">
      {pengingatAngsuran && (
        <div className="h-full">
          <CardPengingat data={pengingatAngsuran} />
        </div>
      )}
    </div>

  </div>

</div>
  );
}