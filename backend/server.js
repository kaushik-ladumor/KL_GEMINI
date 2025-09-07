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
const allowedOrigins = [
  "http://localhost:5173",
  "https://kl-gemini-57fp.vercel.app",
  "https://kl-gemini-57fp-git-main-kaushik-ladumors-projects.vercel.app",
  "https://kl-gemini-57fp-dp2o18bii-kaushik-ladumors-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
  })
);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// Chat routes
app.use("/api", chatRoutes);

// Server listen
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server is listening on port ${PORT}`);
});
