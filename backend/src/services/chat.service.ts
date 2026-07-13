import organizationService from "./organization.service";
import aiService from "./ai.service";
import knowledgeService from "./knowledge.service";

import openRouterService from "./providers/openrouter.service";
import { buildPrompt } from "../utils/promtBuilder";

class ChatService {
  async sendMessage(ownerId: string, message: string) {
    try {
      // Get Organization
      const organization =
        await organizationService.getOrganization(ownerId);

      if (!organization) {
        throw new Error("Organization not found.");
      }

      // Get AI Agent
      const aiAgent =
        await aiService.getAIAgent(organization.id!);

      if (!aiAgent) {
        throw new Error("AI Agent not found.");
      }

      // Get Knowledge Base
      const knowledge =
        await knowledgeService.getKnowledge(organization.id!);

      // Build Prompt
      const prompt = buildPrompt(
        aiAgent,
        knowledge,
        message
      );

      // Generate AI Response
      const reply =
        await openRouterService.generateResponse(prompt);

      return {
        success: true,
        reply,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new ChatService();