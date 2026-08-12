import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebase";
import { COLLECTIONS } from "../constants/collections";
import { IKnowledge } from "../interfaces/knowledge.interface";

class KnowledgeService {
	private knowledgeCache = new Map<string, IKnowledge[]>();

	async addKnowledge(
		organizationId: string,
		knowledgeData: IKnowledge,
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

			// Clear old cache
			this.knowledgeCache.delete(organizationId);

			return {
				success: true,
				message: "Knowledge added successfully.",
			};
		} catch (error) {
			throw error;
		}
	}

	async getKnowledge(
		organizationId: string,
	): Promise<IKnowledge[]> {
		try {
			// Check cache first
			const cachedKnowledge =
				this.knowledgeCache.get(organizationId);

			if (cachedKnowledge) {
				console.log(
					"🧠 Knowledge loaded from cache:",
					organizationId,
				);

				return cachedKnowledge;
			}

			console.log(
				"🔥 Knowledge loaded from Firestore:",
				organizationId,
			);

			const snapshot = await db
				.collection(COLLECTIONS.KNOWLEDGE)
				.where(
					"organizationId",
					"==",
					organizationId,
				)
				.get();

			const knowledge = snapshot.docs.map(
				(doc) => doc.data() as IKnowledge,
			);

			// Store in cache
			this.knowledgeCache.set(
				organizationId,
				knowledge,
			);

			return knowledge;
		} catch (error) {
			throw error;
		}
	}

	async updateKnowledge(
		knowledgeId: string,
		knowledgeData: Partial<IKnowledge>,
	) {
		try {
			const knowledgeRef = db
				.collection(COLLECTIONS.KNOWLEDGE)
				.doc(knowledgeId);

			const knowledgeDoc =
				await knowledgeRef.get();

			if (!knowledgeDoc.exists) {
				throw new Error(
					"Knowledge not found.",
				);
			}

			const organizationId =
				knowledgeDoc.data()?.organizationId;

			await knowledgeRef.update({
				...knowledgeData,
				updatedAt:
					FieldValue.serverTimestamp(),
			});

			if (organizationId) {
				this.knowledgeCache.delete(
					organizationId,
				);
			}

			return {
				success: true,
				message: "Knowledge updated successfully.",
			};
		} catch (error) {
			throw error;
		}
	}

	async deleteKnowledge(
		knowledgeId: string,
	) {
		try {
			const knowledgeRef = db
				.collection(COLLECTIONS.KNOWLEDGE)
				.doc(knowledgeId);

			const knowledgeDoc =
				await knowledgeRef.get();

			if (!knowledgeDoc.exists) {
				throw new Error(
					"Knowledge not found.",
				);
			}

			const organizationId =
				knowledgeDoc.data()?.organizationId;

			await knowledgeRef.delete();

			if (organizationId) {
				this.knowledgeCache.delete(
					organizationId,
				);
			}

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