import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import organizationService from "../services/organization.service";
import knowledgeService from "../services/knowledge.service";

class KnowledgeController {
  async addKnowledge(req: AuthRequest, res: Response) {
    try {
      const ownerId = req.user!.userId;

      const organization = await organizationService.getOrganization(ownerId);

      const result = await knowledgeService.addKnowledge(
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

  async getKnowledge(req: AuthRequest, res: Response) {
    try {
      const ownerId = req.user!.userId;

      const organization = await organizationService.getOrganization(ownerId);

      const knowledge = await knowledgeService.getKnowledge(
        organization.id!
      );

      return res.status(200).json({
        success: true,
        knowledge,
      });
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

  async updateKnowledge(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);

      const result = await knowledgeService.updateKnowledge(
        id,
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

  async deleteKnowledge(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);

      const result = await knowledgeService.deleteKnowledge(id);

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

export default new KnowledgeController();