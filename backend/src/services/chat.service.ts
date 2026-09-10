import organizationService from "./organization.service";
import aiService from "./ai.service";
import knowledgeService from "./knowledge.service";
import conversationService from "./conversation.service";
import messageService from "./message.service";
import customerService from "./customer.service";
import sseService from "./sse.service";
import openRouterService from "./providers/openrouter.service";
import bookingService from "./booking.service";

import { buildPrompt } from "../utils/promtBuilder";
import { parseAIAction } from "../utils/aiActionParser";

import { IMessage } from "../interfaces/message.interface";
import {
    AIAgentAction,
} from "../interfaces/ai.interface";


class ChatService {

    // ==========================================================
    // SEND MESSAGE
    // ==========================================================

    async sendMessage(
        organizationId: string,
        customerPhone: string,
        message: string,
    ) {

        try {

            // ==================================================
            // 1. GET ORGANIZATION
            // ==================================================

            await organizationService.getOrganization(
                organizationId
            );


            // ==================================================
            // 2. FIND / CREATE CUSTOMER
            // ==================================================

            let customer =
                await customerService.findByPhone(
                    organizationId,
                    customerPhone
                );


            if (!customer) {

                customer =
                    await customerService.createCustomer(
                        organizationId,
                        customerPhone
                    );

            }


            // ==================================================
            // 3. GET / CREATE CONVERSATION
            // ==================================================

            const conversation =
                await conversationService.getOrCreateConversation(
                    organizationId,
                    customerPhone
                );


            // ==================================================
            // 4. UPDATE CUSTOMER LAST INTERACTION
            // ==================================================

            await customerService.updateLastInteraction(
                customer.id!,
                message
            );


            // ==================================================
            // 5. GET RECENT CONVERSATION HISTORY
            // ==================================================

            // IMPORTANT:
            // We already need this for AI.
            // We will also use it to maintain conversational
            // booking context without another Firestore read.

            const history =
                await messageService.getRecentMessages(
                    conversation.id!,
                    10
                );


            // ==================================================
            // 6. SAVE CUSTOMER MESSAGE
            // ==================================================

            await messageService.createMessage({

                conversationId:
                    conversation.id!,

                sender:
                    "CUSTOMER",

                text:
                    message,

            });


            // ==================================================
            // 7. SEND CUSTOMER MESSAGE THROUGH SSE
            // ==================================================

            sseService.sendToOrganization(

                organizationId,

                "new_message",

                {

                    conversationId:
                        conversation.id!,

                    sender:
                        "CUSTOMER",

                    text:
                        message,

                }

            );


            console.log(
                "📡 SSE: Customer message sent immediately"
            );


            // ==================================================
            // 8. GET AI AGENT
            // ==================================================

            const aiAgent =
                await aiService.getAIAgent(
                    organizationId
                );


            // ==================================================
            // 9. GET KNOWLEDGE BASE
            // ==================================================

            const knowledge =
                await knowledgeService.getKnowledge(
                    organizationId
                );


            // ==================================================
            // 10. BUILD PROMPT
            // ==================================================

            const prompt =
                buildPrompt(

                    aiAgent,

                    knowledge,

                    history,

                    message

                );


            // ==================================================
            // 11. CALL AI
            // ==================================================

            const aiRawResponse =
                await openRouterService.generateResponse(
                    prompt
                );


            console.log(
                "🤖 AI Raw Response:",
                aiRawResponse
            );


            // ==================================================
            // 12. PARSE AI ACTION
            // ==================================================

            let action:
                AIAgentAction =
                parseAIAction(
                    aiRawResponse
                );


            console.log(
                "🧠 AI Action:",
                action
            );


            // ==================================================
            // 13. RESOLVE CONTEXT FROM EXISTING HISTORY
            // ==================================================

            action =
                this.resolveConversationContext(
                    action,
                    history,
                    message
                );


            console.log(
                "🧠 Resolved AI Action:",
                action
            );


            // ==================================================
            // 14. GENERAL
            // ==================================================

            if (
                action.intent ===
                "GENERAL"
            ) {

                const reply =
                    action.reply ||
                    "How can I help you?";


                return await this.finishResponse(

                    organizationId,

                    conversation.id!,

                    reply

                );

            }


            // ==================================================
            // 15. CHECK AVAILABILITY
            // ==================================================

            if (
                action.intent ===
                "CHECK_AVAILABILITY"
            ) {

                return await this.handleAvailabilityCheck(

                    organizationId,

                    conversation.id!,

                    action

                );

            }


            // ==================================================
            // 16. BOOKING
            // ==================================================

            if (
                action.intent ===
                "BOOKING"
            ) {

                return await this.handleBooking(

                    organizationId,

                    conversation.id!,

                    customer,

                    customerPhone,

                    action

                );

            }


            // ==================================================
            // 17. MY BOOKINGS
            // ==================================================

            if (
                action.intent ===
                "MY_BOOKINGS"
            ) {

                const bookings =
                    await bookingService.getCustomerBookings(

                        organizationId,

                        customerPhone

                    );


                if (
                    bookings.length === 0
                ) {

                    const reply =
                        "You don't have any upcoming appointments.";


                    return await this.finishResponse(

                        organizationId,

                        conversation.id!,

                        reply

                    );

                }


                const reply =
                    "📅 Your upcoming appointments:\n\n" +

                    bookings
                        .slice(0, 5)
                        .map(

                            (booking, index) =>

                                `${index + 1}. ${booking.date} at ${booking.time}\n` +
                                `👨‍⚕️ ${booking.doctorName}\n` +
                                `🦷 ${booking.service}`

                        )
                        .join("\n\n");


                return await this.finishResponse(

                    organizationId,

                    conversation.id!,

                    reply

                );

            }


            // ==================================================
            // 18. CANCEL
            // ==================================================

            if (
                action.intent ===
                "CANCEL"
            ) {

                return await this.handleCancel(

                    organizationId,

                    conversation.id!,

                    customerPhone,

                    action

                );

            }


            // ==================================================
            // 19. RESCHEDULE
            // ==================================================

            if (
                action.intent ===
                "RESCHEDULE"
            ) {

                return await this.handleReschedule(

                    organizationId,

                    conversation.id!,

                    customerPhone,

                    action

                );

            }


            // ==================================================
            // 20. FALLBACK
            // ==================================================

            const reply =
                action.reply ||
                "I'm here to help. What would you like to do?";


            return await this.finishResponse(

                organizationId,

                conversation.id!,

                reply

            );


        } catch (error) {

            console.error(
                "❌ ChatService error:",
                error
            );

            throw error;

        }

    }


