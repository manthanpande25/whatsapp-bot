import { Request, Response } from "express";
import organizationService from "../services/organization.service";
import { AuthRequest } from "../middleware/auth.middleware";

class OrganizationController {
  async createOrganization(req: AuthRequest, res: Response) {
    try {
      const ownerId = req.user!.userId;

      const result = await organizationService.createOrganization(
        ownerId,
        req.body
      );

      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }

  async getOrganization(req: AuthRequest, res: Response) {
    try {
      const ownerId = req.user!.userId;

      const organization = await organizationService.getOrganization(ownerId);

      return res.status(200).json({
        success: true,
        organization,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
}

export default new OrganizationController();