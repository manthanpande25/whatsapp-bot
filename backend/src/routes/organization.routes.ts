import { Router } from "express";
import organizationController from "../controllers/organization.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

// Create Organization
router.post(
  "/",
  verifyToken,
  organizationController.createOrganization
);

// Get My Organization
router.get(
  "/me",
  verifyToken,
  organizationController.getOrganization
);

export default router;