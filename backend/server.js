require('dotenv').config();

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

const port = process.env.PORT || 4000;
const uri = process.env.MONGODB_URI;

async function startServer() {
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    server.applyMiddleware({ app });

    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    console.log("MongoDB connected successfully.");

    // Serve static files from the React app
    app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
    });

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

startServer().catch(error => {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
});
