import path from "path";
import fs from "fs/promises";
import pino from "pino";
import type { WASocket } from "@whiskeysockets/baileys";

type QrCodeTerminal = {
  generate: (input: string, options?: { small?: boolean }) => void;
};

type WhatsAppConnectionStatus = {
  connected: boolean;
  connection: "idle" | "connecting" | "open" | "close";
  qr: string | null;
  phoneNumber: string | null;
};

type WhatsAppRuntime = {
  socket: WASocket | null;
  socketPromise: Promise<WASocket> | null;
  status: WhatsAppConnectionStatus;
  waiters: Set<() => void>;
};

const globalForWhatsApp = globalThis as typeof globalThis & {
  __bumdesWhatsAppRuntime?: WhatsAppRuntime;
};

function getRuntime() {
  if (!globalForWhatsApp.__bumdesWhatsAppRuntime) {
    globalForWhatsApp.__bumdesWhatsAppRuntime = {
      socket: null,
      socketPromise: null,
      status: {
        connected: false,
        connection: "idle",
        qr: null,
        phoneNumber: null,
      },
      waiters: new Set(),
    };
  }

  return globalForWhatsApp.__bumdesWhatsAppRuntime;
}

function setStatus(status: Partial<WhatsAppConnectionStatus>) {
  const runtime = getRuntime();
  runtime.status = {
    ...runtime.status,
    ...status,
  };
  notifyWaiters();
}

function notifyWaiters() {
  const runtime = getRuntime();
  const waiters = Array.from(runtime.waiters);
  runtime.waiters.clear();
  waiters.forEach((resolve) => resolve());
}

export function normalizeWhatsAppNumber(noHp: string) {
  const digits = noHp.replace(/\D/g, "");

  if (!digits) return null;

  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }

  if (digits.startsWith("62")) {
    return digits;
  }

  return digits;
}

export function toWhatsAppJid(noHp: string) {
  const normalized = normalizeWhatsAppNumber(noHp);

  if (!normalized) return null;

  return `${normalized}@s.whatsapp.net`;
}

export async function getWhatsAppSocket() {
  const runtime = getRuntime();

  if (runtime.socket) {
    return runtime.socket;
  }

  if (runtime.socketPromise) {
    return runtime.socketPromise;
  }

  console.log("=== createSocket DIPANGGIL ===");

  runtime.socketPromise = createSocket();
  return runtime.socketPromise;
}

export function getWhatsAppStatus() {
  return getRuntime().status;
}

export async function connectWhatsApp() {
  await getWhatsAppSocket();
  await waitForQrOrOpen();
  return getWhatsAppStatus();
}

export async function logoutWhatsApp() {
  const runtime = getRuntime();
  const activeSocket =
    runtime.socket ?? (runtime.socketPromise ? await runtime.socketPromise : null);

  if (activeSocket) {
    await activeSocket.logout().catch(() => undefined);
    activeSocket.end(undefined);
  }

  runtime.socket = null;
  runtime.socketPromise = null;
  runtime.status = {
    connected: false,
    connection: "idle",
    qr: null,
    phoneNumber: null,
  };
  notifyWaiters();

  await fs.rm(path.join(process.cwd(), "wa-session"), {
    recursive: true,
    force: true,
  });
}

