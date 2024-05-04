const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handlePayment = async (req, res) => {
    const { amount } = req.body; // Ensure the amount is passed in cents, e.g., 1 for $0.01
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method_types: ['card'],
        });

        res.status(200).send(paymentIntent.client_secret);
    } catch (error) {
        console.error('Payment Error:', error);
        res.status(500).send({ error: error.message });
    }
};
