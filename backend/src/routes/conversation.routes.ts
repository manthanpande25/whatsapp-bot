import { Router } from "express";
import conversationController from "../controllers/conversation.controller";

const router = Router();

router.get(
	"/organization/:organizationId",
	conversationController.getConversations,
);


router.patch(
	"/:conversationId/mode",
	conversationController.updateMode,
);
export default router;