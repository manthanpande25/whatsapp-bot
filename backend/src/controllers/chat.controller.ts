import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import chatService from "../services/chat.service";

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
        message
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
}

export default new ChatController();