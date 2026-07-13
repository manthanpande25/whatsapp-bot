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

Welcome Message:
${aiAgent.welcomeMessage}

Business Knowledge:
${knowledgeText}

Customer Message:
${userMessage}

Rules:
- Reply naturally.
- Use only the provided business knowledge.
- If the answer is not available, politely say you don't know and ask the customer to contact the business.
- Keep responses short and professional.
`;
}