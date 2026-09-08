import { Request, Response } from "express";
import bookingService from "../services/booking.service";

class BookingController {

  // --------------------------------------------------
  // GET ALL BOOKINGS
  // --------------------------------------------------

  async getBookings(
    req: Request,
    res: Response
  ) {

    try {

      const organizationId =
        req.params.organizationId as string;

      const bookings =
        await bookingService.getBookings(
          organizationId
        );

      return res.status(200).json({
        success: true,
        data: bookings,
      });

    } catch (error: any) {

      console.error(
        "Get Bookings Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to fetch bookings",
      });
    }
  }


  // --------------------------------------------------
  // GET AVAILABLE SLOTS
  // --------------------------------------------------

  async getAvailableSlots(
    req: Request,
    res: Response
  ) {

    try {

      const organizationId =
        req.query.organizationId as string;

      const date =
        req.query.date as string;


      if (
        !organizationId ||
        !date
      ) {

        return res.status(400).json({
          success: false,
          message:
            "organizationId and date are required",
        });
      }


      const slots =
        await bookingService.getAvailableSlots(
          organizationId,
          date
        );


      return res.status(200).json({
        success: true,
        data: slots,
      });

    } catch (error: any) {

      console.error(
        "Availability Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to fetch availability",
      });
    }
  }


  // --------------------------------------------------
  // GET SINGLE BOOKING
  // --------------------------------------------------

  async getBookingById(
    req: Request,
    res: Response
  ) {

    try {

      const bookingId =
        req.params.bookingId as string;


      const booking =
        await bookingService.getBookingById(
          bookingId
        );


      if (!booking) {

        return res.status(404).json({
          success: false,
          message:
            "Booking not found",
        });
      }


      return res.status(200).json({
        success: true,
        data: booking,
      });

    } catch (error: any) {

      console.error(
        "Get Booking Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to fetch booking",
      });
    }
  }


  // --------------------------------------------------
  // CREATE BOOKING
  // --------------------------------------------------

  async createBooking(
    req: Request,
    res: Response
  ) {

    try {

      const booking =
        await bookingService.createBooking(
          req.body
        );


      return res.status(201).json({
        success: true,
        data: booking,
        message:
          "Booking created successfully",
      });

    } catch (error: any) {

      console.error(
        "Create Booking Error:",
        error
      );


      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Failed to create booking",
      });
    }
  }


  // --------------------------------------------------
  // CUSTOMER BOOKINGS
  // --------------------------------------------------

  async getCustomerBookings(
    req: Request,
    res: Response
  ) {

    try {

      const organizationId =
        req.params.organizationId as string;

      const phone =
        req.params.phone as string;


      const bookings =
        await bookingService.getCustomerBookings(
          organizationId,
          phone
        );


      return res.status(200).json({
        success: true,
        data: bookings,
      });

    } catch (error: any) {

      console.error(
        "Customer Bookings Error:",
        error
      );


      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to fetch customer bookings",
      });
    }
  }


  // --------------------------------------------------
  // CANCEL BOOKING
  // --------------------------------------------------

  async cancelBooking(
    req: Request,
    res: Response
  ) {

    try {

      const bookingId =
        req.params.bookingId as string;


      const result =
        await bookingService.cancelBooking(
          bookingId
        );


      return res.status(200).json(
        result
      );

    } catch (error: any) {

      console.error(
        "Cancel Booking Error:",
        error
      );


      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Failed to cancel booking",
      });
    }
  }


  // --------------------------------------------------
  // RESCHEDULE BOOKING
  // --------------------------------------------------

  async rescheduleBooking(
    req: Request,
    res: Response
  ) {

    try {

      const bookingId =
        req.params.bookingId as string;

      const {
        date,
        time,
      } = req.body;


      if (!date || !time) {

        return res.status(400).json({
          success: false,
          message:
            "date and time are required",
        });
      }


      const booking =
        await bookingService.rescheduleBooking(
          bookingId,
          date,
          time
        );


      return res.status(200).json({
        success: true,
        data: booking,
        message:
          "Booking rescheduled successfully",
      });

    } catch (error: any) {

      console.error(
        "Reschedule Booking Error:",
        error
      );


      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Failed to reschedule booking",
      });
    }
  }
}

export default new BookingController();