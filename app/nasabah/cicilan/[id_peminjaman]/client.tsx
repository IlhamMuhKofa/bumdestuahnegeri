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

  const router =
    useRouter();

  const [
    loadingId,
    setLoadingId,
  ] = useState<
    number | null
  >(null);

  const formatRupiah = (
    value?: number
  ) =>
    "Rp " +
    (
      value || 0
    ).toLocaleString(
      "id-ID"
    );

  const getStatus = (
    item: any
  ) => {

    // admin approve
    if (
      item?.status ===
      "LUNAS"
    ) {
      return "LUNAS";
    }

    const payment =
      item?.pembayaran?.[0];

    // user sudah submit pembayaran
    if (
      payment &&
      payment.status ===
        "MENUNGGU"
    ) {
      return "MENUNGGU";
    }

    const today =
      new Date();

    const due =
      new Date(
        item?.jatuh_tempo
      );

    today.setHours(
      0,
      0,
      0,
      0
    );

    due.setHours(
      0,
      0,
      0,
      0
    );

    if (
      due < today
    ) {
      return "TELAT";
    }

    return "PENDING";
  };

  const sorted =
    useMemo(
      () =>
        Array.isArray(
          data
        )
          ? [...data].sort(
              (
                a,
                b
              ) =>
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

  const handleCashPayment =
    async (
      idJadwal: number
    ) => {
      try {

        setLoadingId(
          idJadwal
        );

        await submitCashPayment(
          idJadwal
        );

        alert(
          "Permintaan pembayaran berhasil dikirim"
        );

      } catch (
        err: any
      ) {

        alert(
          err.message
        );

      } finally {

        setLoadingId(
          null
        );

      }
    };

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-10">

      {/* HEADER */}
      <div className="mb-6">

        <h1 className="text-2xl font-bold text-gray-800">
          Tagihan Cicilan
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Pantau dan bayar
          cicilan anda
        </p>

      </div>

      {/* CARD */}
      <div className="grid md:grid-cols-2 gap-5">

        {sorted.map(
          (item) => {

            const status =
              getStatus(
                item
              );

            return (
              <div
                key={
                  item.id_jadwal
                }
                className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-lg transition"
              >

                {/* TOP */}
                <div className="flex justify-between items-start">

                  <div>

                    <p className="text-lg font-bold text-gray-800">
                      Cicilan ke-
                      {
                        item.cicilan_ke
                      }
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(
                        item.jatuh_tempo
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
                      "LUNAS"
                        ? "bg-green-100 text-green-700"
                        : status ===
                          "MENUNGGU"
                        ? "bg-yellow-100 text-yellow-700"
                        : status ===
                          "TELAT"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {
                      status
                    }
                  </span>

                </div>

                {/* NOMINAL */}
                <div className="mt-5">

                  <p className="text-xs text-gray-400">
                    Tagihan
                  </p>

                  <p className="text-xl font-bold text-gray-800 mt-1">
                    {formatRupiah(
                      item.jumlah_tagihan
                    )}
                  </p>

                </div>

                {/* ACTION */}
                <div className="mt-5 flex gap-3">

                  {(status ===
                    "PENDING" ||
                    status ===
                      "TELAT") && (
                    <>

                      {/* TRANSFER */}
                      <button
                        onClick={() =>
                          router.push(
                            `/nasabah/pembayaran/${item.id_jadwal}`
                          )
                        }
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-xl py-3"
                      >
                        Bayar
                        Transfer
                      </button>

                      {/* CASH */}
                      <button
                        onClick={() =>
                          handleCashPayment(
                            item.id_jadwal
                          )
                        }
                        disabled={
                          loadingId ===
                          item.id_jadwal
                        }
                        className="flex-1 border text-sm rounded-xl py-3 disabled:opacity-50"
                      >
                        {loadingId ===
                        item.id_jadwal
                          ? "Memproses..."
                          : "Bayar di Kantor"}
                      </button>

                    </>
                  )}

                  {status ===
                  "MENUNGGU" ? (
                    <button
                      disabled
                      className="w-full bg-yellow-100 text-yellow-700 text-sm rounded-xl py-3"
                    >
                      Menunggu
                      Verifikasi
                    </button>
                  ) : null}

                  {status ===
                  "LUNAS" ? (
                    <button
                      disabled
                      className="w-full bg-green-100 text-green-700 text-sm rounded-xl py-3"
                    >
                      Lunas ✓
                    </button>
                  ) : null}

                </div>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}