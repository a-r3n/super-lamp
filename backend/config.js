const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/quizdb'; // Typically something like mongodb://localhost:27017/quizdb

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));
