const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path as necessary
const router = express.Router();

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

module.exports = router;
