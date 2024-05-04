import React, { useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import RegisterModal from './registerModal';
import LoginModal from './loginModal';

const Header = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isLoggedIn, isSubscribed, score, saveScore, logout, subscribe } = useContext(UserContext);

  const handleSubscribe = () => {
    window.location.href = "https://buy.stripe.com/fZe9Da6v674X9xe145"; // Assume subscription logic is here
    subscribe(); // Call this after ensuring the subscription payment is successful
  };

  return (
    <div className="header">
      <h1>Weekly News Quiz</h1>
      {!isLoggedIn ? (
        <>
          <button onClick={() => setShowRegisterModal(true)}>Register</button>
          <button onClick={() => setShowLoginModal(true)}>Login</button>
          <p>Login to save your score</p>
        </>
      ) : (
        <>
          {isSubscribed ? (
            <>
              <button onClick={logout}>Logout</button>
              <button onClick={saveScore}>Save my score</button>
              <div>Score: {score}</div>
              <p>Thank you for subscribing</p>
            </>
          ) : (
            <>
              <button onClick={logout}>Logout</button>
              <button onClick={handleSubscribe}>Subscribe</button>
              <button onClick={saveScore}>Save my score</button>
              <div>Score: {score}</div>
            </>
          )}
        </>
      )}
      <RegisterModal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default Header;

