import express from "express";
import cors from "cors";
import QRCode from "qrcode";
import { connectWhatsApp, getWhatsAppStatus, sendWhatsAppMessage, logoutWhatsApp } from "@/lib/whatsapp";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/connect", async (req, res) => {
  try {
    const status = await connectWhatsApp();

const qrDataUrl = status.qr
  ? await QRCode.toDataURL(status.qr, {
      margin: 1,
      width: 280,
    })
  : null;

res.json({
  success: true,
  ...status,
  qrDataUrl,
});
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Gagal connect WhatsApp",
    });
  }
});

app.post("/send", async (req, res) => {
  try {
    const { noHp, pesan } = req.body;

    if (!noHp || !pesan?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Nomor HP dan pesan wajib diisi",
      });
    }

    await sendWhatsAppMessage(noHp, pesan.trim());

    return res.json({
      success: true,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Gagal mengirim WhatsApp",
    });
  }
});

app.get("/status", async (req, res) => {
  try {
    const status = getWhatsAppStatus();

    const qrDataUrl = status.qr
      ? await QRCode.toDataURL(status.qr, {
          margin: 1,
          width: 280,
        })
      : null;

    res.json({
      ...status,
      qrDataUrl,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      connected: false,
      connection: "close",
      qr: null,
      qrDataUrl: null,
      phoneNumber: null,
    });
  }
});

app.post("/logout", async (req, res) => {
  try {
    await logoutWhatsApp();

    return res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Gagal logout WhatsApp",
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "BUMDes WhatsApp Worker Running",
  });
});

const PORT = Number(process.env.PORT || 8080);

app.listen(PORT, () => {
  console.log(`Worker API running on port ${PORT}`);
});