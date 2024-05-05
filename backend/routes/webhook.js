const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

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
  console.log("Received webhook with raw body:", req.rawBody);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        // Check if username metadata exists
        if (session.metadata && session.metadata.username) {
          const username = session.metadata.username;
          const user = await User.findOne({ username: username });
          if (user) {
            user.isSubscribed = true;  // Assuming session completion means active subscription
            user.stripeCustomerId = session.customer;  // Update Stripe customer ID
            await user.save();
            console.log(`Updated user ${username} with subscription status and customer ID.`);
          } else {
            console.log(`No user found with username: ${username}`);
          }
        } else {
          console.log('Username metadata not found in the session.');
        }
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        if (subscription.metadata && subscription.metadata.username) {
          const username = subscription.metadata.username;
          const user = await User.findOne({ username: username });
          if (user) {
            user.isSubscribed = subscription.status === 'active';
            await user.save();
            console.log(`Subscription status updated for ${username}`);
          } else {
            console.log(`No user found with username: ${username}`);
          }
        } else {
          console.log('Username metadata not found in the subscription.');
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
        break;
    }
  } catch (err) {
    console.error(`Error handling webhook event: ${err}`);
    res.status(500).send('Internal Server Error');
  }

  // Return a response to acknowledge receipt of the event
  res.json({received: true});
});

module.exports = router;
