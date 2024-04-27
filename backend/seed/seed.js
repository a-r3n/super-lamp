const mongoose = require('mongoose');
const Question = require('../models/question');  // Ensure this path matches the location of your Question model

// Environment variables should be used to keep sensitive information secure
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quizdb';

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

const questions = [
  { questionText: "In the 12 months to December 2023, Australia’s inflation rate was 4.1%. In the 12 months to March 2024, has it gone up, gone down or stayed steady?", answer: "Gone down (to 3.6%)" },
  { questionText: "The Government has announced HECS-HELP debt will increase by how much this year?", answer: "4.7%" },
  { questionText: "The shareholders of which Australian fossil fuel company rejected the company’s climate transition action plan at it’s annual general meeting?", answer: "Woodside Energy (ASX: WDS)" },
  { questionText: "Which business leader did Australian prime minister Anthony Albanese call an “arrogant billionaire” this week?", answer: "Elon Musk" },
  { questionText: "FreeTV, a lobby group representing Australia’s free-to-air TV broadcasters, submitted to government that the free-to-air TV networks have lost what percentage of young viewers to TikTok and YouTube? <br> a) 26% <br> b) 37% <br> c) 61% <br> d) 83%", answer: "d) 83%" },
  { questionText: "A bill passed by America’s Congress and signed by President Biden will ban which tech platform from the US in 9 months if not sold to an American company?", answer: "TikTok" },
  { questionText: "The world’s largest election is currently underway in which country?", answer: "India, where an estimated 969 million people will cast their vote" },
  { questionText: "The World Health Organisation, Google and MIT are backing a new company NanniAI that believes it can translate what?", answer: "A crying baby" },
  { questionText: "America’s FTC is suing to block an $8.5 billion merger between US fashion giants Tapestry and Capri Holdings, intended to rival the giant European fashion houses. Name one brand owned by Tapestry or Capri", answer: "Tapestry own Coach, Kate Spade and Stuart Weitzman. Capri own Versace, Jimmy Choo and Michael Kors" },
  { questionText: "Former President Trump is set to receive an additional 36 million shares (today worth $1.3 billion) in Truth Social owner Trump Media & Technology Group for what: <br> a) Using his profile to promote Truth Social <br> b) Offering advice and consulting services to the company <br> c) The share price remaining above a certain level <br> d) Not selling any of his shares", answer: "c) The share price remaining above a certain level" }
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
