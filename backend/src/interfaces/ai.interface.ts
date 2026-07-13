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