    // ==========================================================
    // CONVERSATION CONTEXT
    // ==========================================================

    private resolveConversationContext(

        action: AIAgentAction,

        history: IMessage[],

        currentMessage: string

    ): AIAgentAction {

        const normalizedMessage =
            currentMessage
                .trim()
                .toLowerCase();


        // ------------------------------------------------------
        // FIND LAST ASSISTANT MESSAGE
        // ------------------------------------------------------

       const lastAssistantMessage =
    [...history]
        .reverse()
        .find(
            (msg) => msg.sender === "AI"
        );


        // ------------------------------------------------------
        // CONFIRMATION HANDLING
        // ------------------------------------------------------

        const confirmationWords = [

            "yes",
            "yes please",
            "book it",
            "confirm",
            "confirmed",
            "okay",
            "ok",
            "sure",
            "go ahead",
            "that works",
            "i'll take it",
            "take it",
            "do it",

        ];


        const isConfirmation =
            confirmationWords.includes(
                normalizedMessage
            );


        if (
            isConfirmation &&
            lastAssistantMessage
        ) {

            const previousReply =
                lastAssistantMessage.text
                    .toLowerCase();


            // If the previous AI message asked
            // whether the customer wants to book,
            // convert confirmation into BOOKING.

            if (
                previousReply.includes(
                    "would you like me to book"
                ) ||
                previousReply.includes(
                    "would you like one of these"
                ) ||
                previousReply.includes(
                    "shall i book"
                ) ||
                previousReply.includes(
                    "should i book"
                )
            ) {

                const contextDate =
                    this.extractDateFromText(
                        lastAssistantMessage.text
                    );


                const contextTime =
                    this.extractTimeFromText(
                        lastAssistantMessage.text
                    );


                return {

                    ...action,

                    intent:
                        "BOOKING",

                    date:
                        action.date ||
                        contextDate,

                    time:
                        action.time ||
                        contextTime,

                };

            }

        }


        // ------------------------------------------------------
        // DATE CONTEXT
        // ------------------------------------------------------

        // If AI detected a time but no date,
        // look through recent conversation for a date.

        if (
            action.time &&
            !action.date
        ) {

            const contextDate =
                this.findDateInHistory(
                    history
                );


            if (contextDate) {

                action.date =
                    contextDate;

            }

        }


        // ------------------------------------------------------
        // TIME CONTEXT
        // ------------------------------------------------------

        // If AI detected a date but no time,
        // we intentionally DO NOT invent a time.

        return action;

    }


