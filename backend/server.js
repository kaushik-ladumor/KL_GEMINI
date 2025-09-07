import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import DbConnection from "./init/database.js";
import chatRoutes from "./routes/chat.js";

dotenv.config(); // Only works locally

const app = express();

// Connect to DB
DbConnection();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://kl-gemini-web-app.vercel.app",
      "https://kl-gemini-web-app-git-main-kaushik-ladumors-projects.vercel.app",
      "https://kl-gemini-web-48rtq7i5s-kaushik-ladumors-projects.vercel.app",
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.options("*", cors());

// Test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// Chat routes
app.use("/api", chatRoutes);

// ❌ Remove app.listen()
// Export app for serverless deployment
export default app;
