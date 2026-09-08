import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebase";
import { IBooking } from "../interfaces/booking.interface";

const COLLECTION = "bookings";

const SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
];

class BookingService {
  async getAvailableSlots(
    organizationId: string,
    date: string
  ): Promise<string[]> {
    const snapshot = await db
      .collection(COLLECTION)
      .where("organizationId", "==", organizationId)
      .where("date", "==", date)
      .where("status", "in", ["PENDING", "CONFIRMED"])
      .get();

    const bookedSlots = new Set(
      snapshot.docs.map((doc) => doc.data().time)
    );

    return SLOTS.filter((slot) => !bookedSlots.has(slot));
  }

  async createBooking(
    data: Omit<IBooking, "id" | "createdAt" | "updatedAt">
  ): Promise<IBooking> {
    const bookingRef = db.collection(COLLECTION).doc();

    const existing = await db
      .collection(COLLECTION)
      .where("organizationId", "==", data.organizationId)
      .where("date", "==", data.date)
      .where("time", "==", data.time)
      .where("status", "in", ["PENDING", "CONFIRMED"])
      .limit(1)
      .get();

    if (!existing.empty) {
      throw new Error("This appointment slot is already booked");
    }

    await bookingRef.set({
      id: bookingRef.id,
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return {
      id: bookingRef.id,
      ...data,
    };
  }

  async getBookings(
    organizationId: string
  ): Promise<IBooking[]> {
    const snapshot = await db
      .collection(COLLECTION)
      .where("organizationId", "==", organizationId)
      .orderBy("date", "asc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IBooking[];
  }

  async getCustomerBookings(
    organizationId: string,
    customerPhone: string
  ): Promise<IBooking[]> {
    const snapshot = await db
      .collection(COLLECTION)
      .where("organizationId", "==", organizationId)
      .where("customerPhone", "==", customerPhone)
      .where("status", "in", ["PENDING", "CONFIRMED"])
      .orderBy("date", "asc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IBooking[];
  }

  async cancelBooking(bookingId: string) {
    await db
      .collection(COLLECTION)
      .doc(bookingId)
      .update({
        status: "CANCELLED",
        updatedAt: FieldValue.serverTimestamp(),
      });

    return {
      success: true,
      message: "Booking cancelled successfully",
    };
  }
}

export default new BookingService();