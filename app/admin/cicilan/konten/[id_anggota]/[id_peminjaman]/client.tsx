"use client";

import React, {
  useState,
  useEffect,
} from "react";

import {
  LayoutList,
  Settings2,
  Inbox,
  ArrowLeft,
} from "lucide-react";

import {
  createJadwalAngsuran,
} from "./action";

import {
  useRouter,
} from "next/navigation";

import {
  toast,
} from "react-toastify";

import CardCicilan from "./CardCicilan";

import FormPengaturan from "./FormPengaturan";


export default function Client({
  data,
}: any) {
  const router = useRouter();

  const total =
    data?.total_pinjaman || 0;

  const tenor =
    data?.jangka_waktu || 0;

  const hasJadwal =
    data?.jadwal?.length > 0;


  const [tab, setTab] =
    useState<
      "monitoring" | "pengaturan"
    >(
      hasJadwal
        ? "monitoring"
        : "pengaturan"
    );


  const [jatuhTempo, setJatuhTempo] =
    useState("");

  const [denda, setDenda] =
    useState(0);

  const [catatan, setCatatan] =
    useState("");

  const [cicilan, setCicilan] =
    useState<number | null>(null);


  const tanggalPengajuan =
    new Date(
      data?.tanggal_pengajuan
    ).toLocaleDateString(
      "id-ID"
    );


  useEffect(() => {
    if (!total || !tenor) return;

    fetch(
      `/api/simulasi?jumlah=${total}&tenor=${tenor}`
    )
      .then((res) =>
        res.json()
      )
      .then((res) => {
        if (res.success) {
          setCicilan(
            res.data
              .cicilan_per_bulan
          );
        }
      });
  }, [total, tenor]);


  const handleSubmit =
    async () => {

      if (!jatuhTempo) {
        toast.error(
          "Tanggal jatuh tempo wajib diisi"
        );

        return;
      }

      if (!cicilan) {
        toast.error(
          "Cicilan belum tersedia"
        );

        return;
      }

      try {

        await createJadwalAngsuran({
          idPeminjaman:
            data.id_peminjaman,

          tanggalMulai:
            jatuhTempo,

          cicilanPerBulan:
            cicilan,

          tenor,

          denda,

          catatan,
        });


        toast.success(
          "Jadwal berhasil dibuat"
        );

        router.refresh();

        setTab(
          "monitoring"
        );

      } catch {

        toast.error(
          "Gagal membuat jadwal"
        );

      }
    };


  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* =====================================================
          KEMBALI
      ===================================================== */}

      <div className="mx-auto mb-4 max-w-6xl">

        <button
          type="button"
          onClick={() =>
            router.back()
          }
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-gray-500
            transition-colors
            hover:text-blue-800
          "
        >

          <ArrowLeft className="h-4 w-4" />

          Kembali

        </button>

      </div>


      {/* =====================================================
          TAB
      ===================================================== */}

      <div className="mx-auto mb-6 max-w-6xl">

        <div
          className="
            inline-flex
            gap-1
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-1
            shadow-sm
          "
        >

          {/* LIST JADWAL */}

          <button
            type="button"
            onClick={() =>
              setTab("monitoring")
            }
            className={`
              flex
              items-center
              gap-2
              rounded-xl
              px-5
              py-2
              text-sm
              font-semibold
              transition-colors
              ${
                tab === "monitoring"
                  ? "bg-blue-800 text-white"
                  : "text-gray-500 hover:bg-gray-50"
              }
            `}
          >

            <LayoutList className="h-4 w-4" />

            List Jadwal

          </button>


          {/* FORM JADWAL */}

          <button
            type="button"
            onClick={() =>
              setTab("pengaturan")
            }
            className={`
              flex
              items-center
              gap-2
              rounded-xl
              px-5
              py-2
              text-sm
              font-semibold
              transition-colors
              ${
                tab === "pengaturan"
                  ? "bg-blue-800 text-white"
                  : "text-gray-500 hover:bg-gray-50"
              }
            `}
          >

            <Settings2 className="h-4 w-4" />

            Form Jadwal

          </button>

        </div>

      </div>


      {/* =====================================================
          MONITORING / LIST JADWAL
      ===================================================== */}

      {tab === "monitoring" && (

        <div className="mx-auto max-w-6xl">

          {hasJadwal ? (

            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                bg-white
                shadow-sm
              "
            >

              {/* RESPONSIVE TABLE */}

              <div className="overflow-x-auto">

                <table
                  className="
                    w-full
                    min-w-[950px]
                    text-left
                  "
                >

                  {/* =================================================
                      TABLE HEADER
                  ================================================= */}

                  <thead>

                    <tr className="bg-blue-800">

                      <th
                        className="
                          px-5
                          py-3.5
                          text-sm
                          font-semibold
                          text-white
                        "
                      >
                        Cicilan
                      </th>


                      <th
                        className="
                          px-5
                          py-3.5
                          text-sm
                          font-semibold
                          text-white
                        "
                      >
                        Jatuh Tempo
                      </th>


                      <th
                        className="
                          px-5
                          py-3.5
                          text-sm
                          font-semibold
                          text-white
                        "
                      >
                        Jumlah Tagihan
                      </th>


                      <th
                        className="
                          px-5
                          py-3.5
                          text-sm
                          font-semibold
                          text-white
                        "
                      >
                        Status
                      </th>


                      <th
                        className="
                          px-5
                          py-3.5
                          text-sm
                          font-semibold
                          text-white
                        "
                      >
                        Keterangan
                      </th>

                    </tr>

                  </thead>


                  {/* =================================================
                      TABLE BODY
                  ================================================= */}

                  <tbody>

                    {data?.jadwal?.map(
                      (item: any) => (

                        <CardCicilan
                          key={
                            item.id_jadwal
                          }
                          item={item}
                        />

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          ) : (

            /* =================================================
                EMPTY STATE
            ================================================= */

            <div
              className="
                flex
                flex-col
                items-center
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-10
                text-center
                shadow-sm
              "
            >

              <div
                className="
                  mb-3
                  rounded-xl
                  bg-blue-50
                  p-3
                "
              >

                <Inbox
                  className="
                    h-6
                    w-6
                    text-blue-800
                  "
                />

              </div>


              <p
                className="
                  font-semibold
                  text-gray-800
                "
              >
                Belum ada jadwal angsuran
              </p>


              <p
                className="
                  mt-1
                  text-sm
                  text-gray-500
                "
              >
                Atur jadwal terlebih dahulu
                di tab Pengaturan
              </p>

            </div>

          )}

        </div>

      )}


      {/* =====================================================
          FORM PENGATURAN
      ===================================================== */}

      {tab === "pengaturan" && (

        <FormPengaturan
          data={data}
          total={total}
          tenor={tenor}
          cicilan={cicilan}
          tanggalPengajuan={
            tanggalPengajuan
          }
          jatuhTempo={
            jatuhTempo
          }
          setJatuhTempo={
            setJatuhTempo
          }
          denda={denda}
          setDenda={setDenda}
          catatan={catatan}
          setCatatan={setCatatan}
          hasJadwal={
            hasJadwal
          }
          onSubmit={
            handleSubmit
          }
        />

      )}

    </div>
  );
}