async function createSocket() {
  const runtime = getRuntime();

  setStatus({
    connected: false,
    connection: "connecting",
    qr: null,
    phoneNumber: null,
  });

  const baileys = await import("@whiskeysockets/baileys");
  const qrCodeModule = (await import("qrcode-terminal")) as unknown as {
    default?: QrCodeTerminal;
    generate?: QrCodeTerminal["generate"];
  };
  const qrCode = qrCodeModule.default ?? qrCodeModule;
  const sessionPath = path.join(process.cwd(), "wa-session");

  console.log("Session Path:", sessionPath);

  const { state, saveCreds } =
    await baileys.useMultiFileAuthState(sessionPath);

  const { version, isLatest } = await baileys.fetchLatestBaileysVersion();

  console.log("Baileys Version:", version);
  console.log("Is Latest:", isLatest);

  const sock = baileys.makeWASocket({
    version,
    auth: state,
    browser: baileys.Browsers.ubuntu("Chrome"),
    logger: pino({
      level: "info",
    }),
    syncFullHistory: false,
  });

  console.log("=== SOCKET BERHASIL DIBUAT ===");
  runtime.socket = sock;

  sock.ev.on("creds.update", async () => {
    console.log("=== CREDS UPDATE ===");

    await saveCreds();

    console.log("=== CREDS SAVED ===");
  });

  console.log("=== MENUNGGU UPDATE KONEKSI ===");
  sock.ev.on("connection.update", (update) => {

    console.log("========== CONNECTION UPDATE ==========");
    console.dir(update, { depth: null });
    console.log("======================================");

    if (update.qr) {
      runtime.status = {
        ...runtime.status,
        connection: "connecting",
        qr: update.qr,
      };
      notifyWaiters();

      if (typeof qrCode?.generate === "function") {
        console.log("Scan QR berikut untuk login WhatsApp:");
        qrCode.generate(update.qr, {
          small: true,
        });
      }
    }

    let statusCode: number | undefined;

    if (update.connection === "close") {
      console.log("LastDisconnect:");
      console.dir(update.lastDisconnect, { depth: null });

      statusCode = getStatusCode(update.lastDisconnect?.error);

      console.log("StatusCode =", statusCode);
      console.log(
        "DisconnectReason.restartRequired =",
        baileys.DisconnectReason.restartRequired
      );
      console.log(
        "DisconnectReason.loggedOut =",
        baileys.DisconnectReason.loggedOut
      );
    }

    if (update.connection === "open") {
      console.log("=== KONEKSI TERHUBUNG ===");
      setStatus({
        connected: true,
        connection: "open",
        qr: null,
        phoneNumber: formatConnectedNumber(sock.user?.id),
      });
    }

    if (update.connection === "close") {
      console.log("Connection closed. Status:", statusCode);

      // Pairing berhasil → WhatsApp meminta reconnect
      if (statusCode === baileys.DisconnectReason.restartRequired) {
        console.log("Restart required. Reconnecting...");

        runtime.socket = null;
        runtime.socketPromise = null;

        // reconnect otomatis
        setTimeout(() => {
          void getWhatsAppSocket();
        }, 1000);

        return;
      }

      // Logout dari HP
      if (statusCode === baileys.DisconnectReason.loggedOut) {
        console.log("WhatsApp logout.");

        runtime.socket = null;
        runtime.socketPromise = null;

        runtime.status = {
          connected: false,
          connection: "idle",
          qr: null,
          phoneNumber: null,
        };

        notifyWaiters();

        return;
      }

      // Disconnect biasa
      setStatus({
        connected: false,
        connection: "close",
        qr: null,
        phoneNumber: null,
      });

      runtime.socket = null;
      runtime.socketPromise = null;
    }
  });

  return sock;
}

async function waitForQrOrOpen(timeoutMs = 60000) {
  const runtime = getRuntime();

  if (runtime.status.qr || runtime.status.connected) {
    return;
  }

  await new Promise<void>((resolve) => {
    const timeout = setTimeout(() => {
      runtime.waiters.delete(done);
      resolve();
    }, timeoutMs);

    function done() {
      clearTimeout(timeout);
      resolve();
    }

    runtime.waiters.add(done);
  });
}

function formatConnectedNumber(jid?: string) {
  if (!jid) return null;

  return jid.split(":")[0]?.replace(/\D/g, "") || null;
}

function getStatusCode(error: unknown): number | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "output" in error &&
    typeof error.output === "object" &&
    error.output !== null &&
    "statusCode" in error.output
  ) {
    return typeof error.output.statusCode === "number"
      ? error.output.statusCode
      : undefined;
  }

  return undefined;
}

export async function sendWhatsAppMessage(noHp: string, message: string) {
  const jid = toWhatsAppJid(noHp);

  if (!jid) {
    throw new Error("Nomor WhatsApp tidak valid");
  }

  const sock = await getWhatsAppSocket();

  console.log("Mengirim ke:", jid);

  await sock.sendMessage(jid, {
    text: message,
  });

  console.log("Pesan berhasil dikirim.");
}
