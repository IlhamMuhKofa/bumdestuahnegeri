"use client";

import React, {
  useMemo,
  useState,
  useEffect,
} from "react";

import { CalendarDays } from "lucide-react";

import { createJadwalAngsuran } from "./action";

import { useRouter } from "next/navigation";

import { toast } from "react-toastify";

// ================= CALENDAR =================
function buildMonthMatrix(
  year: number,
  monthIndex: number
) {
  const first = new Date(
    year,
    monthIndex,
    1
  );

  const startDay =
    first.getDay();

  const mondayFirstStart =
    (startDay + 6) % 7;

  const cells: Array<{
    date: Date;
    inMonth: boolean;
  }> = [];

  const startDate =
    new Date(
      year,
      monthIndex,
      1 - mondayFirstStart
    );

  for (let i = 0; i < 35; i++) {
    const d = new Date(
      startDate
    );

    d.setDate(
      startDate.getDate() + i
    );

    cells.push({
      date: d,
      inMonth:
        d.getMonth() ===
        monthIndex,
    });
  }

  return cells;
}

function FriendlyCalendar() {
  const [cursor, setCursor] =
    useState(new Date());

  const year =
    cursor.getFullYear();

  const monthIndex =
    cursor.getMonth();

  const monthLabel =
    cursor.toLocaleDateString(
      "id-ID",
      {
        month: "long",
        year: "numeric",
      }
    );

  const cells = useMemo(
    () =>
      buildMonthMatrix(
        year,
        monthIndex
      ),
    [year, monthIndex]
  );

  const today =
    new Date();

  return (
    <div className="rounded-2xl border bg-gray-100 p-5 shadow-sm">

      <div className="flex justify-between items-center mb-3">

        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-indigo-600" />

          <span className="font-bold">
            {monthLabel}
          </span>
        </div>

        <div className="flex gap-2">

          <button
            onClick={() =>
              setCursor(
                new Date(
                  year,
                  monthIndex - 1,
                  1
                )
              )
            }
          >
            ‹
          </button>

          <button
            onClick={() =>
              setCursor(
                new Date()
              )
            }
          >
            Today
          </button>

          <button
            onClick={() =>
              setCursor(
                new Date(
                  year,
                  monthIndex + 1,
                  1
                )
              )
            }
          >
            ›
          </button>

        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-xs text-center">

        {[
          "Sen",
          "Sel",
          "Rab",
          "Kam",
          "Jum",
          "Sab",
          "Min",
        ].map((d) => (
          <div key={d}>
            {d}
          </div>
        ))}

      </div>

      <div className="grid grid-cols-7 gap-2 mt-2">

        {cells.map(
          (
            {
              date,
              inMonth,
            },
            i
          ) => {
            const isToday =
              date.toDateString() ===
              today.toDateString();

            return (
              <div
                key={i}
                className={`h-10 flex items-center justify-center rounded-lg text-sm
                ${!inMonth && "text-gray-300"}
                ${isToday && "bg-indigo-600 text-white"}
              `}
              >
                {date.getDate()}
              </div>
            );
          }
        )}

      </div>
    </div>
  );
}

// ================= INPUT =================
function Input({
  label,
  value,
}: any) {
  return (
    <div>

      <label className="text-sm text-gray-500">
        {label}
      </label>

      <input
        value={value || "-"}
        readOnly
        className="w-full px-4 py-2 border rounded-lg bg-gray-100"
      />

    </div>
  );
}

function InputDate({
  label,
  value,
  setValue,
}: any) {
  return (
    <div>

      <label className="text-sm text-gray-500">
        {label}
      </label>

      <input
        type="date"
        value={value}
        onChange={(e) =>
          setValue(
            e.target.value
          )
        }
        className="w-full px-4 py-2 border rounded-lg"
      />

    </div>
  );
}

function InputRupiah({
  label,
  value,
  setValue,
}: any) {
  const formatRupiah = (
    angka: number
  ) =>
    angka.toLocaleString(
      "id-ID"
    );

  const handleChange = (
    e: any
  ) => {
    const raw =
      e.target.value.replace(
        /\D/g,
        ""
      );

    setValue(
      Number(raw)
    );
  };

  return (
    <div>

      <label className="text-sm text-gray-500">
        {label}
      </label>

      <div className="flex items-center border rounded-lg px-3">

        <span className="mr-2">
          Rp
        </span>

        <input
          type="text"
          value={
            value
              ? formatRupiah(
                  value
                )
              : ""
          }
          onChange={
            handleChange
          }
          className="w-full py-2 outline-none"
        />

      </div>
    </div>
  );
}

