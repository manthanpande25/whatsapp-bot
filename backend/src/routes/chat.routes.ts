import { Router } from "express";
import chatController from "../controllers/chat.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/message",
  verifyToken,
  chatController.sendMessage
);

export default router;