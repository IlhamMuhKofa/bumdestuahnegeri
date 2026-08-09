import { text } from "stream/consumers";

type MetaTemplateParameter = {
  type: "text";
  // Optional parameter_name for Meta template variables (some templates use named parameters)
  parameter_name?: string;
  text: string;
};

type SendTemplateReminderInput = {
  noHp: string;
  nama: string;

  jumlah_tagihan?: string;
  jatuh_tempo?: string;

  nominalAngsuran?: string;
  tanggalJatuhTempo?: string;

  nama_bank?: string;
  nomor_rekening?: string;
  atas_nama?: string;
};

const META_GRAPH_VERSION = process.env.META_WA_GRAPH_VERSION || "v20.0";
const DEFAULT_TEMPLATE_NAME = "wa_reminder";
const DEFAULT_TEMPLATE_LANGUAGE = "id";
const HELLO_WORLD_LANGUAGE = "en_US";

// Helper untuk mengubah nomor lokal seperti 08xxx menjadi format internasional 628xxx.
export function normalizeWhatsAppNumber(noHp: string) {
  const digits = noHp.replace(/\D/g, "");

  if (!digits) return null;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("62")) return digits;

  return digits;
}

// Fungsi untuk membaca konfigurasi Meta Cloud API dari environment agar validasi terpusat.
function getMetaWhatsAppConfig() {
  const token = process.env.META_WA_TOKEN;
  const phoneNumberId = process.env.META_WA_PHONE_ID;
  const templateName = process.env.META_WA_TEMPLATE_NAME || DEFAULT_TEMPLATE_NAME;
  const languageCode =
    process.env.META_WA_TEMPLATE_LANG ||
    (templateName === "hello_world"
      ? HELLO_WORLD_LANGUAGE
      : DEFAULT_TEMPLATE_LANGUAGE);

  console.log("========== META CONFIG ==========");
console.log({
  phoneNumberId,
  templateName,
  languageCode,
  graphVersion: META_GRAPH_VERSION,
});
console.log("=================================");

  if (!token || !phoneNumberId) {
    throw new Error("META_WA_TOKEN dan META_WA_PHONE_ID wajib diisi.");
  }

  return {
    token,
    phoneNumberId,
    templateName,
    languageCode,
  };
}

function getMetaApiUrl(phoneNumberId: string) {
  return `https://graph.facebook.com/${META_GRAPH_VERSION}/${phoneNumberId}/messages`;
}

