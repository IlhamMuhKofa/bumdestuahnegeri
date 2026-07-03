"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  LogOut,
  MessageCircle,
  RefreshCw,
  Send,
  Smartphone,
  WifiOff,
  X,
} from "lucide-react";

type WhatsAppStatus = {
  connected: boolean;
  connection: "idle" | "connecting" | "open" | "close";
  qr: string | null;
  qrDataUrl: string | null;
  phoneNumber: string | null;
};

type NasabahOption = {
  idAnggota: number;
  idJadwal: number;
  nama: string;
  noHp: string;
  cicilanKe: number;
  jumlahTagihan: number;
  jatuhTempo: string;
};

const templateOptions = [
  {
    key: "h3",
    label: "Pengingat Santai H-3",
  },
  {
    key: "hari_h",
    label: "Pengingat Tegas Hari H",
  },
  {
    key: "terlambat",
    label: "Teguran Terlambat",
  },
] as const;

type TemplateKey = (typeof templateOptions)[number]["key"];

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function formatTanggal(value: string) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function buildTemplate(template: TemplateKey, nasabah?: NasabahOption) {
  if (!nasabah) return "";

  const nama = nasabah.nama;
  const tagihan = formatRupiah(nasabah.jumlahTagihan);
  const jatuhTempo = formatTanggal(nasabah.jatuhTempo);

  if (template === "h3") {
    return [
      `Halo ${nama},`,
      "",
      `Kami ingatkan dengan santai bahwa cicilan pinjaman BUMDes ke-${nasabah.cicilanKe} akan jatuh tempo pada ${jatuhTempo}.`,
      `Jumlah tagihan: ${tagihan}.`,
      "",
      "Terima kasih sudah menjaga pembayaran tetap lancar.",
    ].join("\n");
  }

  if (template === "hari_h") {
    return [
      `Yth. ${nama},`,
      "",
      `Cicilan pinjaman BUMDes ke-${nasabah.cicilanKe} jatuh tempo hari ini (${jatuhTempo}).`,
      `Jumlah tagihan yang perlu dibayarkan: ${tagihan}.`,
      "",
      "Mohon segera lakukan pembayaran agar tidak tercatat terlambat.",
    ].join("\n");
  }

  return [
    `Yth. ${nama},`,
    "",
    `Pembayaran cicilan pinjaman BUMDes ke-${nasabah.cicilanKe} sebesar ${tagihan} telah melewati tanggal jatuh tempo ${jatuhTempo}.`,
    "",
    "Mohon segera melakukan pembayaran atau menghubungi petugas BUMDes untuk konfirmasi.",
  ].join("\n");
}

