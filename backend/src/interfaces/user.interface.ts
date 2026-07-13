export interface IUser {
  id?: string;

  name: string;
  email: string;
  password: string;

  role?: "OWNER" | "ADMIN" | "AGENT";

  organizationId?: string;

  createdAt?: any;
  updatedAt?: any;
}