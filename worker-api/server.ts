import express from "express";
import cors from "cors";
import QRCode from "qrcode";
import { connectWhatsApp, getWhatsAppStatus } from "@/lib/whatsapp";

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