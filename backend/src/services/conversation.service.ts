import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebase";
import { COLLECTIONS } from "../constants/collections";
import { IConversation } from "../interfaces/conversation.interface";
import customerService from "./customer.service";

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
			mode: "AI",
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

	async updateConversationMode(
		conversationId: string,
		mode: "AI" | "HUMAN"
	) {
		await db
			.collection(COLLECTIONS.CONVERSATIONS)
			.doc(conversationId)
			.update({
				mode,
				updatedAt: FieldValue.serverTimestamp(),
			});

		return this.getConversationById(conversationId);
	}

	async getConversations(
		organizationId: string
	): Promise<IConversation[]> {
		const snapshot = await db
			.collection(COLLECTIONS.CONVERSATIONS)
			.where("organizationId", "==", organizationId)
			.orderBy("updatedAt", "desc")
			.get();

		// Get customers
		const customers =
			await customerService.getCustomers(organizationId);

		// Create phone -> name map
		const customerMap = new Map(
			customers.map((customer) => [
				customer.phone,
				customer.name,
			])
		);

		// Add customer name to conversations
		return snapshot.docs.map((doc) => {
			const data = doc.data() as IConversation;

			return {
				id: doc.id,
				...data,
				customerName:
					customerMap.get(data.customerPhone) ||
					data.customerPhone,
			};
		});
	}

	async getConversationById(
		conversationId: string
	): Promise<IConversation | null> {
		const doc = await db
			.collection(COLLECTIONS.CONVERSATIONS)
			.doc(conversationId)
			.get();

		if (!doc.exists) {
			return null;
		}

		return {
			id: doc.id,
			...doc.data(),
		} as IConversation;
	}
}

export default new ConversationService();