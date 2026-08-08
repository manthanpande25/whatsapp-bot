export interface IConversation {
	id?: string;

	organizationId: string;

	customerPhone: string;

	lastMessage: string;

	lastMessageAt?: any;

	unreadCount: number;

	status: "OPEN" | "CLOSED";

	mode: "AI" | "HUMAN";

	createdAt?: any;

	updatedAt?: any;
}