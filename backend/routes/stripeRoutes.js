// backend/routes/stripeRoutes.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// This could be in your server.js or a dedicated routes file.
app.get('/payment-success', async (req, res) => {
  const sessionId = req.query.session_id;
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

      if (paymentIntent.status === 'succeeded') {
          // The payment was successful, you can show the hint or handle as needed
          return res.redirect(`https://super-lamp.onrender.com/show-hint?hintId=${session.metadata.hintId}`);
      } else {
          // Handle other statuses appropriately
          return res.redirect('https://super-lamp.onrender.com/payment-failed');
      }
  } catch (error) {
      console.error('Error retrieving payment session:', error);
      return res.status(500).send('Internal Server Error');
  }
});

app.get('/payment-cancel', (req, res) => {
  // Redirect the customer to a cancellation page or route
  res.redirect('https://super-lamp.onrender.com/payment-cancelled');
});


router.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Get a Hint',
          },
          unit_amount: 100, // $1.00
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin || 'http://localhost:3000'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'http://localhost:3000'}/payment-cancel`,    
    });
    res.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).send("Failed to create session: " + error.message);
  }
});

module.exports = router;
