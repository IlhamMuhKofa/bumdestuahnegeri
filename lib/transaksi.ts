import { Prisma, PrismaClient } from "@prisma/client";

type Db = PrismaClient | Prisma.TransactionClient;

type KategoriTransaksi = "PINJAMAN" | "SIMPANAN";
type MetodeBayar = "TRANSFER" | "CASH" | string;

type CatatTransaksiInput = {
  idAnggota: number;
  kategori: KategoriTransaksi;
  nominal: number;
  metodeBayar: MetodeBayar;
  nomor: number;
  buktiBayar?: string | null;
  refTabel?: string;
  refId?: number;
  tanggal?: Date;
};

export function jenisTransaksi(kategori: KategoriTransaksi) {
  return kategori === "PINJAMAN"
    ? "PEMBAYARAN PINJAMAN"
    : "PEMBAYARAN SIMPANAN";
}

export function keteranganTransaksi(
  kategori: KategoriTransaksi,
  metodeBayar: MetodeBayar,
  nomor: number
) {
  const metode =
    metodeBayar?.toUpperCase() === "CASH" ? "Cash" : "Transfer";
  const objek = kategori === "PINJAMAN" ? "cicilan" : "setoran";

  return `Pembayaran ${metode} ${objek} ke-${nomor}`;
}

export async function catatRiwayatTransaksi(
  db: Db,
  input: CatatTransaksiInput
) {
  return db.riwayatTransaksi.create({
    data: {
      id_anggota: input.idAnggota,
      jenis_transaksi: jenisTransaksi(input.kategori),
      nominal: input.nominal,
      tanggal: input.tanggal,
      keterangan: keteranganTransaksi(
        input.kategori,
        input.metodeBayar,
        input.nomor
      ),
      kategori: input.kategori,
      metode_bayar: input.metodeBayar?.toUpperCase(),
      bukti_bayar: input.buktiBayar || null,
      ref_tabel: input.refTabel,
      ref_id: input.refId,
    },
  });
}
