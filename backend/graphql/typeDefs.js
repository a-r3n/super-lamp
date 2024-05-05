const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    getQuestions: [Question]
    getUsers: [User]  # Add this line to fetch users
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

  type User {
    id: ID!
    email: String!
    isSubscribed: Boolean!
  }
`;

module.exports = typeDefs;
