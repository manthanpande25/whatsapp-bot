import { db } from "../config/firebase";
import { COLLECTIONS } from "../constants/collections";
import { IWhatsAppConnection } from "../interfaces/whatsapp-connection.interface";
import { FieldValue } from "firebase-admin/firestore";

class WhatsAppConnectionService {
  async createConnection(connection: IWhatsAppConnection) {
    const connectionRef = db
      .collection(COLLECTIONS.WHATSAPP_CONNECTIONS)
      .doc(connection.organizationId);

    const existingConnection = await connectionRef.get();

    if (existingConnection.exists) {
      throw new Error("WhatsApp connection already exists.");
    }

    await connectionRef.set({
      ...connection,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      message: "WhatsApp connected successfully.",
    };
  }

  async getByOrganizationId(
    organizationId: string
  ): Promise<IWhatsAppConnection> {
    const doc = await db
      .collection(COLLECTIONS.WHATSAPP_CONNECTIONS)
      .doc(organizationId)
      .get();

    if (!doc.exists) {
      throw new Error("WhatsApp connection not found.");
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as IWhatsAppConnection;
  }

  async getByPhoneNumberId(
    phoneNumberId: string
  ): Promise<IWhatsAppConnection> {
    console.log("Searching for:", phoneNumberId);

    const snapshot = await db
      .collection(COLLECTIONS.WHATSAPP_CONNECTIONS)
      .where("phoneNumberId", "==", String(phoneNumberId))
      .limit(1)
      .get();

    console.log("Matched Docs:", snapshot.size);

    if (!snapshot.empty) {
      console.log(snapshot.docs[0].data());
    }

    if (snapshot.empty) {
      throw new Error("WhatsApp connection not found.");
    }

    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data(),
    } as IWhatsAppConnection;
  }
}

export default new WhatsAppConnectionService();