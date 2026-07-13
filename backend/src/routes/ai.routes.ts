import { Router } from "express";
import aiController from "../controllers/ai.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/", verifyToken, aiController.createAIAgent);

router.get("/", verifyToken, aiController.getAIAgent);

router.put("/", verifyToken, aiController.updateAIAgent);

export default router;