import { prisma } from "@/lib/prisma";
import { processDueWhatsAppReminders } from "@/lib/whatsapp-reminder";

const intervalMs = Number(process.env.WA_REMINDER_INTERVAL_MS || 60_000);

async function runOnce() {
  try {
    const result = await processDueWhatsAppReminders(prisma);

    if (result && result.checked > 0) {
      console.log(
        `[WA Reminder] checked=${result.checked} sent=${result.sent} failed=${result.failed}`
      );
    }
  } catch (error) {
    console.error("[WA Reminder] Gagal memproses antrean pada ronde ini:", error);
  }
}

async function main() {
  console.log("WA reminder worker berjalan.");
  console.log("Menunggu antrean otomatis berdasarkan basis data...");

  // Eksekusi pertama saat worker dinyalakan
  await runOnce();

  // Menggunakan fungsi rekursif agar tidak terjadi tabrakan proses (Overlapping)
  async function workerLoop() {
    await runOnce();
    setTimeout(workerLoop, intervalMs);
  }

  setTimeout(workerLoop, intervalMs);
}

main().catch((error) => {
  console.error("[WA Reminder] fatal:", error);
  process.exit(1);
});