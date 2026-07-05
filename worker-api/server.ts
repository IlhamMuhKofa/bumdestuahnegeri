import express from "express";
import cors from "cors";
import { connectWhatsApp, getWhatsAppStatus } from "@/lib/whatsapp";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/connect", async (req, res) => {
  try {
    const status = await connectWhatsApp();

    res.json({
      success: true,
      ...status,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Gagal connect WhatsApp",
    });
  }
});

app.get("/status", (req, res) => {
  res.json(getWhatsAppStatus());
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