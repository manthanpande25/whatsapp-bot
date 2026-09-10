export interface IAIAgent {
  botName: string;
  welcomeMessage: string;
  systemPrompt: string;

  model: string;
  language: string;
  temperature: number;

  autoReply: boolean;
  humanHandover: boolean;
  autoBooking: boolean;

  createdAt?: any;
  updatedAt?: any;
}


export type AIIntent =
  | "GENERAL"
  | "BOOKING"
  | "CHECK_AVAILABILITY"
  | "RESCHEDULE"
  | "CANCEL"
  | "MY_BOOKINGS";

export interface AIAgentAction {
  intent: AIIntent;

  reply?: string;

  date?: string;
  time?: string;

  service?: string;
  doctorName?: string;

  bookingId?: string;

  customerName?: string;

  // Important for conversational booking
  confirmationRequired?: boolean;
}