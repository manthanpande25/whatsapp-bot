export interface IBooking {
  id?: string;

  organizationId: string;

  customerId?: string;

  customerName: string;

  customerPhone: string;

  doctorName: string;

  service: string;

  date: string;

  time: string;

  status:
    | "PENDING"
    | "CONFIRMED"
    | "CANCELLED";

  createdAt?: any;

  updatedAt?: any;
}