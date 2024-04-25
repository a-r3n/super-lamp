const mongoose = require('mongoose');
const Question = require('../models/question'); 

mongoose.connect('mongodb://localhost:27017/quizdb', { useNewUrlParser: true, useUnifiedTopology: true });

const questions = [
  { questionText: "In the 12 months to December 2023, Australia’s inflation rate was 4.1%. In the 12 months to March 2024, has it gone up, gone down or stayed steady?", answer: "Gone down (to 3.6%)" },
  { questionText: "The Government has announced HECS-HELP debt will increase by how much this year?", answer: "4.7%" },
  { questionText: "The shareholders of which Australian fossil fuel company rejected the company’s climate transition action plan at it’s annual general meeting?", answer: "Woodside Energy (ASX: WDS)" },
  { questionText: "Which business leader did Australian prime minister Anthony Albanese call an “arrogant billionaire” this week?", answer: "Elon Musk" },
  { questionText: "FreeTV, a lobby group representing Australia’s free-to-air TV broadcasters, submitted to government that the free-to-air TV networks have lost what percentage of young viewers to TikTok and YouTube? a) 26% b) 37% c) 61% d) 83%", answer: "d) 83%" },
  { questionText: "A bill passed by America’s Congress and signed by President Biden will ban which tech platform from the US in 9 months if not sold to an American company?", answer: "TikTok" },
  { questionText: "The world’s largest election is currently underway in which country?", answer: "India, where an estimated 969 million people will cast their vote" },
  { questionText: "The World Health Organisation, Google and MIT are backing a new company NanniAI that believes it can translate what?", answer: "A crying baby" },
  { questionText: "America’s FTC is suing to block an $8.5 billion merger between US fashion giants Tapestry and Capri Holdings, intended to rival the giant European fashion houses. Name one brand owned by Tapestry or Capri", answer: "Tapestry own Coach, Kate Spade and Stuart Weitzman. Capri own Versace, Jimmy Choo and Michael Kors" },
  { questionText: "Former President Trump is set to receive an additional 36 million shares (today worth $1.3 billion) in Truth Social owner Trump Media & Technology Group for what: a) Using his profile to promote Truth Social b) Offering advice and consulting services to the company c) The share price remaining above a certain level d) Not selling any of his shares", answer: "c) The share price remaining above a certain level" },
  // Add as many questions as you want here
];

const seedDB = async () => {
  await Question.deleteMany({});
  await Question.insertMany(questions);
  console.log("Database seeded!");
};

seedDB().then(() => {
  mongoose.connection.close();
});
