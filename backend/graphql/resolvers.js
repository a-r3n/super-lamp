const Question = require('../models/question'); // Path to Question model

const resolvers = {
  Query: {
    getQuestions: async () => await Question.find({}),
  },
  Mutation: {
    addQuestion: async (_, { questionText, answer, isSubscriberOnly }) => {
      const newQuestion = new Question({ questionText, answer, isSubscriberOnly });
      await newQuestion.save();
      return newQuestion;
    },
  },
};

module.exports = resolvers;
