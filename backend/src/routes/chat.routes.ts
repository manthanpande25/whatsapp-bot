import { Router } from "express";
import chatController from "../controllers/chat.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { verifySSEToken } from "../middleware/sse-auth.middleware";

const router = Router();

router.post(
  "/message",
  verifyToken,
  chatController.sendMessage
);

router.post(
	"/inbox-message",
	verifyToken,
	chatController.sendInboxMessage,
);

router.get(
	"/events",
	verifySSEToken,
	chatController.events,
);

export default router;