export interface ICustomer {
  id?: string;

  organizationId: string;

  name: string;

  phone: string;

  email?: string;

  status: "NEW" | "CONTACTED" | "QUALIFIED" | "CUSTOMER";

  tags?: string[];

  notes?: string;

  totalMessages: number;

  lastMessage: string;

  lastSeen?: any;

  createdAt?: any;
  updatedAt?: any;
}