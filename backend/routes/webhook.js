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
    console.log("Received webhook with raw body:", req.rawBody);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error("Webhook signature verification failed", err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                const email = session.customer_email || (session.customer_details && session.customer_details.email);
                if (email) {
                    const user = await User.findOne({ email: email });
                    if (user) {
                        user.stripeCustomerId = session.customer;
                        user.isSubscribed = true;
                        await user.save();
                        console.log(`Subscription activated for ${user.email}`);
                    } else {
                        console.log(`No user found with email: ${email}`);
                    }
                } else {
                    console.log('No email provided in the webhook data');
                }
                break;

            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted':
                const customerEmail = event.data.object.email;
                if (customerEmail) {
                    const user = await User.findOne({ email: customerEmail });
                    if (user) {
                        user.isSubscribed = event.data.object.status === 'active';
                        user.stripeCustomerId = event.data.object.customer;
                        await user.save();
                        console.log(`Updated subscription status for ${user.email} to ${event.data.object.status}`);
                    } else {
                        console.log(`No user found with email: ${customerEmail}`);
                    }
                }
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (error) {
        console.error('Error processing the webhook:', error);
        res.status(500).send('Internal Server Error');
    }

    res.json({ received: true });
});


module.exports = router;
