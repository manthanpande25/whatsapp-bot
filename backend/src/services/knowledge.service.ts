import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebase";
import { COLLECTIONS } from "../constants/collections";
import { IKnowledge } from "../interfaces/knowledge.interface";

class KnowledgeService {
  async addKnowledge(
    organizationId: string,
    knowledgeData: IKnowledge
  ) {
    try {
      const knowledgeRef = db
        .collection(COLLECTIONS.KNOWLEDGE)
        .doc();

      await knowledgeRef.set({
        id: knowledgeRef.id,
        organizationId,
        ...knowledgeData,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return {
        success: true,
        message: "Knowledge added successfully.",
      };
    } catch (error) {
      throw error;
    }
  }

  async getKnowledge(
  organizationId: string
): Promise<IKnowledge[]> {
    try {
      const snapshot = await db
        .collection(COLLECTIONS.KNOWLEDGE)
        .where("organizationId", "==", organizationId)
        .get();

      const knowledge = snapshot.docs.map(
  (doc) => doc.data() as IKnowledge
);

      return knowledge;
    } catch (error) {
      throw error;
    }
  }

  async updateKnowledge(
    knowledgeId: string,
    knowledgeData: Partial<IKnowledge>
  ) {
    try {
      await db
        .collection(COLLECTIONS.KNOWLEDGE)
        .doc(knowledgeId)
        .update({
          ...knowledgeData,
          updatedAt: FieldValue.serverTimestamp(),
        });

      return {
        success: true,
        message: "Knowledge updated successfully.",
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteKnowledge(knowledgeId: string) {
    try {
      await db
        .collection(COLLECTIONS.KNOWLEDGE)
        .doc(knowledgeId)
        .delete();

      return {
        success: true,
        message: "Knowledge deleted successfully.",
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new KnowledgeService();