    // ==========================================================
    // FIND DATE FROM HISTORY
    // ==========================================================

    private findDateInHistory(
        history: IMessage[]
    ): string | undefined {

        for (
            let i = history.length - 1;
            i >= 0;
            i--
        ) {

            const text =
                history[i].text;


            const date =
                this.extractDateFromText(
                    text
                );


            if (date) {

                return date;

            }

        }


        return undefined;

    }


    // ==========================================================
    // EXTRACT DATE
    // ==========================================================

    private extractDateFromText(
        text: string
    ): string | undefined {

        // YYYY-MM-DD

        const isoMatch =
            text.match(
                /\b(20\d{2})-(\d{2})-(\d{2})\b/
            );


        if (isoMatch) {

            return isoMatch[0];

        }


        return undefined;

    }


    // ==========================================================
    // EXTRACT TIME
    // ==========================================================

    private extractTimeFromText(
        text: string
    ): string | undefined {

        const match =
            text.match(
                /\b(0?[1-9]|1[0-2])(?::([0-5]\d))?\s*(AM|PM)\b/i
            );


        if (!match) {

            // Try 24-hour format

            const twentyFour =
                text.match(
                    /\b([01]\d|2[0-3]):([0-5]\d)\b/
                );


            if (twentyFour) {

                return twentyFour[0];

            }


            return undefined;

        }


        let hour =
            Number(match[1]);


        const minute =
            match[2] ||
            "00";


        const period =
            match[3].toUpperCase();


        if (
            period === "PM" &&
            hour !== 12
        ) {

            hour += 12;

        }


        if (
            period === "AM" &&
            hour === 12
        ) {

            hour = 0;

        }


        return (
            String(hour).padStart(2, "0") +
            ":" +
            minute
        );

    }


    // ==========================================================
    // CHECK AVAILABILITY
    // ==========================================================

