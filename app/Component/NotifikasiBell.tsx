"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";

type NotifikasiItem = {
  id_notifikasi: number;
  isi_notifikasi: string;
  jenis_notifikasi: string;
  url_tujuan: string | null;
  waktu_dibaca: string | null;
  created_at: string;
};

type Props = {
  variant?: "admin" | "nasabah";
};

function formatWaktu(value: string) {
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 7) return `${days} hari lalu`;

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function NotifikasiBell({ variant = "admin" }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotifikasiItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const isNasabah = variant === "nasabah";

  async function loadNotifikasi() {
    try {
      setLoading(true);
      const response = await fetch("/api/notifikasi", {
        cache: "no-store",
      });

      if (!response.ok) return;

      const data = (await response.json()) as {
        items: NotifikasiItem[];
        unreadCount: number;
      };

      setItems(data.items);
      setUnreadCount(data.unreadCount);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id_notifikasi?: number) {
    await fetch("/api/notifikasi", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        id_notifikasi
          ? {
              id_notifikasi,
            }
          : {}
      ),
    });

    await loadNotifikasi();
  }

  async function handleOpen() {
    const nextOpen = !open;
    setOpen(nextOpen);

    if (nextOpen) {
      await loadNotifikasi();
    }
  }

  async function handleClick(item: NotifikasiItem) {
    await markAsRead(item.id_notifikasi);
    setOpen(false);

    if (item.url_tujuan) {
      router.push(item.url_tujuan);
    }
  }

  useEffect(() => {
    loadNotifikasi();

    const interval = window.setInterval(loadNotifikasi, 30000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={handleOpen}
        className={
          isNasabah
            ? "relative rounded-full p-1.5 text-white transition hover:text-yellow-400"
            : "relative rounded-xl bg-slate-50 p-2 text-slate-700 transition hover:bg-slate-100"
        }
        aria-label="Notifikasi"
      >
        <Bell size={isNasabah ? 28 : 18} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className={`absolute right-0 z-[1000] mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-2xl ${
            isNasabah ? "top-full" : ""
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Notifikasi</p>
              <p className="text-xs text-slate-400">
                {unreadCount} belum dibaca
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAsRead()}
                className="rounded-lg px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
              >
                Tandai semua
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && items.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-slate-400">
                Memuat notifikasi...
              </div>
            ) : items.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-slate-400">
                Belum ada notifikasi
              </div>
            ) : (
              items.map((item) => {
                const unread = !item.waktu_dibaca;

                return (
                  <button
                    key={item.id_notifikasi}
                    type="button"
                    onClick={() => handleClick(item)}
                    className="flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50"
                  >
                    <span
                      className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                        unread ? "bg-rose-500" : "bg-slate-200"
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-sm leading-snug ${
                          unread ? "font-semibold text-slate-900" : "text-slate-600"
                        }`}
                      >
                        {item.isi_notifikasi}
                      </span>
                      <span className="mt-1 block text-xs text-slate-400">
                        {formatWaktu(item.created_at)}
                      </span>
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
