import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import chatService from "../services/chat.service";
import conversationService from "../services/conversation.service";
import whatsappConnectionService from "../services/whatsapp-connection.service";
import whatsappService from "../services/whatsapp.service";

class ChatController {
	async sendMessage(req: AuthRequest, res: Response) {
		try {
			const ownerId = req.user!.userId;
			const { message } = req.body;

			if (!message) {
				return res.status(400).json({
					success: false,
					message: "Message is required.",
				});
			}

			const result = await chatService.sendMessage(
				ownerId,
				"manual-chat",
				message,
			);

			return res.status(200).json(result);
		} catch (error) {
			if (error instanceof Error) {
				return res.status(400).json({
					success: false,
					message: error.message,
				});
			}

			return res.status(500).json({
				success: false,
				message: "Internal Server Error",
			});
		}
	}

	async sendInboxMessage(req: AuthRequest, res: Response) {
	try {
		const {
			organizationId,
			conversationId,
			message,
		} = req.body;

		if (!organizationId || !conversationId || !message) {
			return res.status(400).json({
				success: false,
				message:
					"organizationId, conversationId and message are required.",
			});
		}

		const conversation =
			await conversationService.getConversationById(
				conversationId,
			);

		if (!conversation) {
			return res.status(404).json({
				success: false,
				message: "Conversation not found.",
			});
		}

		// Send owner's message to WhatsApp first
		const connection =
			await whatsappConnectionService.getByOrganizationId(
				organizationId,
			);

		await whatsappService.sendMessage(
			connection.accessToken,
			connection.phoneNumberId,
			conversation.customerPhone,
			message,
		);

		// Let AI process the same message
		const result = await chatService.sendMessage(
			organizationId,
			conversation.customerPhone,
			message,
		);

		// Send AI response to customer
		await whatsappService.sendMessage(
			connection.accessToken,
			connection.phoneNumberId,
			conversation.customerPhone,
			result.reply,
		);

		return res.status(200).json({
			success: true,
			data: {
				userMessage: message,
				aiReply: result.reply,
			},
		});
	} catch (error) {
		console.error("Inbox Message Error:", error);

		if (error instanceof Error) {
			return res.status(400).json({
				success: false,
				message: error.message,
			});
		}

		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
}
}




export default new ChatController();
