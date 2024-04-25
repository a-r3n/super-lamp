const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
const port = process.env.PORT || 4000;

const uri = "mongodb+srv://a-r3n:81VecrNgi4ccVYbM@cluster0.vfyfoze.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

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

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    } catch (error) {
      console.error("Failed to connect to MongoDB", error);
    }
  }

run().catch(console.dir);

startServer();
