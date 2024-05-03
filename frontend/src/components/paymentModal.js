import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';

const stripePromise = loadStripe("pk_live_51OfghiS4fyP2AUm98pmuRjnyFXZ1DE9TW1VeZ8oe9VAVzxHQUN4M8kGs1zWTxrnyliJfSMcdMPeEpK63qrLmEOMk00yxeVVqUN");



const App = () => {
  const fetchClientSecret = useCallback(() => {
    return fetch("http://localhost:4000/api/stripe/create-checkout-session", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default App;


// const PaymentModal = ({ isOpen, onClose, onSuccess }) => {
//   const [clientSecret, setClientSecret] = useState('');

//   useEffect(() => {
//     if (isOpen) {
//       fetchClientSecret();
//     }
//   }, [isOpen]);

//   const fetchClientSecret = async () => {
//     try {
//       const response = await fetch("http://localhost:4000/api/stripe/create-checkout-session", {
//         method: "POST",
//       });
//       const data = await response.json();
//       if (data.clientSecret) {
//         setClientSecret(data.clientSecret);
//       } else {
//         console.error('No clientSecret in response:', data);
//       }
//     } catch (error) {
//       console.error('Error fetching clientSecret:', error);
//     }
//   };

//   useEffect(() => {
//     if (clientSecret) {
//       const setupElements = async () => {
//         try {
//           const stripe = await stripePromise;
//           const elements = stripe.elements();
//           const paymentElement = elements.create('payment');
//           paymentElement.mount('#payment-element');
//         } catch (error) {
//           console.error('Error setting up Stripe Elements:', error);
//         }
//       };

//       setupElements();
//     }
//   }, [clientSecret]);

//   const handlePayment = async () => {
//     const stripe = await stripePromise;
//     try {
//       const result = await stripe.confirmCardPayment(clientSecret);
//       if (result.error) {
//         console.error('Payment error:', result.error.message);
//       } else if (result.paymentIntent.status === 'succeeded') {
//         console.log('Payment successful:', result.paymentIntent);
//         onSuccess();
//       }
//     } catch (error) {
//       console.error('Error confirming card payment:', error);
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Payment Modal">
//       <h2>Get a Hint</h2>
//       <div id="payment-element" /> {/* This div is where the Stripe payment element will be mounted */}
//       {clientSecret && <button onClick={handlePayment}>Submit Payment</button>}
//       <button onClick={onClose}>Cancel</button>
//     </Modal>
//   );
// };

// export default PaymentModal;
