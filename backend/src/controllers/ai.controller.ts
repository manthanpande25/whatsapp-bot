import { Response } from "express";
import aiService from "../services/ai.service";
import organizationService from "../services/organization.service";
import { AuthRequest } from "../middleware/auth.middleware";

class AIController {
  async createAIAgent(req: AuthRequest, res: Response) {
    try {
      const ownerId = req.user!.userId;

      const organization = await organizationService.getOrganization(ownerId);

      const result = await aiService.createAIAgent(
        organization.id!,
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

  async getAIAgent(req: AuthRequest, res: Response) {
    try {
      const ownerId = req.user!.userId;

      const organization = await organizationService.getOrganization(ownerId);

      const aiAgent = await aiService.getAIAgent(
        organization.id!
      );

      return res.status(200).json({
        success: true,
        aiAgent,
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

  async updateAIAgent(req: AuthRequest, res: Response) {
    try {
      const ownerId = req.user!.userId;

      const organization = await organizationService.getOrganization(ownerId);

      const result = await aiService.updateAIAgent(
        organization.id!,
        req.body
      );

      return res.status(200).json(result);
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
}

export default new AIController();