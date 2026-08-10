import { Request, Response } from "express";
import axios from "axios";
import chatService from "./chat.service";
import whatsappConnectionService from "./whatsapp-connection.service";
import conversationService from "./conversation.service";
import messageService from "./message.service";
import sseService from "./sse.service";

class WhatsAppService {
	async verifyWebhook(req: Request, res: Response) {
		console.log("========== VERIFY ==========");
		console.log(req.query);

		const mode = req.query["hub.mode"];
		const token = req.query["hub.verify_token"];
		const challenge = req.query["hub.challenge"];

		if (mode === "subscribe" && token === process.env.META_VERIFY_TOKEN) {
			console.log("✅ Webhook Verified");
			return res.status(200).send(challenge);
		}

		console.log("❌ Verification Failed");
		return res.sendStatus(403);
	}

	async sendMessage(
		accessToken: string,
		phoneNumberId: string,
		to: string,
		message: string,
	) {
		try {
			const response = await axios.post(
				`https://graph.facebook.com/v23.0/${phoneNumberId}/messages`,
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
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
				},
			);

			console.log("✅ Message Sent");
			console.log(response.data);
		} catch (err: any) {
			console.log("========== META ERROR ==========");
			console.log(err.response?.data || err.message);
			console.log("===============================");
		}
	}

	async sendHumanMessage(
		organizationId: string,
		to: string,
		message: string,
	) {
		try {
			const connection =
				await whatsappConnectionService.getByOrganizationId(
					organizationId,
				);

			await this.sendMessage(
				connection.accessToken,
				connection.phoneNumberId,
				to,
				message,
			);

			return {
				success: true,
				message: "Message sent successfully",
			};
		} catch (error: any) {
			console.error("Human Message Error:", error);

			throw new Error(error.message || "Failed to send human message");
		}
	}

	async receiveWebhook(req: Request, res: Response) {
		try {
			console.log("📩 Incoming Webhook");
			console.log(JSON.stringify(req.body, null, 2));

			const message =
				req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

			if (!message) {
				return res.sendStatus(200);
			}

			const from = message.from;
			const text = message.text?.body ?? "";

			const phoneNumberId =
				req.body.entry?.[0]?.changes?.[0]?.value?.metadata
					?.phone_number_id;

			console.log("📞 Phone Number ID:", phoneNumberId);
			console.log("📱 From:", from);
			console.log("💬 Message:", text);

			const connection =
				await whatsappConnectionService.getByPhoneNumberId(
					phoneNumberId,
				);

			// Get existing conversation
			const conversation =
				await conversationService.getOrCreateConversation(
					connection.organizationId,
					from,
				);

			console.log("💬 Conversation Mode:", conversation.mode);

			// ==========================================
			// HUMAN MODE
			// ==========================================

			if (conversation.mode === "HUMAN") {
				console.log("👤 HUMAN MODE - AI skipped");

				await messageService.createMessage({
					conversationId: conversation.id!,
					sender: "CUSTOMER",
					text,
				});

				await conversationService.updateConversation(
					conversation.id!,
					text,
				);

				sseService.sendToOrganization(
					connection.organizationId,
					"new_message",
					{
						conversationId: conversation.id!,
						sender: "CUSTOMER",
						text,
					},
				);

				console.log("📡 SSE: Customer message sent to inbox");

				console.log("✅ Customer message saved");
				console.log("🚫 AI response skipped");

				return res.sendStatus(200);
			}

			// ==========================================
			// AI MODE
			// ==========================================

			console.log("🤖 AI MODE - Calling Chat Service...");

			const aiResponse = await chatService.sendMessage(
				connection.organizationId,
				from,
				text,
			);

			console.log("🤖 AI Response:", aiResponse);

			await this.sendMessage(
				connection.accessToken,
				connection.phoneNumberId,
				from,
				aiResponse.reply,
			);

	

			console.log("✅ AI Reply sent to WhatsApp");

			return res.sendStatus(200);
		} catch (error) {
			console.error("Webhook Error:", error);
			return res.sendStatus(500);
		}
	}
}

export default new WhatsAppService();
