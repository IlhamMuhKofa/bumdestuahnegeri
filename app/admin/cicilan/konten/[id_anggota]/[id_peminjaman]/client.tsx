"use client";

import React, { useState, useEffect } from "react";
import { LayoutList, Settings2, Inbox, ArrowLeft } from "lucide-react";
import { createJadwalAngsuran } from "./action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CardCicilan from "./CardCicilan";
import FormPengaturan from "./FormPengaturan";


export default function Client({ data }: any) {
  const router = useRouter();

  const total = data?.total_pinjaman || 0;
  const tenor = data?.jangka_waktu || 0;
  const hasJadwal = data?.jadwal?.length > 0;

  const [tab, setTab] = useState<"monitoring" | "pengaturan">(
    hasJadwal ? "monitoring" : "pengaturan"
  );

  const [jatuhTempo, setJatuhTempo] = useState("");
  const [denda, setDenda] = useState(0);
  const [catatan, setCatatan] = useState("");
  const [cicilan, setCicilan] = useState<number | null>(null);

  const tanggalPengajuan = new Date(data?.tanggal_pengajuan).toLocaleDateString("id-ID");

  useEffect(() => {
    if (!total || !tenor) return;

    fetch(`/api/simulasi?jumlah=${total}&tenor=${tenor}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setCicilan(res.data.cicilan_per_bulan);
        }
      });
  }, [total, tenor]);

  const handleSubmit = async () => {
    if (!jatuhTempo) {
      toast.error("Tanggal jatuh tempo wajib diisi");
      return;
    }

    if (!cicilan) {
      toast.error("Cicilan belum tersedia");
      return;
    }

    try {
      await createJadwalAngsuran({
        idPeminjaman: data.id_peminjaman,
        tanggalMulai: jatuhTempo,
        cicilanPerBulan: cicilan,
        tenor,
        denda,
        catatan,
      });

      toast.success("Jadwal berhasil dibuat");
      router.refresh();
      setTab("monitoring");
    } catch {
      toast.error("Gagal membuat jadwal");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto mb-4">
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-800 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      Kembali
    </button>
  </div>
      <div className="max-w-6xl mx-auto mb-6">
        <div className="inline-flex bg-white border rounded-2xl p-1 shadow-sm gap-1">
          <button
            onClick={() => setTab("monitoring")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${
              tab === "monitoring" ? "bg-blue-800 text-white" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <LayoutList className="w-4 h-4" />
            List Jadwal
          </button>

          <button
            onClick={() => setTab("pengaturan")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${
              tab === "pengaturan" ? "bg-blue-800 text-white" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Settings2 className="w-4 h-4" />
            Form Jadwal
          </button>
        </div>
      </div>

      {tab === "monitoring" && (
        <div className="max-w-6xl mx-auto">
          {hasJadwal ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.jadwal?.map((item: any) => (
                <CardCicilan key={item.id_jadwal} item={item} />
              ))}
            </div>
          ) : (
            <div className="bg-white border rounded-2xl shadow-sm p-10 flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-blue-50 mb-3">
                <Inbox className="w-6 h-6 text-blue-800" />
              </div>
              <p className="font-semibold text-gray-800">Belum ada jadwal angsuran</p>
              <p className="text-sm text-gray-500 mt-1">
                Atur jadwal terlebih dahulu di tab Pengaturan
              </p>
            </div>
          )}
        </div>
      )}

      {tab === "pengaturan" && (
        <FormPengaturan
          data={data}
          total={total}
          tenor={tenor}
          cicilan={cicilan}
          tanggalPengajuan={tanggalPengajuan}
          jatuhTempo={jatuhTempo}
          setJatuhTempo={setJatuhTempo}
          denda={denda}
          setDenda={setDenda}
          catatan={catatan}
          setCatatan={setCatatan}
          hasJadwal={hasJadwal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}