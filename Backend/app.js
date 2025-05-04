// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Added missing path import
const petRoutes = require('./Routers/petRoutes');
require('dotenv').config();  // To load .env variables

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
const connectDB = async () => {
  try {
    // Use process.env.MONGO_URI for consistency, but fallback to a default connection string
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://thevarasapavi:pavi2000@cluster0.adl35.mongodb.net/pet', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Routes
app.use('/pets', petRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Pet Management API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start the server
const PORT = process.env.PORT || 3000; // Keep this as 3000 to match your frontend expectations
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;