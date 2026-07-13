import { Request, Response } from "express";
import axios from "axios";

class WhatsAppService {
  async verifyWebhook(req: Request, res: Response) {
  console.log("========== VERIFY ==========");
  console.log(req.query);
  console.log("Received token:", req.query["hub.verify_token"]);
  console.log("Expected token:", process.env.META_VERIFY_TOKEN);

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe") {
    console.log("✅ Mode OK");
  } else {
    console.log("❌ Mode Failed");
  }

  if (token === process.env.META_VERIFY_TOKEN) {
    console.log("✅ Token OK");
  } else {
    console.log("❌ Token Failed");
  }

  if (
    mode === "subscribe" &&
    token === process.env.META_VERIFY_TOKEN
  ) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
}
  async sendMessage(to: string, message: string) {
  try {
    console.log("Sending to:", to);
    console.log("Phone Number ID:", process.env.PHONE_NUMBER_ID);

    const response = await axios.post(
      `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: {
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Message Sent");
    console.log(response.data);

  } catch (err: any) {
    console.log("========== META ERROR ==========");
    console.log("Status:", err.response?.status);
    console.log("Data:", JSON.stringify(err.response?.data, null, 2));
    console.log("===============================");
  }
}

  async receiveWebhook(req: Request, res: Response) {
  try {
    console.log("📩 Incoming Webhook");
    console.log(JSON.stringify(req.body, null, 2));

    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    const message = value?.messages?.[0];

    if (!message) {
      return res.sendStatus(200);
    }

    const from = message.from;
    const text = message.text?.body;

    console.log("📱 From:", from);
    console.log("💬 Message:", text);
    await this.sendMessage(
  from,
  `Hello 👋 You said: "${text}"`
);

    return res.sendStatus(200);

  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}
}

export default new WhatsAppService();