const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');  // Make sure the path to your User model is correct

// Middleware to handle raw bodies only on the webhook route
const rawBodyBuffer = (req, res, buf, encoding) => {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
  };

  router.all('/webhook', (req, res, next) => {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }
    next();
});

  router.post('/webhook', bodyParser.raw({ type: 'application/json', verify: rawBodyBuffer }), async (req, res) => {
    console.log("Received webhook with raw body:", req.rawBody);  // Log the raw body
    const sig = req.headers['stripe-signature'];
  
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Perform operations after checkout session completion if needed
  // If the session includes a subscription ID, use it to update user records
      if (session.subscription) {
        const subscriptionId = session.subscription;
        const customer = session.customer;
        const user = await User.findOne({ stripeCustomerId: customer });
    if (user) {
      user.isSubscribed = true;  // Assuming completion means active subscription
      await user.save();
    }
  }
  break;


    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      const customerId = subscription.customer;
      const isActive = subscription.status === 'active';

      // Find user by Stripe customer ID and update their subscription status
      const user = await User.findOne({ stripeCustomerId: customerId });
      if (user) {
        user.isSubscribed = isActive;
        await user.save();
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
      break;
  }

  // Return a response to acknowledge receipt of the event
  res.json({received: true});
});

module.exports = router;
