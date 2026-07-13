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
- Answer using the business knowledge.
- Use conversation history for context.
- Do not invent phone numbers, emails, addresses, or services.
- Do not add promotional or marketing text unless it exists in the knowledge base.
- Keep responses short and direct.
- If the answer is unknown, politely say you don't know.
`;
}