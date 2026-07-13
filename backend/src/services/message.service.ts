import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebase";
import { COLLECTIONS } from "../constants/collections";
import { IMessage } from "../interfaces/message.interface";

class MessageService {
  async createMessage(message: IMessage) {
    const messageRef = db
      .collection(COLLECTIONS.CONVERSATIONS)
      .doc(message.conversationId)
      .collection("messages")
      .doc();

    await messageRef.set({
      id: messageRef.id,
      ...message,
      createdAt: FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      id: messageRef.id,
    };
  }

  async getRecentMessages(
    conversationId: string,
    limit: number = 10
  ): Promise<IMessage[]> {
    const snapshot = await db
      .collection(COLLECTIONS.CONVERSATIONS)
      .doc(conversationId)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    return snapshot.docs
      .map((doc) => doc.data() as IMessage)
      .reverse();
  }
}

export default new MessageService();