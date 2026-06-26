import {
  Wallet,
  CalendarDays,
  Target,
  TrendingUp,
} from "lucide-react";

type Props = {
  title: string;
  idAnggota: number;
  data: any[];

    onOpenModalJadwal?: () => void;
  onOpenModalBayar?: () => void;

  hasJadwal?: boolean;
};

export default function CardSimpanan({
  title,
  idAnggota,
  data,
  onOpenModalJadwal,
  onOpenModalBayar,
  hasJadwal = false,
}: Props) {
  const isWajib =
    title === "Simpanan Wajib";

  // ====================================
  // SIMPANAN WAJIB
  // ====================================
// ====================================
// SIMPANAN WAJIB
// ====================================
const semuaTagihan = isWajib
  ? data.flatMap(
      (item) =>
        item.pembayaran || []
    )
  : [];

const totalTagihan =
  semuaTagihan.reduce(
    (sum, item) =>
      sum + item.nominal,
    0
  );

const saldoSimpanan =
  semuaTagihan
    .filter(
      (item) =>
        item.status ===
        "BERHASIL"
    )
    .reduce(
      (sum, item) =>
        sum + item.nominal,
      0
    );

const sisaTagihan =
  totalTagihan -
  saldoSimpanan;

const jumlahTagihan =
  semuaTagihan.length;

const jumlahLunas =
  semuaTagihan.filter(
    (item) =>
      item.status ===
      "BERHASIL"
  ).length;

const progressWajib =
  jumlahTagihan > 0
    ? Math.round(
        (jumlahLunas /
          jumlahTagihan) *
          100
      )
    : 0;

const statusSimpanan =
  data.length > 0
    ? data[0].status
    : "BELUM ADA";

  // ====================================
  // PENDIDIKAN
  // ====================================
  const totalTarget =
    !isWajib
      ? data.reduce(
          (a, b) =>
            a +
            (b.target_dana || 0),
          0
        )
      : 0;

  const totalTerkumpul =
    !isWajib
      ? data.reduce(
          (a, b) =>
            a +
            (b.total_terkumpul ||
              0),
          0
        )
      : 0;

  const totalPembayaran =
    !isWajib
      ? data.reduce(
          (a, b) =>
            a +
            (b.pembayaran
              ?.length || 0),
          0
        )
      : 0;

  const progress =
    totalTarget > 0
      ? Math.round(
          (totalTerkumpul /
            totalTarget) *
            100
        )
      : 0;

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

      {/* HEADER */}
      <div className="flex items-center justify-between bg-white px-6 py-5">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">

            <Wallet className="h-6 w-6 text-blue-700" />

          </div>

          <div>

            <h2 className="text-lg font-bold text-blue-900">
              {title}
            </h2>

            <p className="text-sm text-slate-500">
              Ringkasan data simpanan
            </p>

          </div>

        </div>

<div className="flex gap-2">
  {isWajib ? (
    <>
      <button
        onClick={onOpenModalJadwal}
        className="rounded-xl bg-blue-900 px-4 py-2 text-sm font-medium text-white"
      >
        Buat Jadwal
      </button>

      <button
        onClick={onOpenModalBayar}
        className="rounded-xl bg-blue-900 px-4 py-2 text-sm font-medium text-white"
      >
        Input Pembayaran
      </button>
    </>
  ) : (
    <button
      onClick={onOpenModalBayar}
      className="rounded-xl bg-blue-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-900"
    >
      Tambah Pembayaran
    </button>
  )}
</div>

      </div>

      {/* CONTENT */}
 {isWajib ? (
  <div className="grid gap-4 p-6 md:grid-cols-4">

    <CardItem
      label="Saldo Simpanan"
      value={`Rp ${saldoSimpanan.toLocaleString(
        "id-ID"
      )}`}
      color="green"
    />

    <CardItem
      label="Sisa Tagihan"
      value={`Rp ${sisaTagihan.toLocaleString(
        "id-ID"
      )}`}
      color="orange"
    />

    <CardItem
      label="Progress"
      value={`${progressWajib}%`}
      color="blue"
    />

    <CardItem
      label="Status"
      value={statusSimpanan}
      color={
        statusSimpanan ===
        "BERHASIL"
          ? "green"
          : "purple"
      }
    />

  </div>
) : (
        <div className="grid gap-4 p-6 md:grid-cols-4">

          <CardItem
            label="Target Dana"
            value={`Rp ${totalTarget.toLocaleString(
              "id-ID"
            )}`}
            color="green"
          />

          <CardItem
            label="Total Terkumpul"
            value={`Rp ${totalTerkumpul.toLocaleString(
              "id-ID"
            )}`}
            color="blue"
          />

          <CardItem
            label="Progress"
            value={`${progress}%`}
            color="orange"
          />

          <CardItem
            label="Jumlah Pembayaran"
            value={`${totalPembayaran}`}
            color="purple"
          />

        </div>
      )}
    </div>
  );
}

function CardItem({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color:
    | "green"
    | "blue"
    | "orange"
    | "purple";
}) {
  const colors = {
    green:
      "border-green-100 bg-green-50 text-green-700",
    blue:
      "border-blue-100 bg-blue-50 text-blue-700",
    orange:
      "border-orange-100 bg-orange-50 text-orange-700",
    purple:
      "border-purple-100 bg-purple-50 text-purple-700",
  };

  return (
    <div
      className={`rounded-2xl border p-4 ${colors[color]}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide">
        {label}
      </p>

      <h3 className="mt-2 text-xl font-bold">
        {value}
      </h3>
    </div>
  );
}