    private async handleAvailabilityCheck(

        organizationId: string,

        conversationId: string,

        action: AIAgentAction

    ) {

        // ------------------------------------------------------
        // DATE REQUIRED
        // ------------------------------------------------------

        if (!action.date) {

            const reply =
                "Sure! What date would you like me to check?";


            return await this.finishResponse(

                organizationId,

                conversationId,

                reply

            );

        }


        // ------------------------------------------------------
        // TIME REQUIRED
        // ------------------------------------------------------

        if (!action.time) {

            const reply =
                "Sure! What time would you like me to check?";


            return await this.finishResponse(

                organizationId,

                conversationId,

                reply

            );

        }


        // ------------------------------------------------------
        // ONE AVAILABILITY READ
        // ------------------------------------------------------

        const availableSlots =
            await bookingService.getAvailableSlots(

                organizationId,

                action.date

            );


        const isAvailable =
            availableSlots.includes(
                action.time
            );


        // ------------------------------------------------------
        // AVAILABLE
        // ------------------------------------------------------

        if (isAvailable) {

            const reply =

                `Yes! ${this.formatTime(action.time)} is available on ${action.date}.\n\n` +

                `Would you like me to book it for you?`;


            return await this.finishResponse(

                organizationId,

                conversationId,

                reply

            );

        }


        // ------------------------------------------------------
        // NOT AVAILABLE
        // ------------------------------------------------------

        const suggestedSlots =
            this.getSuggestedSlots(

                availableSlots,

                action.time

            );


        if (
            suggestedSlots.length === 0
        ) {

            const reply =

                `Sorry, ${this.formatTime(action.time)} is already booked on ${action.date}.\n\n` +

                `There are no nearby available slots on that date. Would you like to choose another time or date?`;


            return await this.finishResponse(

                organizationId,

                conversationId,

                reply

            );

        }


        const reply =

            `Sorry, ${this.formatTime(action.time)} is already booked on ${action.date}.\n\n` +

            `Here are some nearby available times:\n` +

            suggestedSlots
                .map(
                    (slot) =>
                        `• ${this.formatTime(slot)}`
                )
                .join("\n") +

            `\n\nWould you like me to book one of these?`;


        return await this.finishResponse(

            organizationId,

            conversationId,

            reply

        );

    }


    // ==========================================================
    // BOOKING
    // ==========================================================

    private async handleBooking(

        organizationId: string,

        conversationId: string,

        customer: any,

        customerPhone: string,

        action: AIAgentAction

    ) {

        // ------------------------------------------------------
        // DATE MISSING
        // ------------------------------------------------------

        if (!action.date) {

            const reply =
                "Sure! What date would you like to book your appointment?";


            return await this.finishResponse(

                organizationId,

                conversationId,

                reply

            );

        }


        // ------------------------------------------------------
        // TIME MISSING
        // ------------------------------------------------------

        if (!action.time) {

            const reply =
                `Sure! What time would you prefer on ${action.date}?`;


            return await this.finishResponse(

                organizationId,

                conversationId,

                reply

            );

        }


        // ------------------------------------------------------
        // CUSTOMER NAME
        // ------------------------------------------------------

        const customerName =
            action.customerName ||
            customer.name;


        if (
            !customerName ||
            customerName === customerPhone
        ) {

            const reply =
                "Sure! May I have your name for the appointment?";


            return await this.finishResponse(

                organizationId,

                conversationId,

                reply

            );

        }


        // ------------------------------------------------------
        // CREATE BOOKING
        // ------------------------------------------------------

        try {

            console.log(
                "📅 AI attempting booking:",
                {

                    date:
                        action.date,

                    time:
                        action.time,

                    customer:
                        customerPhone,

                }
            );


            const booking =
                await bookingService.createBooking({

                    organizationId,

                    customerId:
                        customer.id,

                    customerName,

                    customerPhone,

                    doctorName:
                        action.doctorName ||
                        "Dr. Ananya Sharma",

                    service:
                        action.service ||
                        "Dental Consultation",

                    date:
                        action.date,

                    time:
                        action.time,

                    status:
                        "CONFIRMED",

                });


            // --------------------------------------------------
            // SUCCESS
            // --------------------------------------------------

            const reply =

                `✅ Your appointment is confirmed!\n\n` +

                `👨‍⚕️ ${booking.doctorName}\n` +

                `📅 ${this.formatDate(booking.date)}\n` +

                `🕐 ${this.formatTime(booking.time)}\n` +

                `🦷 ${booking.service}\n\n` +

                `Thank you for choosing SmileCare Dental Clinic! 😊`;


            console.log(
                "✅ AI booking created:",
                booking.id
            );


            const result =
                await this.finishResponse(

                    organizationId,

                    conversationId,

                    reply

                );


            return {

                ...result,

                booking,

            };

        } catch (error: any) {

            // --------------------------------------------------
            // SLOT OCCUPIED
            // --------------------------------------------------

            if (
                error.message ===
                "This appointment slot is already booked"
            ) {

                console.log(
                    "⚠️ AI requested an occupied slot"
                );


                // Only read full availability AFTER
                // the booking attempt fails.

                const availableSlots =
                    await bookingService.getAvailableSlots(

                        organizationId,

                        action.date

                    );


                const suggestedSlots =
                    this.getSuggestedSlots(

                        availableSlots,

                        action.time

                    );


                let reply =

                    `Sorry, ${this.formatTime(action.time)} is already booked on ${action.date}.`;


                if (
                    suggestedSlots.length > 0
                ) {

                    reply +=

                        `\n\nNearby available times:\n` +

                        suggestedSlots
                            .map(
                                (slot) =>
                                    `• ${this.formatTime(slot)}`
                            )
                            .join("\n") +

                        `\n\nWould you like me to book one of these?`;

                } else {

                    reply +=

                        `\n\nThere are no nearby available slots on that date. Would you like to choose another date?`;

                }


                return await this.finishResponse(

                    organizationId,

                    conversationId,

                    reply

                );

            }


            throw error;

        }

    }


