const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const Question = require('../models/question'); 
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';  // Fallback secret

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password || password.length < 6) {
      return res.status(400).send("Invalid data provided.");
    }
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(409).send("Registration failed: The user already exists"); // 409 Conflict
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
      const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
      res.status(201).send({ token });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error registering new user.");
    }
  });
  
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send("Invalid data provided.");
    }
    try {
      const user = await User.findOne({ username });
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

// Fetch questions based on subscription status
router.get('/questions', async (req, res) => {
  try {
    const isSubscribed = req.query.isSubscribed === 'true'; // Example to get subscription status from query
    const questions = await Question.find({ isSubscriberOnly: { $lte: isSubscribed } }); // Fetches all questions for non-subscribers and all for subscribers
    res.json({ questions });
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

    const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
    res.json({ subscriptionStatus: subscription.status });
  } catch (error) {
    console.error('Failed to retrieve subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
