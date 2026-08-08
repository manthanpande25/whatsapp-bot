import { Request, Response } from "express";
import conversationService from "../services/conversation.service";

class ConversationController {
	async getConversations(req: Request, res: Response) {
		try {
			const organizationId = req.params.organizationId as string;

			const conversations =
				await conversationService.getConversations(
					organizationId,
				);

			return res.status(200).json({
				success: true,
				data: conversations,
			});
		} catch (error: any) {
			console.error("Get Conversations Error:", error);

			return res.status(500).json({
				success: false,
				message: error.message || "Failed to fetch conversations",
			});
		}
	}

    async updateMode(req: Request, res: Response) {
	try {
		const conversationId = req.params.conversationId as string;
		const { mode } = req.body;

		if (mode !== "AI" && mode !== "HUMAN") {
			return res.status(400).json({
				success: false,
				message: "Mode must be AI or HUMAN",
			});
		}

		const conversation =
			await conversationService.updateConversationMode(
				conversationId,
				mode,
			);

		return res.status(200).json({
			success: true,
			data: conversation,
		});
	} catch (error: any) {
		console.error("Update Conversation Mode Error:", error);

		return res.status(500).json({
			success: false,
			message:
				error.message || "Failed to update conversation mode",
		});
	}
}
}

export default new ConversationController();