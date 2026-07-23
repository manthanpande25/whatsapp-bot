import { Request, Response } from "express";
import customerService from "../services/customer.service";

class CustomerController {
  async getCustomers(req: Request, res: Response) {
    try {
      const organizationId = req.params.organizationId as string;

      const customers = await customerService.getCustomers(organizationId);

      return res.status(200).json({
        success: true,
        data: customers,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getCustomerById(req: Request, res: Response) {
    try {
      const customerId = req.params.customerId as string;

      const customer = await customerService.getCustomerById(customerId);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: customer,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateCustomer(req: Request, res: Response) {
    try {
      const customerId = req.params.customerId as string;

      const customer = await customerService.updateCustomer(
        customerId,
        req.body
      );

      return res.status(200).json({
        success: true,
        data: customer,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new CustomerController();