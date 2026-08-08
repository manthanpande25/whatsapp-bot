export interface IMessage {
  id?: string;

  conversationId: string;

  sender: "CUSTOMER" | "HUMAN" | "AI";

  text: string;

  createdAt?: any;
}