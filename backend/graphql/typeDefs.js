const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    getQuestions: [Question]
  }

  type Mutation {
    addQuestion(questionText: String!, answer: String!, hint: String!): Question
  }

  type Question {
    id: ID!
    questionText: String!
    answer: String!
    hint: String!
  }
`;

module.exports = typeDefs;
