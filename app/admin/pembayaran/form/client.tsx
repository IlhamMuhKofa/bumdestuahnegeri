"use client";

import {useMemo,useState,} from "react";

import {createManualPayment,} from "../../cicilan/konten/[id_anggota]/[id_peminjaman]/action";

type Props = {
  data?: any[];
};

export default function ClientPage({
  data = [],
}: Props) {

  const [
    selectedId,
    setSelectedId,
  ] = useState("");

  const [
    catatan,
    setCatatan,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    bukti,
    setBukti,
  ] = useState<File | null>(null);

  const selectedJadwal =
    useMemo(
      () =>
        data.find(
          (item) =>
            item.id_jadwal ===
            Number(
              selectedId
            )
        ),
      [data, selectedId]
    );

  const formatRupiah = (
    value?: number
  ) =>
    "Rp " +
    (
      value || 0
    ).toLocaleString(
      "id-ID"
    );

  // ================= SUBMIT =================
  const handleSubmit =
    async () => {

      try {

        if (
          !selectedId
        ) {

          alert(
            "Pilih cicilan terlebih dahulu"
          );

          return;
        }

        if (!bukti) {
          alert("Upload bukti pembayaran cash terlebih dahulu");
          return;
        }

        setLoading(
          true
        );

        const formData = new FormData();
        formData.append("file", bukti);

        const upload = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadResult = await upload.json();

        if (!upload.ok) {
          throw new Error(uploadResult.error || "Upload bukti gagal");
        }

        await createManualPayment({
          idJadwal:
            Number(
              selectedId
            ),

          catatan,
          buktiBayar: uploadResult.url,
        });

        alert(
          "Pembayaran berhasil disimpan"
        );

        window.location.href =
          "/admin/pembayaran";

      } catch (error: any) {

        console.error(
          error
        );

        alert(
          error.message ||
          "Gagal menyimpan pembayaran"
        );

      } finally {

        setLoading(
          false
        );
      }
    };

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-10">

      {/* HEADER */}
      <div className="mb-6">

        <h1 className="text-2xl font-bold text-gray-800">
          Input Pembayaran
          Manual
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Catat pembayaran
          nasabah yang
          datang langsung
          ke kantor
        </p>

      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl border shadow-sm p-6 max-w-3xl">

        {/* PILIH CICILAN */}
        <div>

          <label className="text-sm font-medium text-gray-700">
            Pilih Cicilan
          </label>

          <select
            value={
              selectedId
            }
            onChange={(
              e
            ) =>
              setSelectedId(
                e.target.value
              )
            }
            className="w-full mt-2 border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500"
          >

            <option value="">
              -- Pilih
              Cicilan --
            </option>

            {data.map(
              (item) => {

                const anggota =
                  item
                    ?.peminjaman
                    ?.anggota;

                return (
                  <option
                    key={
                      item.id_jadwal
                    }
                    value={
                      item.id_jadwal
                    }
                  >

                    {
                      anggota?.nama
                    }{" "}
                    -
                    Cicilan
                    ke-
                    {
                      item.cicilan_ke
                    }{" "}
                    (
                    {formatRupiah(
                      item.jumlah_tagihan
                    )}
                    )

                  </option>
                );
              }
            )}

          </select>

        </div>

        {/* DETAIL */}
        {selectedJadwal && (

          <div className="mt-6 bg-gray-50 border rounded-2xl p-5 space-y-3">

            <div className="flex justify-between text-sm">

              <span className="text-gray-500">
                Nama
              </span>

              <span className="font-medium text-gray-800">

                {
                  selectedJadwal
                    ?.peminjaman
                    ?.anggota
                    ?.nama
                }

              </span>

            </div>

            <div className="flex justify-between text-sm">

              <span className="text-gray-500">
                Cicilan
              </span>

              <span className="font-medium text-gray-800">

                Ke-
                {
                  selectedJadwal.cicilan_ke
                }

              </span>

            </div>

            <div className="flex justify-between text-sm">

              <span className="text-gray-500">
                Jatuh Tempo
              </span>

              <span className="font-medium text-gray-800">

                {new Date(
                  selectedJadwal.jatuh_tempo
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

              </span>

            </div>

            <div className="flex justify-between text-sm">

              <span className="text-gray-500">
                Nominal
              </span>

              <span className="font-bold text-green-700 text-lg">

                {formatRupiah(
                  selectedJadwal.jumlah_tagihan
                )}

              </span>

            </div>

          </div>
        )}

        {/* CATATAN */}
        <div className="mt-6">

          <label className="text-sm font-medium text-gray-700">
            Catatan
          </label>

          <textarea
            value={
              catatan
            }
            onChange={(
              e
            ) =>
              setCatatan(
                e.target.value
              )
            }
            placeholder="Contoh: dibayar langsung di kantor..."
            className="w-full mt-2 border rounded-xl p-4 text-sm min-h-[120px] outline-none focus:ring-2 focus:ring-green-500"
          />

        </div>

        <div className="mt-6">

          <label className="text-sm font-medium text-gray-700">
            Bukti Pembayaran Cash
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setBukti(e.target.files?.[0] ?? null)
            }
            className="mt-2 block w-full rounded-xl border p-3 text-sm"
          />

          {bukti && (
            <p className="mt-2 text-xs text-green-700">
              {bukti.name}
            </p>
          )}

        </div>

        {/* BUTTON */}
        <div className="mt-6">

          <button
            onClick={
              handleSubmit
            }
            disabled={
              loading
            }
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-xl py-3 text-sm font-medium transition"
          >
            {loading
              ? "Menyimpan..."
              : "Simpan Pembayaran"}
          </button>

        </div>

      </div>

    </div>
  );
}
