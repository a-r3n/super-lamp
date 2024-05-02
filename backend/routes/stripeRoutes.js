// backend/routes/stripeRoutes.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a Stripe checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: 'price_1PBwvp2NYUSImtPOWAWLhhWn', // Replace with your price ID created in the Stripe dashboard
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/payment-success`,
      cancel_url: `${req.headers.origin}/payment-cancel`,
    });
    res.json({ clientSecret: session.payment_intent });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).send("Failed to create session: " + error.message);
  }
});

module.exports = router;
