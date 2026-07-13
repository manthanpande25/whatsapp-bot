import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { db } from "./config/firebase";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test Firebase Connection
    const snapshot = await db.collection("test").get();
    console.log("✅ Firebase Connected");
    console.log(`Documents in test collection: ${snapshot.size}`);

    // Start Express Server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
}

startServer();