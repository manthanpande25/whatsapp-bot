export interface IBooking {
  id?: string;
  organizationId: string;

  customerId?: string;
  customerName: string;
  customerPhone: string;

  doctorName: string;
  service: string;

  date: string; // YYYY-MM-DD
  time: string; // HH:mm

  status: "PENDING" | "CONFIRMED" | "CANCELLED";

  createdAt?: any;
  updatedAt?: any;
}