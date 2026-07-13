import { Router } from "express";
import authController from "../controllers/auth.controller";

const router = Router();

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

export default router;