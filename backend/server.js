require('dotenv').config();

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const authRoutes = require('./routes/auth');
const stripeRoutes = require('./routes/stripeRoutes'); 

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/stripe', stripeRoutes); 

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
    app.post('/submit-email', async (req, res) => {
        const { email } = req.body;
        try {
            // Assuming you have a mongoose model `Subscriber`
            const subscriber = new Subscriber({ email });
            await subscriber.save();
            res.send({ message: 'Email successfully added!' });
        } catch (error) {
            console.error('Failed to save email:', error);
            res.status(500).send({ message: 'Failed to save email' });
        }
    });

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


app.post('/create-checkout-session', async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Get a Hint',
            },
            unit_amount: 100, // in cents
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${req.headers.origin}/return?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancel`,
      });
      res.json({ sessionId: session.id });
    } catch (err) {
      console.error("Error creating checkout session", err);
      res.status(500).send("Internal Server Error");
    }
  });
  
  const PORT = process.env.PORT || 4242;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));