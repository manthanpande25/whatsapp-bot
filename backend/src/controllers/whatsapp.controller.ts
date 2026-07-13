import { Request, Response } from "express";
import whatsappService from "../services/whatsapp.service";

class WhatsAppController {
  async verifyWebhook(req: Request, res: Response) {
    return whatsappService.verifyWebhook(req, res);
  }

  async receiveWebhook(req: Request, res: Response) {
    return whatsappService.receiveWebhook(req, res);
  }
}

export default new WhatsAppController();