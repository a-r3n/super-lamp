const Question = require('../models/question'); // Path to Question model
const User = require('../models/User'); // Path to User model

const resolvers = {
  Query: {
    getQuestions: async () => {
      return await Question.find();
    },
    getUsers: async () => {
      return await User.find({}, 'id email isSubscribed -_id'); // Exclude the '_id' field for cleaner output
    },
  },
  Mutation: {
    addQuestion: async (_, { questionText, answer, isSubscriberOnly }) => {
      const newQuestion = new Question({ questionText, answer, isSubscriberOnly });
      return await newQuestion.save();
    },
  },
};


module.exports = resolvers;
