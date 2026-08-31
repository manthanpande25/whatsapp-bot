const API_URL = "http://localhost:5000/api";

export interface Conversation {
	id: string;
	organizationId: string;
	customerPhone: string;
	customerName?: string;
	lastMessage: string | null;
	lastMessageAt?: {
		_seconds: number;
		_nanoseconds: number;
	} | null;
	unreadCount: number;
	status: "OPEN" | "CLOSED";
    mode: "AI" | "HUMAN";
	createdAt?: {
		_seconds: number;
		_nanoseconds: number;
	};
	updatedAt?: {
		_seconds: number;
		_nanoseconds: number;
	};
}

export async function getConversations(
	organizationId: string,
	token: string,
) {
	const response = await fetch(
		`${API_URL}/conversations/organization/${organizationId}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	);

	const data = await response.json();

	if (!response.ok) {
		throw new Error(
			data.message || "Failed to fetch conversations",
		);
	}

	return data as {
		success: boolean;
		data: Conversation[];
	};
}

export async function updateConversationMode(
	conversationId: string,
	mode: "AI" | "HUMAN",
	token: string,
) {
	const response = await fetch(
		`${API_URL}/conversations/${conversationId}/mode`,
		{
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				mode,
			}),
		},
	);

	const data = await response.json();

	if (!response.ok) {
		throw new Error(
			data.message || "Failed to update conversation mode",
		);
	}

	return data;
}