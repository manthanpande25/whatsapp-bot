import { Router } from "express";
import bookingController from "../controllers/booking.controller";

const router = Router();

router.get(
  "/availability",
  bookingController.getAvailableSlots
);

router.get(
  "/customer/:organizationId/:phone",
  bookingController.getCustomerBookings
);

router.get(
  "/:organizationId",
  bookingController.getBookings
);

router.post(
  "/",
  bookingController.createBooking
);

router.patch(
  "/:bookingId/cancel",
  bookingController.cancelBooking
);

export default router;