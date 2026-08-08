import { Request, Response } from "express";
import messageService from "../services/message.service";
import conversationService from "../services/conversation.service";
import whatsappService from "../services/whatsapp.service";

class MessageController {
	async getMessages(req: Request, res: Response) {
		try {
			const conversationId = req.params.conversationId as string;

			const messages = await messageService.getRecentMessages(
				conversationId,
				50,
			);

			return res.status(200).json({
				success: true,
				data: messages,
			});
		} catch (error: any) {
			console.error("Get Messages Error:", error);

			return res.status(500).json({
				success: false,
				message: error.message || "Failed to fetch messages",
			});
		}

        
	}

    async sendHumanMessage(req: Request, res: Response) {
	try {
		const { organizationId, conversationId, message } = req.body;

		if (!organizationId || !conversationId || !message) {
			return res.status(400).json({
				success: false,
				message:
					"organizationId, conversationId and message are required",
			});
		}

		const conversation =
			await conversationService.getConversationById(
				conversationId,
			);

		if (!conversation) {
			return res.status(404).json({
				success: false,
				message: "Conversation not found",
			});
		}

		const whatsappResult =
			await whatsappService.sendHumanMessage(
				organizationId,
				conversation.customerPhone,
				message,
			);

		await messageService.createMessage({
			conversationId,
			sender: "HUMAN",
			text: message,
		});

		await conversationService.updateConversation(
			conversationId,
			message,
		);

		return res.status(200).json({
			success: true,
			data: {
				message,
				whatsapp: whatsappResult,
			},
		});
	} catch (error: any) {
		console.error("Send Human Message Error:", error);

		return res.status(500).json({
			success: false,
			message: error.message || "Failed to send message",
		});
	}
}
}

export default new MessageController();