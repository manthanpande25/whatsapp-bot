import { Router } from "express";
import knowledgeController from "../controllers/knowledge.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/", verifyToken, knowledgeController.addKnowledge);

router.get("/", verifyToken, knowledgeController.getKnowledge);

router.put("/:id", verifyToken, knowledgeController.updateKnowledge);

router.delete("/:id", verifyToken, knowledgeController.deleteKnowledge);

export default router;