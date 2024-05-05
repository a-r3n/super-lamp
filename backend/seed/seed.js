const mongoose = require('mongoose');
const Question = require('../models/question');  // Ensure this path matches the location of your Question model

// Environment variables should be used to keep sensitive information secure
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quizdb';

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

const questions = [
  { questionText: "In the 12 months to December 2023, Australia’s inflation rate was 4.1%. In the 12 months to March 2024, has it gone up, gone down or stayed steady?", answer: "Gone down (to 3.6%)", hint: "The US and UK have both gone down in 2024", isSubscriberOnly: false },
  { questionText: "The Government has announced HECS-HELP debt will increase by how much this year?", answer: "4.7%", hint: "It is similar to the rate of inflation", isSubscriberOnly: false },
  { questionText: "The shareholders of which Australian fossil fuel company rejected the company’s climate transition action plan at it’s annual general meeting?", answer: "Woodside Energy (ASX: WDS)", hint: "It is Australia's largest oil and gas copy. They recently bought all of BHP's oil and gas assets", isSubscriberOnly: false },
  { questionText: "Which business leader did Australian prime minister Anthony Albanese call an “arrogant billionaire” this week?", answer: "Elon Musk", hint: "This billionaire owns X (formerly Twitter)", isSubscriberOnly: false },
  { questionText: "Which business leader did Australian prime minister Anthony Albanese call an “arrogant billionaire” this week?", answer: "Elon Musk", hint: "This billionaire owns X (formerly Twitter)", isSubscriberOnly: false },
  { questionText: "Which business leader did Australian prime minister Anthony Albanese call an “arrogant billionaire” this week?", answer: "Elon Musk", hint: "This billionaire owns X (formerly Twitter)", isSubscriberOnly: false },
  { questionText: "This is a subscriber only question", answer: "We got it to work!", hint: "This billionaire owns X (formerly Twitter)", isSubscriberOnly: true }
];

const seedDB = async () => {
  console.log("Connecting to database...")
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
      });
      console.log("Connected to MongoDB successfully.");
      console.log("Deleting existing questions...");
      await Question.deleteMany({});
      console.log("Existing questions deleted.");
  
      console.log("Inserting new questions...");
      await Question.insertMany(questions);
      console.log("Database seeded!");
    } catch (error) {
      console.error("Error seeding database:", error);
    } finally {
      console.log("Closing database connection...");
      await mongoose.connection.close();
      console.log("Database connection closed.");
    }
  };

seedDB();
