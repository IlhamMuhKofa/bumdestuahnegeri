import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const intervalMs = Number(process.env.WA_REMINDER_INTERVAL_MS || 60_000);

// Fungsi bootstrap worker Meta Cloud API; tidak perlu scan QR karena memakai token resmi Meta.
async function main() {
  const [{ prisma }, { processDueWhatsAppReminders }] = await Promise.all([
    import("@/lib/prisma"),
    import("@/lib/whatsapp-reminder"),
  ]);

  // Fungsi satu ronde worker untuk memproses reminder H-2 yang sudah waktunya dikirim.
  async function runOnce() {
    try {
      const result = await processDueWhatsAppReminders(prisma);

      if (result && result.checked > 0) {
        console.log(
          `[WA Reminder] checked=${result.checked} sent=${result.sent} failed=${result.failed}`
        );
      }
    } catch (error) {
      console.error(
        "[WA Reminder] Gagal memproses antrean pada ronde ini:",
        error
      );
    }
  }

  console.log("WA reminder worker berjalan.");
  console.log("Meta Cloud API siap dipakai melalui kredensial environment.");
  console.log("Menunggu antrean otomatis berdasarkan basis data...");

  await runOnce();

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
