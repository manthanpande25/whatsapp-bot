const API_URL = "http://localhost:5000/api";

export interface Message {
	id?: string;
	conversationId: string;
	sender: "CUSTOMER" | "HUMAN" | "AI";
	text: string;
	createdAt?: {
		_seconds: number;
		_nanoseconds: number;
	};
}

export async function getMessages(
	conversationId: string,
	token: string,
) {
	const response = await fetch(
		`${API_URL}/messages/${conversationId}`,
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
			data.message || "Failed to fetch messages",
		);
	}

	return data as {
		success: boolean;
		data: Message[];
	};
}


export async function sendHumanMessage(
	organizationId: string,
	conversationId: string,
	message: string,
	token: string,
) {
	const response = await fetch(
		`${API_URL}/messages/send`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				organizationId,
				conversationId,
				message,
			}),
		},
	);

	const data = await response.json();

	if (!response.ok) {
		throw new Error(
			data.message || "Failed to send message",
		);
	}

	return data;
}