import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebase";
import { IAIAgent } from "../interfaces/ai.interface";
import { COLLECTIONS } from "../constants/collections";

class AIService {
  async createAIAgent(
    organizationId: string,
    aiData: IAIAgent
  ) {
    try {
      const aiRef = db
        .collection(COLLECTIONS.AI_AGENTS)
        .doc(organizationId);

      const existingAgent = await aiRef.get();

      if (existingAgent.exists) {
        throw new Error("AI Agent already exists.");
      }

      await aiRef.set({
        id: organizationId,
        organizationId,
        ...aiData,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return {
        success: true,
        message: "AI Agent created successfully.",
      };
    } catch (error) {
      throw error;
    }
  }

  async getAIAgent(
  organizationId: string
): Promise<IAIAgent> {
    try {
      const aiAgent = await db
        .collection(COLLECTIONS.AI_AGENTS)
        .doc(organizationId)
        .get();

      if (!aiAgent.exists) {
        throw new Error("AI Agent not found.");
      }

      return aiAgent.data() as IAIAgent;
    } catch (error) {
      throw error;
    }
  }

  async updateAIAgent(
    organizationId: string,
    aiData: Partial<IAIAgent>
  ) {
    try {
      const aiRef = db
        .collection(COLLECTIONS.AI_AGENTS)
        .doc(organizationId);

      const existingAgent = await aiRef.get();

      if (!existingAgent.exists) {
        throw new Error("AI Agent not found.");
      }

      await aiRef.update({
        ...aiData,
        updatedAt: FieldValue.serverTimestamp(),
      });

      return {
        success: true,
        message: "AI Agent updated successfully.",
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new AIService();