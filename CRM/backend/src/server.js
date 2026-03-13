// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const colors = require('colors');

// Load env vars
dotenv.config();

// Import database connection
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');

// Import error middleware
const errorHandler = require('./middleware/error');

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Base route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to CRM API' });
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
});