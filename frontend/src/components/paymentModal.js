// frontend/src/components/PaymentModal.js
import React from 'react';
import Modal from 'react-modal';
import { loadStripe } from '@stripe/stripe-js';

// Ensure this is your public Stripe key
const stripePromise = loadStripe('YOUR_STRIPE_PUBLIC_KEY');

const PaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const handlePayment = async () => {
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{
        price: 'YOUR_PRICE_ID', // Replace with the price ID created in your Stripe dashboard
        quantity: 1,
      }],
      mode: 'payment',
      successUrl: `${window.location.origin}/payment-success`, // You might want to handle routing after success
      cancelUrl: window.location.href,
    });

    if (!error) {
      onSuccess();
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Payment Modal">
      <h2>Get a Hint</h2>
      <p>Pay $0.01 to get a hint for this question.</p>
      <button onClick={handlePayment}>Pay Now</button>
      <button onClick={onClose}>Cancel</button>
    </Modal>
  );
};

export default PaymentModal;
