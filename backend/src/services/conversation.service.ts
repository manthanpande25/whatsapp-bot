import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebase";
import { COLLECTIONS } from "../constants/collections";
import { IConversation } from "../interfaces/conversation.interface";

class ConversationService {
  async getOrCreateConversation(
    organizationId: string,
    customerPhone: string
  ): Promise<IConversation> {
    const snapshot = await db
      .collection(COLLECTIONS.CONVERSATIONS)
      .where("organizationId", "==", organizationId)
      .where("customerPhone", "==", customerPhone)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      return {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data(),
      } as IConversation;
    }

    const conversationRef = db
      .collection(COLLECTIONS.CONVERSATIONS)
      .doc();

    const conversation: IConversation = {
      id: conversationRef.id,
      organizationId,
      customerPhone,
      lastMessage: "",
      unreadCount: 0,
      status: "OPEN",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await conversationRef.set(conversation);

    return conversation;
  }


  async updateConversation(
  conversationId: string,
  lastMessage: string
) {
  await db
    .collection(COLLECTIONS.CONVERSATIONS)
    .doc(conversationId)
    .update({
      lastMessage,
      lastMessageAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
}
}

export default new ConversationService();