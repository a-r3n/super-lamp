const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    getQuestions: [Question]
  }

  type Mutation {
    addQuestion(questionText: String!, answer: String!): Question
  }

  type Question {
    id: ID!
    questionText: String!
    answer: String!
  }
`;

module.exports = typeDefs;
