import { Request, Response } from "express";
import messageService from "../services/message.service";

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
}

export default new MessageController();