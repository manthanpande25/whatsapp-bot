import { IAIAgent } from "../interfaces/ai.interface";
import { IKnowledge } from "../interfaces/knowledge.interface";
import { IMessage } from "../interfaces/message.interface";

export function buildPrompt(
  aiAgent: IAIAgent,
  knowledge: IKnowledge[],
  history: IMessage[],
  userMessage: string
): string {
  const knowledgeText = knowledge
    .map((item) => `- ${item.question}\n${item.answer}`)
    .join("\n\n");

  const conversationHistory = history
    .map((msg) => {
      const role = msg.sender === "USER" ? "Customer" : "Assistant";
      return `${role}: ${msg.text}`;
    })
    .join("\n");

  return `
${aiAgent.systemPrompt}

Business Knowledge:
${knowledgeText}

Conversation History:
${conversationHistory}

Current Customer Message:
${userMessage}


Rules:

- Answer only what the customer asks.
- Keep replies concise.
- Do not provide phone numbers, email addresses, addresses, prices, or timings unless the customer specifically asks.
- Do not invent business information.
- Do not add promotional text.
- Never assume the customer needs additional details.
- If greeted with "Hi", "Hello", or "Hey", simply greet the customer and ask how you can help.
`;
}