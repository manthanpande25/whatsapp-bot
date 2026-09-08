import { Request, Response } from "express";
import bookingService from "../services/booking.service";

class BookingController {
  async getBookings(req: Request, res: Response) {
    try {
      const organizationId =
  req.params.organizationId as string;

      const bookings =
        await bookingService.getBookings(organizationId);

      return res.status(200).json({
        success: true,
        data: bookings,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAvailableSlots(req: Request, res: Response) {
    try {
      const organizationId =
        req.query.organizationId as string;

      const date = req.query.date as string;

      if (!organizationId || !date) {
        return res.status(400).json({
          success: false,
          message: "organizationId and date are required",
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
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async createBooking(req: Request, res: Response) {
    try {
      const booking =
        await bookingService.createBooking(req.body);

      return res.status(201).json({
        success: true,
        data: booking,
      });
    } catch (error: any) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getCustomerBookings(req: Request, res: Response) {
    try {
      const organizationId =
  req.params.organizationId as string;

      const customerPhone =
        req.params.phone as string;

      const bookings =
        await bookingService.getCustomerBookings(
          organizationId,
          customerPhone
        );

      return res.status(200).json({
        success: true,
        data: bookings,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async cancelBooking(req: Request, res: Response) {
    try {
      const bookingId = req.params.bookingId as string;

      const result =
        await bookingService.cancelBooking(
          bookingId
        );

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new BookingController();