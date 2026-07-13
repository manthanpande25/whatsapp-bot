import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebase";
import { IOrganization } from "../interfaces/organization.interface";
import { COLLECTIONS } from "../constants/collections";


class OrganizationService {
  async createOrganization(
    ownerId: string,
    organizationData: IOrganization
  ) {
    try {
      const organizationRef = db
        .collection(COLLECTIONS.ORGANIZATIONS)
        .doc(ownerId);

      const existingOrganization = await organizationRef.get();

      if (existingOrganization.exists) {
        throw new Error("Organization already exists.");
      }

      await organizationRef.set({
        id: ownerId,
        ownerId,
        ...organizationData,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      await db.collection(COLLECTIONS.USERS).doc(ownerId).update({
        organizationId: ownerId,
      });

      return {
        success: true,
        message: "Organization created successfully.",
      };
    } catch (error) {
      throw error;
    }
  }

async getOrganization(ownerId: string): Promise<IOrganization>  {
    try {
      const organization = await db
        .collection(COLLECTIONS.ORGANIZATIONS)
        .doc(ownerId)
        .get();

      if (!organization.exists) {
        throw new Error("Organization not found.");
      }

      return organization.data() as IOrganization;
    } catch (error) {
      throw error;
    }
  }
}

export default new OrganizationService();