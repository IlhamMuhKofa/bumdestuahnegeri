"use client";

import {useState,} from "react";
import {useRouter,} from "next/navigation";
import {createJadwalSurvey,} from "./action";
import { toast } from "react-toastify";

type Props = {
  peminjaman: any;
  survey: any;
};

export default function ClientPage({
  peminjaman,
  survey,
}: Props) {

  const router =
    useRouter();

  const anggota =
    peminjaman?.anggota;

  // AUTO FILL
  const [
    tanggalSurvey,
    setTanggalSurvey,
  ] = useState(
    survey?.tanggal_survey
      ? new Date(
          survey.tanggal_survey
        )
          .toISOString()
          .slice(0, 16)
      : ""
  );

  // 🔥 AUTO AMBIL ALAMAT PROFILE
  const [
    lokasi,
    setLokasi,
  ] = useState(
    survey?.lokasi ||
      anggota?.alamat ||
      ""
  );

  const [
    catatan,
    setCatatan,
  ] = useState(
    survey?.catatan || ""
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const formatRupiah = (
    value?: number
  ) =>
    "Rp " +
    (
      value || 0
    ).toLocaleString(
      "id-ID"
    );

  const handleSubmit =
    async () => {

      try {

        if (
          !tanggalSurvey
        ) {

          toast.error(
            "Tanggal survey wajib diisi"
          );

          return;
        }

        setLoading(
          true
        );

        await createJadwalSurvey({
          idPeminjaman:
            peminjaman.id_peminjaman,

          tanggalSurvey,

          lokasi,

          catatan,
        });

        toast.success(
          survey
            ? "Jadwal survey berhasil diperbarui"
            : "Jadwal survey berhasil dibuat"
        );

        router.push(
          `/admin/survey/konten/${peminjaman.id_anggota}`
        );

      } catch (
        error
      ) {

        console.error(
          error
        );

        alert(
          "Gagal menyimpan jadwal survey"
        );

      } finally {

        setLoading(
          false
        );

      }
    };

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-10">

      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">

          <h1 className="text-3xl font-bold text-gray-800">
            {survey
              ? "Detail Jadwal Survey"
              : "Buat Jadwal Survey"}
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Atur jadwal survey lapangan untuk nasabah
          </p>

        </div>

        {/* CARD */}
        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

          {/* TOP */}
          <div className="p-6 border-b bg-orange-50">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              {/* LEFT */}
              <div>

                <p className="text-xs uppercase tracking-wide text-orange-500 font-semibold">
                  Data Nasabah
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-800">
                  {
                    anggota?.nama
                  }
                </h2>

                <div className="mt-4 space-y-2">

                  <div className="flex items-center gap-2 text-sm text-gray-600">

                    <span className="font-medium text-gray-500">
                      No. HP:
                    </span>

                    <span>
                      {
                        anggota?.no_hp ||
                        "-"
                      }
                    </span>

                  </div>

                  <div className="flex items-start gap-2 text-sm text-gray-600">

                    <span className="font-medium text-gray-500 min-w-[60px]">
                      Alamat:
                    </span>

                    <span className="leading-relaxed">
                      {
                        anggota?.alamat ||
                        "-"
                      }
                    </span>

                  </div>

                </div>

              </div>

              {/* RIGHT */}
              <div className="bg-white border rounded-2xl px-5 py-4 min-w-[220px]">

                <p className="text-xs text-gray-400">
                  Total Pinjaman
                </p>

                <p className="mt-2 text-2xl font-bold text-orange-600">
                  {formatRupiah(
                    peminjaman.total_pinjaman
                  )}
                </p>

                <div className="mt-4 pt-4 border-t">

                  <p className="text-xs text-gray-400">
                    ID Pinjaman
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-700">
                    #
                    {
                      peminjaman.id_peminjaman
                    }
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* FORM */}
          <div className="p-6 space-y-6">

            {/* TANGGAL */}
            <div>

              <label className="text-sm font-medium text-gray-700">
                Tanggal Survey
              </label>

              <input
                type="datetime-local"
                value={
                  tanggalSurvey
                }
                onChange={(
                  e
                ) =>
                  setTanggalSurvey(
                    e.target.value
                  )
                }
                className="
                  w-full
                  mt-2
                  border
                  rounded-2xl
                  px-4
                  py-3
                  text-sm
                  outline-none
                  focus:ring-2
                  focus:ring-orange-500
                "
              />

            </div>

            {/* LOKASI */}
            <div>

              <div className="flex items-center justify-between">

                <label className="text-sm font-medium text-gray-700">
                  Lokasi Survey
                </label>

                <span className="text-[11px] text-gray-400">
                  otomatis dari profile nasabah
                </span>

              </div>

              <textarea
                value={
                  lokasi
                }
                onChange={(
                  e
                ) =>
                  setLokasi(
                    e.target.value
                  )
                }
                className="
                  w-full
                  mt-2
                  border
                  rounded-2xl
                  px-4
                  py-4
                  text-sm
                  min-h-[120px]
                  outline-none
                  focus:ring-2
                  focus:ring-orange-500
                "
              />

            </div>

            {/* CATATAN */}
            <div>

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
                placeholder="Tambahkan catatan survey..."
                className="
                  w-full
                  mt-2
                  border
                  rounded-2xl
                  p-4
                  text-sm
                  min-h-[140px]
                  outline-none
                  focus:ring-2
                  focus:ring-orange-500
                "
              />

            </div>

            {/* BUTTON */}
            <div className="flex flex-col md:flex-row gap-3 pt-2">

              <button
                onClick={() =>
                  router.back()
                }
                className="
                  flex-1
                  border
                  rounded-2xl
                  py-3
                  text-sm
                  hover:bg-gray-50
                  transition
                "
              >
                Kembali
              </button>

              <button
                onClick={
                  handleSubmit
                }
                disabled={
                  loading
                }
                className="
                  flex-1
                  bg-orange-500
                  hover:bg-orange-600
                  disabled:bg-gray-300
                  text-white
                  rounded-2xl
                  py-3
                  text-sm
                  font-medium
                  transition
                "
              >
                {loading
                  ? "Menyimpan..."
                  : survey
                  ? "Update Jadwal Survey"
                  : "Simpan Jadwal Survey"}
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}