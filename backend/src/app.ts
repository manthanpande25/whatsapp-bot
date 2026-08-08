import express from "express";
import cors from "cors";


import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import organizationRoutes from "./routes/organization.routes";
import aiRoutes from "./routes/ai.routes";
import knowledgeRoutes from "./routes/knowledge.routes";
import chatRoutes from "./routes/chat.routes";
import whatsappRoutes from "./routes/whatsapp.routes";
import whatsappConnectionRoutes from "./routes/whatsapp-connection.routes";
import customerRoutes from "./routes/customer.routes";
import conversationRoutes from "./routes/conversation.routes";
import messageRoutes from "./routes/message.routes";

console.log("META_VERIFY_TOKEN =", process.env.META_VERIFY_TOKEN);

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/organization", organizationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/knowledge", knowledgeRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/whatsapp", whatsappConnectionRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("WaBot.ai Backend Running 🚀");
});

export default app;