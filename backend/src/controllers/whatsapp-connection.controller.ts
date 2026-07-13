import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import whatsappConnectionService from "../services/whatsapp-connection.service";

class WhatsAppConnectionController {
  async createConnection(req: AuthRequest, res: Response) {
    try {
      const organizationId = req.user!.userId;

      const result = await whatsappConnectionService.createConnection({
        organizationId,
        ...req.body,
      });

      return res.status(201).json(result);
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

export default new WhatsAppConnectionController();