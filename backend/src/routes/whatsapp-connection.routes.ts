import { Router } from "express";
import whatsappConnectionController from "../controllers/whatsapp-connection.controller";
import {verifyToken} from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/connect",
  verifyToken,
  whatsappConnectionController.createConnection
);

export default router;