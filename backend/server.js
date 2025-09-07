import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import DbConnection from "./init/database.js";
import chatRoutes from "./routes/chat.js";

dotenv.config(); // load .env variables

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

// Server listen
// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`✅ Server is listening on port ${PORT}`);
// });

export default app;