async function postMetaWhatsAppMessage(
  token: string,
  phoneNumberId: string,
  payload: Record<string, unknown>
) {

console.log("========== META REQUEST ==========");
console.log("URL :", getMetaApiUrl(phoneNumberId));
console.log("TOKEN :", token.substring(0,15) + "...");
console.log("PAYLOAD:");
console.log(JSON.stringify(payload, null, 2));
console.log("==================================");

  const response = await fetch(getMetaApiUrl(phoneNumberId), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  console.log("========== META RESPONSE ==========");
console.log("Status :", response.status);
console.log(JSON.stringify(data, null, 2));
console.log("===================================");

  if (!response.ok) {
    const metaError = data?.error;
    const details = [
      metaError?.message || "Meta Cloud API gagal mengirim pesan.",
      metaError?.code ? `Code: ${metaError.code}` : null,
      metaError?.error_subcode ? `Subcode: ${metaError.error_subcode}` : null,
      metaError?.error_data?.details
        ? `Detail: ${metaError.error_data.details}`
        : null,
    ].filter(Boolean);

    throw new Error(details.join(" | "));
  }

  return data;
}

// Fungsi untuk membentuk parameter template utama pengingat angsuran H-2.
function resolveReminderTemplateText(input: SendTemplateReminderInput) {
  const nama = input.nama?.trim() || "Nasabah";
  const jumlahTagihan =
    input.jumlah_tagihan?.trim() || input.nominalAngsuran?.trim();
  const jatuhTempo =
    input.jatuh_tempo?.trim() || input.tanggalJatuhTempo?.trim();

  if (!jumlahTagihan) {
    throw new Error("Jumlah tagihan WhatsApp tidak valid.");
  }

  if (!jatuhTempo) {
    throw new Error("Tanggal jatuh tempo WhatsApp tidak valid.");
  }

  return {
    nama,
    jumlahTagihan,
    jatuhTempo,
  };
}

function buildReminderTemplateParameters(
  input: SendTemplateReminderInput,
  templateName: string
): MetaTemplateParameter[] {
  const { nama, jumlahTagihan, jatuhTempo } =
    resolveReminderTemplateText(input);

  // Template lama (3 parameter)
  if (templateName === "wa_reminder") {
    return [
      {
        type: "text",
        text: nama,
      },
      {
        type: "text",
        text: jumlahTagihan,
      },
      {
        type: "text",
        text: jatuhTempo,
      },
    ];
  }

  // Template pengingat_angsuran (6 parameter)
  if (templateName === "pengingat_angsuran") {
    return [
      {
        type: "text",
        parameter_name: "nama",
        text: nama,
      },
      {
        type: "text",
        parameter_name: "nominal_angsuran",
        text: jumlahTagihan,
      },
      {
        type: "text",
        parameter_name: "jatuh_tempo",
        text: jatuhTempo,
      },
      {
        type: "text",
        parameter_name: "nama_bank",
        text: input.nama_bank ?? "",
      },
      {
        type: "text",
        parameter_name: "nomor_rekening",
        text: input.nomor_rekening ?? "",
      },
      {
        type: "text",
        parameter_name: "atas_nama",
        text: input.atas_nama ?? "",
      },
    ];
  }

  throw new Error(`Template "${templateName}" belum didukung.`);
}

// Helper payload Meta: hello_world dikirim tanpa parameter karena template test Meta tidak menerima variabel.
function buildTemplatePayload(
  input: SendTemplateReminderInput,
  templateName: string,
  languageCode: string
) {
  const isHelloWorldTest = templateName === "hello_world";

  return {
    messaging_product: "whatsapp",
    type: "template",
    template: {
      name: templateName,
      language: {
        code: languageCode,
      },
      ...(isHelloWorldTest
        ? {}
        : {
            components: [
              {
                type: "body",
                parameters: buildReminderTemplateParameters(
    input,
    templateName
),
              },
            ],
          }),
    },
  };
}

// Fungsi utama pengiriman reminder melalui Meta Cloud API resmi, tanpa Baileys atau scan QR.
export async function sendWhatsAppReminderTemplate(
  input: SendTemplateReminderInput
) {
  const { token, phoneNumberId, templateName, languageCode } =
    getMetaWhatsAppConfig();
  const normalizedNumber = normalizeWhatsAppNumber(input.noHp);

  if (!normalizedNumber) {
    throw new Error("Nomor WhatsApp tidak valid.");
  }

const payload = {
  ...buildTemplatePayload(
    input,
    templateName,
    languageCode
  ),
  to: normalizedNumber,
};

console.log("========== META PAYLOAD ==========");
console.log(JSON.stringify(payload, null, 2));
console.log("==================================");

return postMetaWhatsAppMessage(
  token,
  phoneNumberId,
  payload
);
}

export async function sendWhatsAppTextMessage(input: {
  noHp: string;
  message: string;
}) {
  const { token, phoneNumberId } = getMetaWhatsAppConfig();
  const normalizedNumber = normalizeWhatsAppNumber(input.noHp);
  const message = input.message.trim();

  if (!normalizedNumber) {
    throw new Error("Nomor WhatsApp tidak valid.");
  }

  if (!message) {
    throw new Error("Pesan WhatsApp tidak boleh kosong.");
  }

  return postMetaWhatsAppMessage(token, phoneNumberId, {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: normalizedNumber,
    type: "text",
    text: {
      preview_url: false,
      body: message,
    },
  });
}

// Fungsi status sederhana untuk UI: koneksi dianggap aktif jika credential Meta tersedia di environment.
export function getMetaWhatsAppStatus() {
  const templateName = process.env.META_WA_TEMPLATE_NAME || DEFAULT_TEMPLATE_NAME;

  return {
    active: Boolean(process.env.META_WA_TOKEN && process.env.META_WA_PHONE_ID),
    mode: "Meta Cloud API",
    phoneNumberId: process.env.META_WA_PHONE_ID || null,
    templateName,
    languageCode:
      process.env.META_WA_TEMPLATE_LANG ||
      (templateName === "hello_world"
        ? HELLO_WORLD_LANGUAGE
        : DEFAULT_TEMPLATE_LANGUAGE),
  };
}
