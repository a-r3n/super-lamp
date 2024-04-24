const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const mongoose = require('mongoose');

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

const startServer = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/quizdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log("MongoDB connected successfully.");

    await server.start();
    server.applyMiddleware({ app });

    app.listen({ port: 4000 }, () =>
      console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
};

startServer();
