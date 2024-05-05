const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');  // Ensure this is the correct path to your User model

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
            // Check for the presence of customer email in session
            if (session.customer_email) {
                const user = await User.findOne({ email: session.customer_email });
                if (user) {
                    user.stripeCustomerId = session.customer; // Set Stripe customer ID
                    user.isSubscribed = true; // Set subscription status to true
                    await user.save();
                    console.log(`Subscription activated for ${user.email}`);
                } else {
                    console.log(`No user found with email: ${session.customer_email}`);
                }
            }
            break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
            if (event.data.object.customer_email) {
                const user = await User.findOne({ email: event.data.object.customer_email });
                if (user) {
                    user.isSubscribed = event.data.object.status === 'active';
                    user.stripeCustomerId = event.data.object.customer; // Ensure customer ID is current
                    await user.save();
                    console.log(`Updated subscription status for ${user.email} to ${event.data.object.status}`);
                } else {
                    console.log(`No user found with email: ${event.data.object.customer_email}`);
                }
            }
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
            break;
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
});

module.exports = router;
