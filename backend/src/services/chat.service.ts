import organizationService from "./organization.service";
import aiService from "./ai.service";
import knowledgeService from "./knowledge.service";
import conversationService from "./conversation.service";
import messageService from "./message.service";

import openRouterService from "./providers/openrouter.service";
import { buildPrompt } from "../utils/promtBuilder";

class ChatService {
  async sendMessage(
    organizationId: string,
    customerPhone: string,
    message: string
  ) {
    try {
      await organizationService.getOrganization(organizationId);

      const conversation =
        await conversationService.getOrCreateConversation(
          organizationId,
          customerPhone
        );

      // Get previous conversation
      const history = await messageService.getRecentMessages(
        conversation.id!,
        10
      );

      // Save current user message
      await messageService.createMessage({
        conversationId: conversation.id!,
        sender: "USER",
        text: message,
      });

      const aiAgent = await aiService.getAIAgent(organizationId);

      const knowledge =
        await knowledgeService.getKnowledge(organizationId);

      const prompt = buildPrompt(
        aiAgent,
        knowledge,
        history,
        message
      );

      const reply =
        await openRouterService.generateResponse(prompt);

      await messageService.createMessage({
        conversationId: conversation.id!,
        sender: "AI",
        text: reply,
      });

      await conversationService.updateConversation(
        conversation.id!,
        reply
      );

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