 import { Response } from "express";

class SSEService {
	private clients = new Map<string, Set<Response>>();

	addClient(organizationId: string, res: Response) {
		if (!this.clients.has(organizationId)) {
			this.clients.set(organizationId, new Set());
		}

		this.clients.get(organizationId)!.add(res);

		res.on("close", () => {
			this.removeClient(organizationId, res);
		});
	}

	removeClient(organizationId: string, res: Response) {
		const clients = this.clients.get(organizationId);

		if (!clients) return;

		clients.delete(res);

		if (clients.size === 0) {
			this.clients.delete(organizationId);
		}
	}

	


	sendToOrganization(
	organizationId: string,
	event: string,
	data: any,
) {
	const clients = this.clients.get(organizationId);

	console.log(
		"📡 SSE clients:",
		clients?.size || 0,
		"organization:",
		organizationId,
	);

	if (!clients) return;

	const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;

	for (const client of clients) {
		client.write(payload);
	}
}
}

export default new SSEService();