// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const colors = require("colors");

// Load env vars - try multiple paths
const envPath = path.join(__dirname, ".env");
console.log("Looking for .env at:", envPath);
dotenv.config({ path: envPath });

// Also try parent directory if not found
if (!process.env.MONGODB_URI) {
  console.log("No MONGODB_URI found, trying parent directory...");
  dotenv.config({ path: path.join(__dirname, "..", ".env") });
}

// Debug: Check if env variables are loaded
console.log("Environment variables loaded:");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✓ Set" : "✗ Not set");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✓ Set" : "✗ Not set");
console.log("PORT:", process.env.PORT || "5000");

// Check if MONGODB_URI exists
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in environment variables!");
  console.error("Please create a .env file in the backend folder with:");
  console.error("MONGODB_URI=mongodb://localhost:27017/crm-system");
  process.exit(1);
}

// Import database connection
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const leadRoutes = require("./routes/leadRoutes");

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
