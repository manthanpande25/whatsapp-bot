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
}

export default new ConversationController();