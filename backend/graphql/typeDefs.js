const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    getQuestions: [Question]
  }

  type Mutation {
    addQuestion(questionText: String!, answer: String!, isSubscriberOnly: Boolean!): Question
  }

  type Question {
    id: ID!
    questionText: String!
    answer: String!
    isSubscriberOnly: Boolean!
  }
`;

module.exports = typeDefs;