    // ==========================================================
    // CANCEL
    // ==========================================================

    private async handleCancel(

        organizationId: string,

        conversationId: string,

        customerPhone: string,

        action: AIAgentAction

    ) {

        const bookings =
            await bookingService.getCustomerBookings(

                organizationId,

                customerPhone

            );


        if (
            bookings.length === 0
        ) {

            const reply =
                "I couldn't find any upcoming appointments to cancel.";


            return await this.finishResponse(

                organizationId,

                conversationId,

                reply

            );

        }


        let bookingId =
            action.bookingId;


        // If only one booking exists,
        // safely select it.

        if (
            !bookingId &&
            bookings.length === 1
        ) {

            bookingId =
                bookings[0].id;

        }


        if (!bookingId) {

            const reply =
                "I found multiple upcoming appointments. Which appointment would you like to cancel?";


            return await this.finishResponse(

                organizationId,

                conversationId,

                reply

            );

        }


        // Security check:
        // booking must belong to this customer.

        const customerOwnsBooking =
            bookings.some(
                (booking) =>
                    booking.id === bookingId
            );


        if (!customerOwnsBooking) {

            const reply =
                "I couldn't find that appointment under your account.";


            return await this.finishResponse(

                organizationId,

                conversationId,

                reply

            );

        }


        await bookingService.cancelBooking(
            bookingId
        );


        const reply =
            "✅ Your appointment has been cancelled successfully.";


        return await this.finishResponse(

            organizationId,

            conversationId,

            reply

        );

    }


    // ==========================================================
    // RESCHEDULE
    // ==========================================================

