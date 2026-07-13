export interface IWhatsAppConnection {
  id?: string;

  organizationId: string;

  phoneNumberId: string;

  whatsappBusinessId: string;

  accessToken: string;

  displayPhoneNumber?: string;

  status: "CONNECTED" | "DISCONNECTED";

  createdAt?: any;
  updatedAt?: any;
}