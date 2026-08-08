import { Router } from "express";
import chatController from "../controllers/chat.controller";
import { verifyToken } from "../middleware/auth.middleware";

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

export default router;