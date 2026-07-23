import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebase";
import { COLLECTIONS } from "../constants/collections";
import { ICustomer } from "../interfaces/customer.interface";

class CustomerService {
  async findByPhone(
    organizationId: string,
    phone: string
  ): Promise<ICustomer | null> {
    const snapshot = await db
      .collection(COLLECTIONS.CUSTOMERS)
      .where("organizationId", "==", organizationId)
      .where("phone", "==", phone)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data(),
    } as ICustomer;
  }

  async createCustomer(
    organizationId: string,
    phone: string
  ): Promise<ICustomer> {
    const customerRef = db
      .collection(COLLECTIONS.CUSTOMERS)
      .doc();

    const customer: ICustomer = {
      id: customerRef.id,
      organizationId,

      name: phone,
      phone,

      status: "NEW",

      totalMessages: 0,

      lastMessage: "",

      tags: [],

      notes: "",

      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await customerRef.set(customer);

    return customer;
  }

  async updateLastInteraction(
    customerId: string,
    lastMessage: string
  ) {
    await db
      .collection(COLLECTIONS.CUSTOMERS)
      .doc(customerId)
      .update({
        lastMessage,
        lastSeen: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        totalMessages: FieldValue.increment(1),
      });
  }

  async getCustomers(organizationId: string) {
    const snapshot = await db
      .collection(COLLECTIONS.CUSTOMERS)
      .where("organizationId", "==", organizationId)
      .orderBy("updatedAt", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async getCustomerById(customerId: string) {
    const customerDoc = await db
      .collection(COLLECTIONS.CUSTOMERS)
      .doc(customerId)
      .get();

    if (!customerDoc.exists) {
      return null;
    }

    return {
      id: customerDoc.id,
      ...customerDoc.data(),
    };
  }

  async updateCustomer(
    customerId: string,
    data: Partial<ICustomer>
  ) {
    await db
      .collection(COLLECTIONS.CUSTOMERS)
      .doc(customerId)
      .update({
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      });

    return this.getCustomerById(customerId);
  }
}

export default new CustomerService();