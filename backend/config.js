require('dotenv').config(); // Ensure dotenv is required at the top

const mongoose = require('mongoose');

// Use the environment variable for the MongoDB URI
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quizdb';

// Connect to MongoDB without deprecated options
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));
