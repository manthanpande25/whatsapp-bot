import { Router } from "express";
import userController from "../controllers/user.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/profile", verifyToken, userController.getProfile);

export default router;