const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  category : {
    type: String,
    required: true
  },
  isSubscriberOnly: {
    type: Boolean,
    default: false  // Assume questions are available to all by default
  }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
