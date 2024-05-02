import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe("pk_test_51PBuMo2NYUSImtPOAMoV9vkcYKNPwUFry0WNg8OI7yx6G8iEkQjus65Knb9p1jDiwdwLjSBDMA4rxxNw60YHM4TD00GtESEMGd");

const PaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchClientSecret();
    }
  }, [isOpen]);

  const fetchClientSecret = async () => {
    // Simulate fetching client secret from your backend
    const response = await fetch("http://localhost:4000/api/stripe/create-checkout-session", {
      method: "POST",
    });
    const data = await response.json();
    setClientSecret(data.clientSecret);
  };

  useEffect(() => {
    if (clientSecret) {
      const setupElements = async () => {
        const stripe = await stripePromise;
        const elements = stripe.elements({ clientSecret });
        const paymentElement = elements.create('payment');
        paymentElement.mount('#payment-element');

        return () => paymentElement.unmount();  // Ensure clean up occurs on component unmount
      };

      setupElements();
    }
  }, [clientSecret]);

  const handlePayment = async () => {
    const stripe = await stripePromise;
    const result = await stripe.confirmCardPayment(clientSecret);
    if (result.error) {
      console.error('Payment error:', result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        console.log('Payment successful:', result.paymentIntent);
        onSuccess();
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Payment Modal">
      <h2>Get a Hint</h2>
      <div id="payment-element" /> {/* This div is where the Stripe payment element will be mounted */}
      {clientSecret && <button onClick={handlePayment}>Submit Payment</button>}
      <button onClick={onClose}>Cancel</button>
    </Modal>
  );
};

export default PaymentModal;
