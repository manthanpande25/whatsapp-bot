import { Router } from "express";
import customerController from "../controllers/customer.controller";

const router = Router();

// Get all customers of an organization
router.get("/:organizationId", customerController.getCustomers);

// Get single customer
router.get("/details/:customerId", customerController.getCustomerById);

// Update customer
router.patch("/:customerId", customerController.updateCustomer);

export default router;