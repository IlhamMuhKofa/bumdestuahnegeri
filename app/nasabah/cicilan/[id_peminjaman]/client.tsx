"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { submitCashPayment } from "../action";

type Props = {
  data?: any[];
};

export default function ClientPage({
  data = [],
}: Props) {
  const router = useRouter();

  const [loadingId, setLoadingId] =
    useState<number | null>(null);

  // =========================
  // FORMAT RUPIAH
  // =========================
  const formatRupiah = (
    value?: number
  ) =>
    "Rp " +
    (value || 0).toLocaleString("id-ID");

  // =========================
  // STATUS
  // =========================
  const getStatus = (item: any) => {
    // Sudah lunas
    if (item?.status === "LUNAS") {
      return "LUNAS";
    }

    // User sudah mengajukan pembayaran
    const payment = item?.pembayaran?.[0];

    if (
      payment &&
      payment.status === "MENUNGGU"
    ) {
      return "MENUNGGU";
    }

    const today = new Date();

    const due = new Date(
      item?.jatuh_tempo
    );

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    if (due < today) {
      return "TELAT";
    }

    return "PENDING";
  };

  // =========================
  // SORT DATA
  // =========================
  const sorted = useMemo(
    () =>
      Array.isArray(data)
        ? [...data].sort(
            (a, b) =>
              new Date(
                a.jatuh_tempo
              ).getTime() -
              new Date(
                b.jatuh_tempo
              ).getTime()
          )
        : [],
    [data]
  );

  // =========================
  // STATUS DATA
  // =========================
  const processedData = useMemo(() => {
    return sorted.map((item) => ({
      ...item,
      currentStatus: getStatus(item),
    }));
  }, [sorted]);

  // =========================
  // TAGIHAN SAAT INI
  // =========================
  const currentBill = useMemo(() => {
    return processedData.find(
      (item) =>
        item.currentStatus ===
          "TELAT" ||
        item.currentStatus ===
          "MENUNGGU" ||
        item.currentStatus ===
          "PENDING"
    );
  }, [processedData]);

  // =========================
  // RIWAYAT LUNAS
  // =========================
  const history = useMemo(() => {
    return processedData.filter(
      (item) =>
        item.currentStatus === "LUNAS"
    );
  }, [processedData]);

  // =========================
  // BAYAR DI KANTOR
  // =========================
  const handleCashPayment = async (
    idJadwal: number
  ) => {
    try {
      setLoadingId(idJadwal);

      await submitCashPayment(idJadwal);

      alert(
        "Permintaan pembayaran berhasil dikirim"
      );
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  // =========================
  // FORMAT TANGGAL
  // =========================
  const formatTanggal = (
    tanggal: string | Date
  ) => {
    return new Date(
      tanggal
    ).toLocaleDateString(
      "id-ID",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-10">
      {/* =========================
          TAGIHAN SAAT INI
      ========================= */}
      <section className="mb-8">

        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            Tagihan Saat Ini
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Tagihan yang perlu Anda perhatikan saat ini.
          </p>
        </div>

        {currentBill ? (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">

                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">

                    <th className="px-5 py-4 font-semibold">
                      Cicilan
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Jatuh Tempo
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Nominal
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right font-semibold">
                      Aksi
                    </th>

                  </tr>
                </thead>

                <tbody>
                  <tr className="border-b border-gray-100 last:border-0">

                    {/* CICILAN */}
                    <td className="px-5 py-5">
                      <p className="font-semibold text-gray-800">
                        Cicilan ke-
                        {currentBill.cicilan_ke}
                      </p>
                    </td>

                    {/* JATUH TEMPO */}
                    <td className="px-5 py-5 text-gray-600">
                      {formatTanggal(
                        currentBill.jatuh_tempo
                      )}
                    </td>

                    {/* NOMINAL */}
                    <td className="px-5 py-5">
                      <p className="font-bold text-gray-800">
                        {formatRupiah(
                          currentBill.jumlah_tagihan
                        )}
                      </p>
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-5">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          currentBill.currentStatus ===
                          "TELAT"
                            ? "bg-red-100 text-red-700"
                            : currentBill.currentStatus ===
                              "MENUNGGU"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {
                          currentBill.currentStatus
                        }
                      </span>

                    </td>

                    {/* AKSI */}
                    <td className="px-5 py-5">

                      {(
                        currentBill.currentStatus ===
                          "PENDING" ||
                        currentBill.currentStatus ===
                          "TELAT"
                      ) && (
                        <div className="flex justify-end gap-2">

                          {/* TRANSFER */}
                          <button
                            onClick={() =>
                              router.push(
                                `/nasabah/pembayaran/${currentBill.id_jadwal}`
                              )
                            }
                            className="rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
                          >
                            Bayar Transfer
                          </button>

                          {/* KANTOR */}
                          <button
                            onClick={() =>
                              handleCashPayment(
                                currentBill.id_jadwal
                              )
                            }
                            disabled={
                              loadingId ===
                              currentBill.id_jadwal
                            }
                            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {loadingId ===
                            currentBill.id_jadwal
                              ? "Memproses..."
                              : "Bayar di Kantor"}
                          </button>

                        </div>
                      )}

                      {currentBill.currentStatus ===
                        "MENUNGGU" && (
                        <div className="flex justify-end">
                          <span className="rounded-lg bg-yellow-50 px-4 py-2 text-xs font-semibold text-yellow-700">
                            Menunggu Verifikasi
                          </span>
                        </div>
                      )}

                    </td>

                  </tr>
                </tbody>

              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
            <p className="text-sm text-gray-500">
              Tidak ada tagihan yang perlu dibayar saat ini.
            </p>
          </div>
        )}

      </section>

      {/* =========================
          RIWAYAT PEMBAYARAN
      ========================= */}
      <section>

        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            Riwayat Pembayaran
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Daftar cicilan yang telah diselesaikan.
          </p>
        </div>

        {history.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-sm">

                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">

                    <th className="px-5 py-4 font-semibold">
                      Cicilan
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Jatuh Tempo
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Nominal
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {history.map(
                    (item) => (
                      <tr
                        key={
                          item.id_jadwal
                        }
                        className="border-b border-gray-100 last:border-0"
                      >

                        <td className="px-5 py-4 font-semibold text-gray-800">
                          Cicilan ke-
                          {
                            item.cicilan_ke
                          }
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {formatTanggal(
                            item.jatuh_tempo
                          )}
                        </td>

                        <td className="px-5 py-4 font-semibold text-gray-800">
                          {formatRupiah(
                            item.jumlah_tagihan
                          )}
                        </td>

                        <td className="px-5 py-4">

                          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            LUNAS ✓
                          </span>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>
            </div>

          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
            <p className="text-sm text-gray-500">
              Belum ada riwayat pembayaran.
            </p>
          </div>
        )}

      </section>

    </div>
  );
}