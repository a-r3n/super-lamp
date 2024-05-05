const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Question = require('../models/question');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';  // Fallback secret

const createStripeCustomer = async (user) => {
  const stripeCustomer = await stripe.customers.create({
    email: user.email  // Use the email field for creating Stripe customer
  });
  user.stripeCustomerId = stripeCustomer.id;
  await user.save();
};

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || password.length < 6) {
    return res.status(400).send("Invalid data provided.");
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send("Registration failed: The user already exists"); // 409 Conflict
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error registering new user.");
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Invalid data provided.");
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("Login failed: This user does not exist"); // 404 Not Found
    }
    if (!await bcrypt.compare(password, user.password)) {
      return res.status(401).send("Authentication failed.");
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in.");
  }
});

router.post('/subscribe', async (req, res) => {
  const { userId } = req.body; // Make sure to authenticate and validate

  try {
    const user = await User.findById(userId);
    user.isSubscribed = true;
    await user.save();
    res.send({ success: true, message: "Subscription updated successfully." });
  } catch (error) {
    res.status(500).send({ success: false, message: "Failed to update subscription." });
  }
});

router.post('/update-subscription', async (req, res) => {
  const { userId, isSubscribed } = req.body;

  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).send('User not found');
      }
      user.isSubscribed = isSubscribed;
      await user.save();
      res.send({ success: true, message: 'Subscription status updated.' });
  } catch (error) {
      console.error('Error updating subscription:', error);
      res.status(500).send('Failed to update subscription status');
  }
});

// Fetch questions based on subscription status and category
router.get('/questions', async (req, res) => {
  const { category, isSubscribed } = req.query; // Extract category and subscription status from query parameters
  try {
    const queryConditions = {
      category: category, // Filter by category
      isSubscriberOnly: { $lte: isSubscribed === 'true' } // Fetches all questions for non-subscribers and all for subscribers
    };

    // Optionally remove category filter if none is specified
    if (!category) {
      delete queryConditions.category;
    }

    const questions = await Question.find(queryConditions); // Find questions with the specified conditions
    res.json(questions);
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    res.status(500).send("Error fetching questions");
  }
});

router.get('/check-subscription/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const subscription = await stripe.subscriptions.retrieve(user.stripeCustomerId);
    res.json({ subscriptionStatus: subscription.status });
  } catch (error) {
    console.error('Failed to retrieve subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
