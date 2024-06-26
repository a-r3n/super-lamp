require('dotenv').config();

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const webhookRoutes = require('./routes/webhook');
const Subscriber = require('./models/Subscriber');
const jwt = require('jsonwebtoken');
const subscriptionRoutes = require('./routes/subscriptionRoutes'); 


const app = express();
app.use(cors());
// app.use(express.json());
app.use('/api/auth', express.json(), authRoutes);
app.use('/api/stripe', webhookRoutes);
app.use('/api/check-subscription', express.json(), subscriptionRoutes); 


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

    // Handle email submission
    app.post('/submit-email', express.json(), async (req, res) => {
        const { email } = req.body;
        try {
            const subscriber = new Subscriber({ email });
            await subscriber.save();
            res.send({ message: 'Email successfully added!' });
        } catch (error) {
            console.error('Failed to save email:', error);
            res.status(500).send({ message: 'Failed to save email' });
        }
    });

// Middleware to handle authentication
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Apply authentication middleware to the subscription check route
app.use('/api/check-subscription', authenticateToken, subscriptionRoutes);


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