export default function WhatsAppManagementClient() {
  const [status, setStatus] = useState<WhatsAppStatus | null>(null);
  const [nasabah, setNasabah] = useState<NasabahOption[]>([]);
  const [selectedNasabahId, setSelectedNasabahId] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>("h3");
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [sending, setSending] = useState(false);
  const [runningQueue, setRunningQueue] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const selectedNasabah = useMemo(
    () => nasabah.find((item) => String(item.idJadwal) === selectedNasabahId),
    [nasabah, selectedNasabahId]
  );

  async function loadStatus() {
    try {
      const response = await fetch("/api/whatsapp/status", {
        cache: "no-store",
      });

      if (!response.ok) return;

      const data = (await response.json()) as WhatsAppStatus;
      setStatus(data);
    } finally {
      setLoadingStatus(false);
    }
  }

  async function loadNasabah() {
    const response = await fetch("/api/whatsapp/nasabah", {
      cache: "no-store",
    });

    if (!response.ok) return;

    const data = (await response.json()) as {
      items: NasabahOption[];
    };

    setNasabah(data.items);
    setSelectedNasabahId((current) => current || String(data.items[0]?.idJadwal || ""));
  }

  async function handleConnect() {
    try {
      setConnecting(true);
      setNotice(null);

      const response = await fetch("/api/whatsapp/connect", {
        method: "POST",
      });

      if (response.ok) {
        const data = (await response.json()) as WhatsAppStatus;
        setStatus(data);
      } else {
        const data = (await response.json().catch(() => ({}))) as {
          message?: string;
        };
        setNotice(data.message || "Gagal menghubungkan WhatsApp.");
      }
    } finally {
      setConnecting(false);
    }
  }

  async function handleLogout() {
    const ok = confirm("Putuskan koneksi WhatsApp saat ini?");
    if (!ok) return;

    try {
      setLoggingOut(true);
      setNotice(null);

      await fetch("/api/whatsapp/logout", {
        method: "POST",
      });

      await loadStatus();
    } finally {
      setLoggingOut(false);
    }
  }

  async function handleRunQueue() {
    try {
      setRunningQueue(true);
      setNotice(null);

      const response = await fetch("/api/whatsapp/reminder/run", {
        method: "POST",
      });
      const data = (await response.json()) as {
        sent?: number;
        failed?: number;
        checked?: number;
        message?: string;
      };

      if (!response.ok) {
        setNotice(data.message || "Gagal menjalankan antrean reminder");
        return;
      }

      setNotice(
        `Antrean diproses: ${data.checked || 0} dicek, ${data.sent || 0} terkirim, ${data.failed || 0} gagal.`
      );
    } finally {
      setRunningQueue(false);
    }
  }

  async function handleSendManual() {
    if (!selectedNasabah) {
      setNotice("Pilih nasabah terlebih dahulu.");
      return;
    }

    if (!message.trim()) {
      setNotice("Pesan tidak boleh kosong.");
      return;
    }

    try {
      setSending(true);
      setNotice(null);

      const response = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          noHp: selectedNasabah.noHp,
          pesan: message,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
      };

      if (!response.ok) {
        setNotice(data.message || "Gagal mengirim pesan.");
        return;
      }

      setNotice(`Pesan berhasil dikirim ke ${selectedNasabah.nama}.`);
      setModalOpen(false);
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    loadStatus();
    loadNasabah();

    const interval = window.setInterval(loadStatus, 3000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    setMessage(buildTemplate(selectedTemplate, selectedNasabah));
  }, [selectedNasabah, selectedTemplate]);

  const connected = Boolean(status?.connected);
  const waitingQr = status?.connection === "connecting" && !status.qrDataUrl;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Manajemen WhatsApp
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola koneksi WhatsApp BUMDes, kirim pesan manual, dan uji antrean reminder cicilan.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900 disabled:opacity-60"
            disabled={!connected}
          >
            <Send size={16} />
            Kirim Pesan Manual
          </button>

          <button
            type="button"
            onClick={handleRunQueue}
            disabled={!connected || runningQueue}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-800 transition hover:bg-blue-50 disabled:opacity-60"
          >
            {runningQueue ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
            Jalankan Antrean H-1
          </button>
        </div>
      </div>

      {notice && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-900">
          {notice}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-blue-800 px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <MessageCircle size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Status Integrasi WhatsApp</h2>
              <p className="text-sm text-blue-100">
                Koneksi ini dipakai untuk pesan manual dan reminder cicilan otomatis.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            {loadingStatus ? (
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-600">
                <Loader2 className="animate-spin" size={20} />
                Memuat status WhatsApp...
              </div>
            ) : connected ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 text-emerald-600" size={22} />
                  <div>
                    <p className="text-base font-bold text-emerald-800">
                      🟢 Terhubung
                    </p>
                    <p className="mt-1 text-sm text-emerald-700">
                      Nomor: {status?.phoneNumber || "Nomor WhatsApp aktif"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
                >
                  {loggingOut ? <Loader2 className="animate-spin" size={16} /> : <LogOut size={16} />}
                  Putuskan Koneksi / Logout
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-3">
                  <WifiOff className="mt-0.5 text-slate-500" size={22} />
                  <div>
                    <p className="text-base font-bold text-slate-900">
                      Status: Belum Terhubung
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Klik tombol connect untuk menampilkan QR Code, lalu scan dari aplikasi WhatsApp.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConnect}
                  disabled={connecting}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:opacity-60"
                >
                  {connecting ? <Loader2 className="animate-spin" size={16} /> : <Smartphone size={16} />}
                  Hubungkan WhatsApp / Connect WA
                </button>
              </div>
            )}

            {/* <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Nasabah Tersedia
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {nasabah.length}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Mode Kirim
                </p>
                <p className="mt-2 text-sm font-bold text-blue-800">
                  Baileys WebSocket
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Endpoint Demo
                </p>
                <p className="mt-2 text-sm font-bold text-blue-800">
                  /api/whatsapp/reminder/run
                </p>
              </div>
            </div> */}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-bold text-slate-900">QR Code</p>
            <p className="mt-1 text-xs text-slate-500">
              QR hanya muncul setelah tombol connect diklik.
            </p>

            <div className="mt-4 flex min-h-[280px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-4">
              {status?.qrDataUrl ? (
                <img
                  src={status.qrDataUrl}
                  alt="QR WhatsApp"
                  className="h-64 w-64"
                />
              ) : connected ? (
                <div className="text-center text-sm text-emerald-700">
                  WhatsApp sudah terhubung.
                </div>
              ) : waitingQr ? (
                <div className="flex flex-col items-center gap-2 text-center text-sm text-slate-500">
                  <Loader2 className="animate-spin text-blue-800" size={22} />
                  Menunggu QR dari WhatsApp...
                </div>
              ) : (
                <div className="text-center text-sm text-slate-400">
                  QR belum diminta.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-blue-800 px-5 py-4 text-white">
              <div>
                <h3 className="text-base font-bold">Kirim Pesan Manual</h3>
                <p className="text-xs text-blue-100">
                  Pilih nasabah, template, edit pesan, lalu kirim real-time.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 transition hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Pilih Nasabah
                </label>
                <select
                  value={selectedNasabahId}
                  onChange={(event) => setSelectedNasabahId(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-800/10"
                >
                  {nasabah.length === 0 ? (
                    <option value="">Tidak ada nasabah dengan cicilan aktif</option>
                  ) : (
                    nasabah.map((item) => (
                      <option key={item.idJadwal} value={item.idJadwal}>
                        {item.nama} - {item.noHp} - Cicilan ke-{item.cicilanKe}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Pilih Template Chat
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(event) =>
                    setSelectedTemplate(event.target.value as TemplateKey)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-800/10"
                >
                  {templateOptions.map((item) => (
                    <option key={item.key} value={item.key}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {selectedNasabah && (
                <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-950">
                  Target: <span className="font-semibold">{selectedNasabah.nama}</span>,
                  tagihan {formatRupiah(selectedNasabah.jumlahTagihan)}, jatuh tempo{" "}
                  {formatTanggal(selectedNasabah.jatuhTempo)}.
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Preview Pesan
                </label>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={9}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-relaxed outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-800/10"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSendManual}
                disabled={sending || !connected || !selectedNasabah}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:opacity-60"
              >
                {sending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                Kirim Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
