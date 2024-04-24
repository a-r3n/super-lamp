const mongoose = require('mongoose');
const Question = require('../models/question'); 

mongoose.connect('mongodb://localhost:27017/quizdb', { useNewUrlParser: true, useUnifiedTopology: true });

const questions = [
  { questionText: "What is the capital of France?", answer: "Paris" },
  { questionText: "What is the capital of Germany?", answer: "Berlin" },
  // Add more questions
];

const seedDB = async () => {
  await Question.deleteMany({});
  await Question.insertMany(questions);
  console.log("Database seeded!");
};

seedDB().then(() => {
  mongoose.connection.close();
});
