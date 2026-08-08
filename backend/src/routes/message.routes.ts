import { Router } from "express";
import messageController from "../controllers/message.controller";

const router = Router();

router.get(
	"/:conversationId",
	messageController.getMessages,
);

router.post(
	"/send",
	messageController.sendHumanMessage,
);

export default router;