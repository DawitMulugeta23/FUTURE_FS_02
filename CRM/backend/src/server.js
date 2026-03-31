const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const colors = require("colors");

// Load env vars - .env lives in backend root, and this file is in backend/src
const envPath = path.join(__dirname, "..", ".env");
console.log("Loading .env from:", envPath);
const envLoadResult = dotenv.config({ path: envPath });
if (envLoadResult.error) {
  console.warn("Warning: .env file not found at expected location:", envPath);
}

// Verify environment variables are loaded
console.log(
  "MONGODB_URI:",
  process.env.MONGODB_URI ? "✓ Loaded" : "✗ Not loaded",
);
console.log(
  "JWT_SECRET:",
  process.env.JWT_SECRET ? "✓ Loaded" : "✗ Not loaded",
);
console.log("PORT:", process.env.PORT || "5000");

// Import database connection
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const leadRoutes = require("./routes/leadRoutes");
const emailRoutes = require("./routes/emailRoutes");

// Import error middleware
const errorHandler = require("./middleware/error");

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/email", emailRoutes);

// Base route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to CRM API" });
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
      .yellow.bold,
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
