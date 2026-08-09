"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  MessageCircle,
  Send,
  UserRound,
  X,
} from "lucide-react";

type ReminderOption = {
  id: number;
  name: string;
  noHp: string;
  jatuhTempo: string;
  nominal: string;
  status: string;
};

type RecipientOption = {
  id: number;
  name: string;
  noHp: string;
};

type Props = {
  isApiActive: boolean;
  reminders: ReminderOption[];
  recipients: RecipientOption[];
};

type Mode = "reminder" | "custom";

export function InstantWhatsAppSend({
  isApiActive,
  reminders,
  recipients,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("reminder");
  const [selectedReminderId, setSelectedReminderId] = useState(
    reminders[0]?.id ? String(reminders[0].id) : ""
  );
  const [selectedRecipientId, setSelectedRecipientId] = useState(
    recipients[0]?.id ? String(recipients[0].id) : "__manual"
  );
  const [manualNoHp, setManualNoHp] = useState(recipients[0]?.noHp || "");
  const [message, setMessage] = useState(
    "Halo, ini pesan WhatsApp dari BUMDes Tuah Negeri."
  );
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const selectedReminder = useMemo(
    () => reminders.find((item) => String(item.id) === selectedReminderId),
    [reminders, selectedReminderId]
  );

  async function submitSend() {
    setIsSending(true);
    setFeedback(null);

    const payload =
      mode === "reminder"
        ? {
            mode,
            reminderId: Number(selectedReminderId),
          }
        : {
            mode,
            noHp: manualNoHp,
            message,
          };

    try {
      const response = await fetch("/api/whatsapp/send-now", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || "Gagal mengirim WhatsApp.");
      }

      setFeedback({
        type: "success",
        message:
          mode === "reminder"
            ? "Reminder berhasil dikirim dan log diperbarui."
            : "Pesan custom berhasil dikirim.",
      });
      router.refresh();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Gagal mengirim WhatsApp.",
      });
    } finally {
      setIsSending(false);
    }
  }

  function handleRecipientChange(value: string) {
    setSelectedRecipientId(value);

    const recipient = recipients.find((item) => String(item.id) === value);
    if (recipient) {
      setManualNoHp(recipient.noHp);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={!isApiActive}
        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        <Send size={16} />
        Kirim Sekarang
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Kirim WhatsApp Sekarang
                </h2>
                <p className="text-sm text-slate-500">
                  Pilih mode demo reminder atau pesan custom ke nasabah.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Tutup modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 px-5 py-5">
              <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setMode("reminder")}
                  className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
                    mode === "reminder"
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <MessageCircle size={16} />
                  Demo Reminder
                </button>
                <button
                  type="button"
                  onClick={() => setMode("custom")}
                  className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
                    mode === "custom"
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <UserRound size={16} />
                  Pesan Custom
                </button>
              </div>

              {mode === "reminder" ? (
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-slate-700">
                    Jadwal reminder
                  </label>
                  <div className="relative">
                    <select
                      value={selectedReminderId}
                      onChange={(event) =>
                        setSelectedReminderId(event.target.value)
                      }
                      className="h-11 w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    >
                      {reminders.length === 0 ? (
                        <option value="">Belum ada jadwal reminder</option>
                      ) : (
                        reminders.map((reminder) => (
                          <option key={reminder.id} value={reminder.id}>
                            {reminder.name} - {reminder.nominal} -{" "}
                            {reminder.jatuhTempo}
                          </option>
                        ))
                      )}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>

                  {selectedReminder ? (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                      <p className="font-semibold text-slate-900">
                        {selectedReminder.name}
                      </p>
                      <p className="mt-1">
                        {selectedReminder.noHp} | {selectedReminder.nominal} |{" "}
                        jatuh tempo {selectedReminder.jatuhTempo}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">
                      Nasabah
                    </label>
                    <div className="relative mt-2">
                      <select
                        value={selectedRecipientId}
                        onChange={(event) =>
                          handleRecipientChange(event.target.value)
                        }
                        className="h-11 w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      >
                        {recipients.map((recipient) => (
                          <option key={recipient.id} value={recipient.id}>
                            {recipient.name} - {recipient.noHp}
                          </option>
                        ))}
                        <option value="__manual">Nomor manual</option>
                      </select>
                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700">
                      Nomor WhatsApp
                    </label>
                    <input
                      value={manualNoHp}
                      onChange={(event) => setManualNoHp(event.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700">
                      Isi pesan
                    </label>
                    <textarea
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      rows={5}
                      className="mt-2 w-full resize-none rounded-lg border border-slate-300 px-3 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                </div>
              )}

              {feedback ? (
                <div
                  className={`rounded-lg px-4 py-3 text-sm ${
                    feedback.type === "success"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {feedback.message}
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={submitSend}
                disabled={
                  isSending ||
                  (mode === "reminder" && !selectedReminderId) ||
                  (mode === "custom" && (!manualNoHp.trim() || !message.trim()))
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <Send size={16} />
                {isSending ? "Mengirim..." : "Kirim"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