// ================= MAIN =================
export default function Client({
  data,
}: any) {

  const router =
    useRouter();

  const total =
    data?.total_pinjaman || 0;

  const tenor =
    data?.jangka_waktu || 0;

  const hasJadwal =
    data?.jadwal
      ?.length > 0;

  const [tab, setTab] =
    useState<
      | "monitoring"
      | "pengaturan"
    >(
      hasJadwal
        ? "monitoring"
        : "pengaturan"
    );

  const [
    jatuhTempo,
    setJatuhTempo,
  ] = useState("");

  const [denda,
    setDenda] =
    useState(0);

  const [
    catatan,
    setCatatan,
  ] = useState("");

  const [cicilan,
    setCicilan] =
    useState<
      number | null
    >(null);

  const tanggalPengajuan =
    new Date(
      data?.tanggal_pengajuan
    ).toLocaleDateString(
      "id-ID"
    );

  useEffect(() => {
    if (
      !total ||
      !tenor
    )
      return;

    fetch(
      `/api/simulasi?jumlah=${total}&tenor=${tenor}`
    )
      .then((res) =>
        res.json()
      )
      .then((res) => {
        if (
          res.success
        ) {
          setCicilan(
            res.data
              .cicilan_per_bulan
          );
        }
      });
  }, [total, tenor]);

  const handleSubmit =
    async () => {
      if (
        !jatuhTempo
      ) {
        toast.error(
          "Tanggal jatuh tempo wajib diisi"
        );

        return;
      }

      if (
        !cicilan
      ) {
        toast.error(
          "Cicilan belum tersedia"
        );

        return;
      }

      try {
        await createJadwalAngsuran(
          {
            idPeminjaman:
              data.id_peminjaman,

            tanggalMulai:
              jatuhTempo,

            cicilanPerBulan:
              cicilan,

            tenor,

            denda,

            catatan,
          }
        );

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

      {/* TAB */}
      <div className="max-w-6xl mx-auto flex gap-3 mb-6">

        <button
          onClick={() =>
            setTab(
              "monitoring"
            )
          }
          className={`px-5 py-2 rounded-xl ${
            tab ===
            "monitoring"
              ? "bg-green-600 text-white"
              : "bg-white border"
          }`}
        >
          Monitoring
        </button>

        <button
          onClick={() =>
            setTab(
              "pengaturan"
            )
          }
          className={`px-5 py-2 rounded-xl ${
            tab ===
            "pengaturan"
              ? "bg-blue-600 text-white"
              : "bg-white border"
          }`}
        >
          Pengaturan
        </button>

      </div>

      {tab ===
        "monitoring" && (

        <div className="max-w-6xl mx-auto">

          {/* PROGRESS */}
          {/* <div className="bg-white border rounded-2xl p-5 mb-5 shadow-sm">

            <div className="flex justify-between mb-2">

              <p className="font-semibold text-gray-700">
                Progress Pembayaran
              </p>

              <p className="text-sm text-gray-500">
                {progress}%
              </p>

            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

              <div
                className="h-full bg-green-600 rounded-full transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div> */}

          {/* LIST CICILAN */}
          <div className="space-y-4">

            {data?.jadwal?.map(
              (
                item: any
              ) => (

                <div
                  key={
                    item.id_jadwal
                  }
                  className="bg-white border rounded-2xl p-5 shadow-sm"
                >

                  <div className="flex justify-between items-start">

                    <div>

                      <p className="font-bold text-gray-800">
                        Cicilan ke-
                        {
                          item.cicilan_ke
                        }
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        Jatuh tempo:
                        {" "}
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

                      <p className="text-lg font-semibold text-gray-800 mt-3">
                        Rp{" "}
                        {item.jumlah_tagihan.toLocaleString(
                          "id-ID"
                        )}
                      </p>

                    </div>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        item.status ===
                        "LUNAS"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {
                        item.status
                      }
                    </span>

                  </div>

                  {/* STATUS INFO */}
                  <div className="mt-4">

                    {item.status ===
                    "LUNAS" ? (
                      <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
                        Pembayaran
                        telah selesai
                        dan diverifikasi
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm px-4 py-3 rounded-xl">
                        Menunggu
                        pembayaran dari
                        nasabah
                      </div>
                    )}

                  </div>

                </div>
              )
            )}

          </div>

        </div>
      )}

      {/* PENGATURAN */}
      {tab ===
        "pengaturan" && (
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg grid md:grid-cols-2 overflow-hidden">

          <div className="p-6 border-r">
            <FriendlyCalendar />
          </div>

          <div className="p-6 space-y-4">

            <Input
              label="Nama"
              value={
                data
                  ?.anggota
                  ?.nama
              }
            />

            <Input
              label="Tanggal Pengajuan"
              value={
                tanggalPengajuan
              }
            />

            <Input
              label="Total Pinjaman"
              value={`Rp ${total.toLocaleString(
                "id-ID"
              )}`}
            />

            <Input
              label="Tenor"
              value={`${tenor} bulan`}
            />

            <Input
              label="Cicilan"
              value={
                cicilan
                  ? `Rp ${cicilan.toLocaleString(
                      "id-ID"
                    )}`
                  : "Menghitung..."
              }
            />

            <InputDate
              label="Tanggal Jatuh Tempo"
              value={
                jatuhTempo
              }
              setValue={
                setJatuhTempo
              }
            />

            <InputRupiah
              label="Denda"
              value={
                denda
              }
              setValue={
                setDenda
              }
            />

            <textarea
              value={
                catatan
              }
              onChange={(
                e
              ) =>
                setCatatan(
                  e.target
                    .value
                )
              }
              className="w-full border rounded-lg p-3"
              placeholder="Catatan..."
            />

            {!hasJadwal && (
              <button
                onClick={
                  handleSubmit
                }
                className="w-full bg-green-600 text-white py-3 rounded-xl"
              >
                Simpan Jadwal
              </button>
            )}

          </div>
        </div>
      )}

    </div>
  );
}