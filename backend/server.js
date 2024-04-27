require('dotenv').config();

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
const port = process.env.PORT || 4000;

// MongoDB URI from environment variable
const uri = process.env.MONGODB_URI;

// Start server function
async function startServer() {
    const server = new ApolloServer({ typeDefs, resolvers });

    // Starting the Apollo server
    await server.start();
    
    // Apply GraphQL middleware
    server.applyMiddleware({ app });

    // Connect to MongoDB
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
    });
    
    console.log("MongoDB connected successfully.");

    // Start Express server
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

// Catching potential errors
startServer().catch(error => {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
});
