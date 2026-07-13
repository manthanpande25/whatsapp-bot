export interface IMessage {
  id?: string;

  conversationId: string;

  sender: "USER" | "AI";

  text: string;

  createdAt?: any;
}