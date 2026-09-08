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

  // --------------------------------------------------
  // GET AVAILABLE SLOTS
  // --------------------------------------------------

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

    return SLOTS.filter(
      (slot) => !bookedSlots.has(slot)
    );
  }


  // --------------------------------------------------
  // CREATE BOOKING
  // --------------------------------------------------

  async createBooking(
    data: Omit<
      IBooking,
      "id" | "createdAt" | "updatedAt"
    >
  ): Promise<IBooking> {

    // Check whether slot is already booked

    const existing = await db
      .collection(COLLECTION)
      .where(
        "organizationId",
        "==",
        data.organizationId
      )
      .where("date", "==", data.date)
      .where("time", "==", data.time)
      .where(
        "status",
        "in",
        ["PENDING", "CONFIRMED"]
      )
      .limit(1)
      .get();

    if (!existing.empty) {
      throw new Error(
        "This appointment slot is already booked"
      );
    }

    const bookingRef =
      db.collection(COLLECTION).doc();

    await bookingRef.set({
      id: bookingRef.id,
      ...data,
      createdAt:
        FieldValue.serverTimestamp(),
      updatedAt:
        FieldValue.serverTimestamp(),
    });

    return {
      id: bookingRef.id,
      ...data,
    };
  }


  // --------------------------------------------------
  // GET ALL BOOKINGS
  // --------------------------------------------------

  async getBookings(
    organizationId: string
  ): Promise<IBooking[]> {

    const snapshot = await db
      .collection(COLLECTION)
      .where(
        "organizationId",
        "==",
        organizationId
      )
      .orderBy("date", "asc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IBooking[];
  }


  // --------------------------------------------------
  // GET SINGLE BOOKING
  // --------------------------------------------------

  async getBookingById(
    bookingId: string
  ): Promise<IBooking | null> {

    const doc = await db
      .collection(COLLECTION)
      .doc(bookingId)
      .get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as IBooking;
  }


  // --------------------------------------------------
  // GET CUSTOMER BOOKINGS
  // --------------------------------------------------

  async getCustomerBookings(
    organizationId: string,
    customerPhone: string
  ): Promise<IBooking[]> {

    const snapshot = await db
      .collection(COLLECTION)
      .where(
        "organizationId",
        "==",
        organizationId
      )
      .where(
        "customerPhone",
        "==",
        customerPhone
      )
      .where(
        "status",
        "in",
        ["PENDING", "CONFIRMED"]
      )
      .orderBy("date", "asc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IBooking[];
  }


  // --------------------------------------------------
  // CANCEL BOOKING
  // --------------------------------------------------

  async cancelBooking(
    bookingId: string
  ) {

    const bookingRef =
      db.collection(COLLECTION).doc(bookingId);

    const booking =
      await bookingRef.get();

    if (!booking.exists) {
      throw new Error(
        "Booking not found"
      );
    }

    await bookingRef.update({
      status: "CANCELLED",
      updatedAt:
        FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      message:
        "Booking cancelled successfully",
    };
  }


  // --------------------------------------------------
  // RESCHEDULE BOOKING
  // --------------------------------------------------

  async rescheduleBooking(
    bookingId: string,
    newDate: string,
    newTime: string
  ): Promise<IBooking> {

    const bookingRef =
      db.collection(COLLECTION).doc(bookingId);

    const bookingSnapshot =
      await bookingRef.get();

    if (!bookingSnapshot.exists) {
      throw new Error(
        "Booking not found"
      );
    }

    const currentBooking =
      bookingSnapshot.data() as IBooking;

    // Don't allow rescheduling cancelled booking

    if (
      currentBooking.status ===
      "CANCELLED"
    ) {
      throw new Error(
        "Cancelled booking cannot be rescheduled"
      );
    }


    // Check new slot

    const existing =
      await db
        .collection(COLLECTION)
        .where(
          "organizationId",
          "==",
          currentBooking.organizationId
        )
        .where(
          "date",
          "==",
          newDate
        )
        .where(
          "time",
          "==",
          newTime
        )
        .where(
          "status",
          "in",
          ["PENDING", "CONFIRMED"]
        )
        .limit(1)
        .get();


    // If the existing booking is the same booking,
    // allow it.

    const conflict = existing.docs.some(
      (doc) => doc.id !== bookingId
    );

    if (conflict) {
      throw new Error(
        "This appointment slot is already booked"
      );
    }


    await bookingRef.update({
      date: newDate,
      time: newTime,
      updatedAt:
        FieldValue.serverTimestamp(),
    });


    return {
      ...currentBooking,
      id: bookingId,
      date: newDate,
      time: newTime,
    };
  }
}

export default new BookingService();