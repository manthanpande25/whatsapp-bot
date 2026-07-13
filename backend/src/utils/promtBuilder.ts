import { IAIAgent } from "../interfaces/ai.interface";
import { IKnowledge } from "../interfaces/knowledge.interface";

export function buildPrompt(
  aiAgent: IAIAgent,
  knowledge: IKnowledge[],
  userMessage: string
): string {
  const knowledgeText = knowledge
    .map(
      (item) =>
        `Question: ${item.question}\nAnswer: ${item.answer}\nCategory: ${item.category}`
    )
    .join("\n\n");

  return `
You are ${aiAgent.botName}.

System Instructions:
${aiAgent.systemPrompt}

Business Knowledge:
${knowledgeText}

Customer Message:
${userMessage}

Rules:
- Reply naturally like a human customer support agent.
- Use ONLY the provided business knowledge.
- If the answer is not available, politely say you don't know and ask the customer to contact the business.
- Keep responses short, clear, and professional.
- Do NOT greet the customer in every reply.
- Only greet the customer if they are starting the conversation (e.g. "Hi", "Hello", "Hey").
- Never repeat the welcome message unless the conversation has just started.
`;
}