    private async handleReschedule(

        organizationId: string,

        conversationId: string,

        customerPhone: string,

        action: AIAgentAction

    ) {

        const bookings =
            await bookingService.getCustomerBookings(

                organizationId,

                customerPhone

            );


        if (
            bookings.length === 0
        ) {

            const reply =
                "I couldn't find any upcoming appointments to reschedule.";


            return await this.finishResponse(

                organizationId,

                conversationId,

                reply

            );

        }


        // ------------------------------------------------------
        // DATE
        // ------------------------------------------------------

        if (!action.date) {

            const reply =
                "Sure! What date would you like to reschedule your appointment to?";


            return await this.finishResponse(

                organizationId,

                conversationId,

                reply

            );

        }


        // ------------------------------------------------------
        // TIME
        // ------------------------------------------------------

        if (!action.time) {

            const reply =
                "What time would you prefer?";


            return await this.finishResponse(

                organizationId,

                conversationId,

                reply

            );

        }


        // ------------------------------------------------------
        // FIND BOOKING
        // ------------------------------------------------------

        let bookingId =
            action.bookingId;


        if (
            !bookingId &&
            bookings.length === 1
        ) {

            bookingId =
                bookings[0].id;

        }


        if (!bookingId) {

            const reply =
                "I found multiple upcoming appointments. Which one would you like to reschedule?";


            return await this.finishResponse(

                organizationId,

                conversationId,

                reply

            );

        }


        // Security check

        const customerOwnsBooking =
            bookings.some(
                (booking) =>
                    booking.id === bookingId
            );


        if (!customerOwnsBooking) {

            const reply =
                "I couldn't find that appointment under your account.";


            return await this.finishResponse(

                organizationId,

                conversationId,

                reply

            );

        }


        // ------------------------------------------------------
        // RESCHEDULE
        // ------------------------------------------------------

        const updatedBooking =
            await bookingService.rescheduleBooking(

                bookingId,

                action.date,

                action.time

            );


        const reply =

            `✅ Your appointment has been rescheduled successfully.\n\n` +

            `📅 ${this.formatDate(updatedBooking.date)}\n` +

            `🕐 ${this.formatTime(updatedBooking.time)}\n` +

            `👨‍⚕️ ${updatedBooking.doctorName}`;


        return await this.finishResponse(

            organizationId,

            conversationId,

            reply

        );

    }


    // ==========================================================
    // SUGGEST NEARBY SLOTS
    // ==========================================================

    private getSuggestedSlots(

        availableSlots: string[],

        requestedTime: string,

        limit: number = 5

    ): string[] {

        const requestedMinutes =
            this.timeToMinutes(
                requestedTime
            );


        const sortedSlots =
            [...availableSlots]
                .sort(
                    (a, b) =>
                        Math.abs(
                            this.timeToMinutes(a) -
                            requestedMinutes
                        ) -
                        Math.abs(
                            this.timeToMinutes(b) -
                            requestedMinutes
                        )
                );


        return sortedSlots.slice(
            0,
            limit
        );

    }


    // ==========================================================
    // TIME → MINUTES
    // ==========================================================

    private timeToMinutes(
        time: string
    ): number {

        const [
            hours,
            minutes
        ] =
            time
                .split(":")
                .map(Number);


        return (
            hours * 60 +
            minutes
        );

    }


    // ==========================================================
    // FORMAT TIME
    // ==========================================================

    private formatTime(
        time: string
    ): string {

        const [
            hoursString,
            minutes
        ] =
            time.split(":");


        let hours =
            Number(hoursString);


        const period =
            hours >= 12
                ? "PM"
                : "AM";


        hours =
            hours % 12 || 12;


        return `${hours}:${minutes} ${period}`;

    }


    // ==========================================================
    // FORMAT DATE
    // ==========================================================

    private formatDate(
        date: string
    ): string {

        const parsed =
            new Date(
                `${date}T00:00:00`
            );


        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {

            return date;

        }


        return parsed.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric",
            }
        );

    }


    // ==========================================================
    // SAVE AI REPLY + SSE + CONVERSATION
    // ==========================================================

    private async finishResponse(

        organizationId: string,

        conversationId: string,

        reply: string

    ) {

        // Save AI message

        await this.saveAIReply(

            organizationId,

            conversationId,

            reply

        );


        // Update conversation preview

        await conversationService.updateConversation(

            conversationId,

            reply

        );


        return {

            success: true,

            reply,

            conversationId,

        };

    }


    // ==========================================================
    // SAVE AI MESSAGE + SSE
    // ==========================================================

    private async saveAIReply(

        organizationId: string,

        conversationId: string,

        reply: string

    ) {

        await messageService.createMessage({

            conversationId,

            sender: "AI",

            text: reply,

        });


        sseService.sendToOrganization(

            organizationId,

            "new_message",

            {

                conversationId,

                sender: "AI",

                text: reply,

            }

        );


        console.log(
            "📡 SSE: AI message sent"
        );

    }

}


export default new ChatService();