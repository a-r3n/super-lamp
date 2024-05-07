const mongoose = require('mongoose');
const Question = require('../models/question');  // Ensure this path matches the location of your Question model

// Environment variables should be used to keep sensitive information secure
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quizdb';

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

const questions = [

  { questionText: "Which business leader did Australian prime minister Anthony Albanese call an “arrogant billionaire” last week?", 
    answer: "Elon Musk", 
    category: "World", 
    isSubscriberOnly: false },

    { questionText: "Which Australian airline experienced an IT issue this week that saw users served the frequent flyer and booking details of other passengers?", 
    answer: "Qantas", 
    category: "Australia", 
    isSubscriberOnly: false },

  { questionText: "In the 12 months to December 2023, Australia’s inflation rate was 4.1%. In the 12 months to March 2024, has it: <br><br> a) Gone up <br> b) Stayed steady <br> c) Gone down", 
    answer: "c) Gone down (to 3.6%)", 
    category: "Australia", 
    isSubscriberOnly: false },

    { questionText: "Australia's Reserve Bank met this week to decide on the official cash rate, currently at 4.35%. Did they: <br><br> a) Raise rates <br> b) Keep rates steady <br> c) Cut rates", 
    answer: "b) Stay steady", 
    category: "Australia", 
    isSubscriberOnly: false },

  { questionText: "Which company announced the largest stock buyback ever, with plans to buy back $110 billion of its own shares?", 
    answer: "Apple", 
    category: "World", 
    isSubscriberOnly: false },

  { questionText: "Bumble, the dating app famous for requiring women to make the first move, has made a big change to its platform. What did it change?", 
    answer: "Women no longer have to make the first move", 
    category: "World", 
    isSubscriberOnly: false },

  { questionText: "FreeTV, a lobby group representing Australia’s commercial free-to-air television networks, calculated that they have lost what percentage of young viewers to YouTube and TikTok? <br><br> a) 26% <br> b) 37% <br> c) 61% <br> d) 83%", 
    answer: "d) 83%", 
    category: "Australia", 
    isSubscriberOnly: true },

    { questionText: "US lawmakers have passed a law that will ban which social media platform in the US if not sold to an approved buyer in the next 9 months", 
    answer: "TikTok", 
    category: "World", 
    isSubscriberOnly: true },

    { questionText: "According to the Australian Financial Review, how much has the price of the median Sydney house risen in the past 10 years? <br><br> a) 62% <br> b) 77% <br> c) 92% <br> d) 107%", 
    answer: "d) 107%", 
    category: "Australia", 
    isSubscriberOnly: true },

    { questionText: "This week, Donald Trump has been in court in New York for which of his 4 criminal trials? <br><br> a) Paying hush money to a porn star <br> b) Taking classified documents <br> c) Federal election interference <br> d) Election interference in Georgia", 
    answer: "a) Paying hush money to a porn star", 
    category: "World", 
    isSubscriberOnly: true },

    { questionText: "The world's largest election is currently underway in which country?", 
    answer: "India, where an estimated 969 million people will vote", 
    category: "World", 
    isSubscriberOnly: true },

  { questionText: "A single-car garage recently sold for $500,000 in which Sydney suburb?", 
    answer: "Woollahra", 
    category: "Australia", 
    isSubscriberOnly: true }

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
