import {
    AIAgentAction,
    AIIntent,
} from "../interfaces/ai.interface";

export function parseAIAction(
    response: string
): AIAgentAction {

    try {

        let cleaned = response.trim();

        // Remove markdown code fences
        cleaned = cleaned
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        // --------------------------------------------------
        // FIX COMMON AI JSON MISTAKE
        // Example:
        // "customerName":null"
        // becomes:
        // "customerName":null
        // --------------------------------------------------

        cleaned = cleaned.replace(
            /(null|true|false)\s*"\s*}$/i,
            "$1}"
        );

        const parsed = JSON.parse(cleaned);

        const validIntents: AIIntent[] = [
            "GENERAL",
            "CHECK_AVAILABILITY",
            "BOOKING",
            "RESCHEDULE",
            "CANCEL",
            "MY_BOOKINGS",
        ];

        const intent: AIIntent =
            validIntents.includes(parsed.intent)
                ? parsed.intent
                : "GENERAL";

        const reply =
            intent === "GENERAL"
                ? cleanCustomerReply(parsed.reply)
                : undefined;

        const result: AIAgentAction = {
            intent,
            reply,
            date: parsed.date || undefined,
            time: parsed.time || undefined,
            service: parsed.service || undefined,
            doctorName: parsed.doctorName || undefined,
            bookingId: parsed.bookingId || undefined,
            customerName: parsed.customerName || undefined,
        };

        console.log("🧠 Parsed AI Action:", result);

        return result;

    } catch (error) {

        console.error("❌ Failed to parse AI action");
        console.error("Raw AI response:", response);

        // --------------------------------------------------
        // SAFE FALLBACK
        // Never send raw JSON to the customer.
        // --------------------------------------------------

        const replyMatch = response.match(
            /"reply"\s*:\s*"((?:\\.|[^"\\])*)"/i
        );

        if (replyMatch) {

            let extractedReply = replyMatch[1];

            try {
                extractedReply = JSON.parse(
                    `"${extractedReply}"`
                );
            } catch {
                // Keep extracted text if unescaping fails
            }

            return {
                intent: "GENERAL",
                reply: cleanCustomerReply(extractedReply),
            };
        }

        return {
            intent: "GENERAL",
            reply: "Sorry, I didn't quite understand that. How can I help you?",
        };
    }
}


// ==========================================================
// CLEAN CUSTOMER RESPONSE
// ==========================================================

function cleanCustomerReply(
    reply: unknown
): string {

    if (typeof reply !== "string") {
        return "How can I help you?";
    }

    let cleaned = reply.trim();

    // Remove markdown code fences
    cleaned = cleaned
        .replace(/^```[\w]*\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

    // Remove internal labels
    cleaned = cleaned.replace(
        /^\*?Detected Intent:\*?\s*[A-Z_]+\s*/i,
        ""
    );

    cleaned = cleaned.replace(
        /^\*?Response to Customer\*?\s*/i,
        ""
    );

    cleaned = cleaned.replace(
        /^\*?Response:\*?\s*/i,
        ""
    );

    return cleaned || "How can I help you?";
}