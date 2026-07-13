import { Router } from "express";
import whatsappController from "../controllers/whatsapp.controller";

const router = Router();

router.get("/webhook", whatsappController.verifyWebhook);

router.post("/webhook", whatsappController.receiveWebhook);

export default router;