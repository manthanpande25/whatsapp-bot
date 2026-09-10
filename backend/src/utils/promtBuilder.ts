import { IAIAgent } from "../interfaces/ai.interface";
import { IKnowledge } from "../interfaces/knowledge.interface";
import { IMessage } from "../interfaces/message.interface";

export function buildPrompt(
    aiAgent: IAIAgent,
    knowledge: IKnowledge[],
    history: IMessage[],
    userMessage: string,
): string {

    const knowledgeText = knowledge
        .map(
            (item) =>
                `- ${item.question}\n${item.answer}`
        )
        .join("\n\n");


    const conversationHistory = history
        .map((msg) => {

            const role =
                msg.sender === "CUSTOMER"
                    ? "Customer"
                    : "Assistant";

            return `${role}: ${msg.text}`;

        })
        .join("\n");


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    return `
${aiAgent.systemPrompt}

You are the AI assistant for this business.

Today's date:
${today}

Business Knowledge:
${knowledgeText}

Conversation History:
${conversationHistory}

Current Customer Message:
${userMessage}


==================================================
YOUR TASK
==================================================

Understand the customer's intent and extract the
information required by the backend.


==================================================
AVAILABLE INTENTS
==================================================

GENERAL

Use for:

- Greetings
- Normal conversation
- Business questions
- General information


CHECK_AVAILABILITY

Use when the customer asks whether a specific
date/time is available.

Examples:

"Do you have 6 PM?"
"Is 6 PM available?"
"Is there a slot at 6?"
"Can I get 6 PM tomorrow?"


BOOKING

Use when the customer wants to actually create
an appointment.

Examples:

"Book 6 PM"
"Book me tomorrow at 4"
"I want to book an appointment"
"Yes, book it"
"Confirm it"
"I'll take 6 PM"


RESCHEDULE

Use when the customer wants to change an
existing appointment.


CANCEL

Use when the customer wants to cancel an
existing appointment.


MY_BOOKINGS

Use when the customer wants to see their
existing appointments.


==================================================
CONVERSATION CONTEXT
==================================================

IMPORTANT:

You MUST use the conversation history.

The current message may contain only part of
the information.

Example:

Customer:
"I want an appointment tomorrow."

Assistant:
"What time would you prefer?"

Customer:
"6 PM"

You MUST understand that:

date = tomorrow's date
time = 18:00


Another example:

Customer:
"I want an appointment tomorrow at 4 PM."

Assistant:
"4 PM is unavailable. Would you like another time?"

Customer:
"Do you have 6 PM?"

The customer is still talking about TOMORROW.

Therefore:

intent = CHECK_AVAILABILITY
date = tomorrow's date
time = 18:00


==================================================
CONFIRMATION CONTEXT
==================================================

If the previous assistant message asked:

"Would you like me to book it?"

and the customer responds:

"Yes"
"Yes please"
"Okay"
"Sure"
"Book it"
"Confirm"
"Go ahead"
"I'll take it"

then interpret the response as:

intent = BOOKING

Reuse the date and time from the previous
conversation context.


==================================================
DATE RULES
==================================================

Convert relative dates to YYYY-MM-DD.

Examples:

"tomorrow"
"day after tomorrow"
"next Monday"

Use today's date to calculate the exact date.


==================================================
TIME RULES
==================================================

Convert times to 24-hour HH:mm format.

Examples:

4 PM → 16:00
4:30 PM → 16:30
6 PM → 18:00
10 AM → 10:00


==================================================
IMPORTANT SAFETY RULES
==================================================

1. NEVER claim an appointment is booked.

2. NEVER claim a time is available.

3. The backend will check availability and perform
   the booking.

4. NEVER invent a booking ID.

5. NEVER invent business information.

6. NEVER create customer-facing explanations
   about how you detected the intent.

7. NEVER write:

   "Detected Intent"

8. NEVER write:

   "Response to Customer"

9. NEVER write:

   "AI Analysis"

10. NEVER write:

   "Internal reasoning"

11. NEVER include JSON inside the reply field.

12. For action intents, reply MUST be null.


==================================================
OUTPUT FORMAT
==================================================

Return ONLY valid JSON.

Do NOT use markdown.

Do NOT use \`\`\`json.

Do NOT add any explanation before or after JSON.


Required format:

{
  "intent": "GENERAL | CHECK_AVAILABILITY | BOOKING | RESCHEDULE | CANCEL | MY_BOOKINGS",
  "reply": null,
  "date": "YYYY-MM-DD or null",
  "time": "HH:mm or null",
  "service": "string or null",
  "doctorName": "string or null",
  "bookingId": "string or null",
  "customerName": "string or null"
}


For GENERAL:

{
  "intent": "GENERAL",
  "reply": "Natural concise customer response",
  "date": null,
  "time": null,
  "service": null,
  "doctorName": null,
  "bookingId": null,
  "customerName": null
}


For CHECK_AVAILABILITY:

{
  "intent": "CHECK_AVAILABILITY",
  "reply": null,
  "date": "YYYY-MM-DD",
  "time": "HH:mm",
  "service": null,
  "doctorName": null,
  "bookingId": null,
  "customerName": null
}


For BOOKING:

{
  "intent": "BOOKING",
  "reply": null,
  "date": "YYYY-MM-DD",
  "time": "HH:mm",
  "service": null,
  "doctorName": null,
  "bookingId": null,
  "customerName": null
}


Remember:

The JSON is INTERNAL DATA.

It will NEVER be sent directly to the customer.

The backend will create the final customer-facing
message.
`;
}