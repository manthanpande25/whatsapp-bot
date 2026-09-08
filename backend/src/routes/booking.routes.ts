import { Router } from "express";
import bookingController from "../controllers/booking.controller";

const router = Router();


// --------------------------------------------------
// AVAILABILITY
// --------------------------------------------------

router.get(
  "/availability",
  bookingController.getAvailableSlots
);


// --------------------------------------------------
// CUSTOMER BOOKINGS
// --------------------------------------------------

router.get(
  "/customer/:organizationId/:phone",
  bookingController.getCustomerBookings
);


// --------------------------------------------------
// CREATE BOOKING
// --------------------------------------------------

router.post(
  "/",
  bookingController.createBooking
);


// --------------------------------------------------
// SINGLE BOOKING
// --------------------------------------------------

router.get(
  "/details/:bookingId",
  bookingController.getBookingById
);


// --------------------------------------------------
// RESCHEDULE
// --------------------------------------------------

router.patch(
  "/:bookingId/reschedule",
  bookingController.rescheduleBooking
);


// --------------------------------------------------
// CANCEL
// --------------------------------------------------

router.patch(
  "/:bookingId/cancel",
  bookingController.cancelBooking
);


// --------------------------------------------------
// ALL BOOKINGS
// --------------------------------------------------

router.get(
  "/:organizationId",
  bookingController.getBookings
);


export default router;