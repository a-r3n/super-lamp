import React, { useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import RegisterModal from './registerModal';
import LoginModal from './loginModal';
import logo from '../assets/EM-bluered.png'; // Ensure the path is correct


const Header = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isLoggedIn, isSubscribed, score, saveScore, logout, subscribe } = useContext(UserContext);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Smooth scroll to top
    });
  };

  const handleSubscribe = () => {
    window.location.href = "https://buy.stripe.com/fZe9Da6v674X9xe145"; // Assume subscription logic is here
    subscribe(); // Call this after ensuring the subscription payment is successful
  };

  return (
    <div className="header">
      <img src={logo} alt="EM Logo" className="logo" onClick={scrollToTop} />
      <h3>Weekly News Quiz</h3>
      {!isLoggedIn ? (
        <div className="auth-section">
        <button onClick={() => setShowRegisterModal(true)}>Register</button>
        <button onClick={() => setShowLoginModal(true)}>Login</button>
        <p className="login-text">Log in to keep your score</p>
      </div>
      ) : (
        <>
          {isSubscribed ? (
            <div className="auth-section">
              <button onClick={logout}>Logout</button>
              <button onClick={saveScore}>Save my score</button>
              <div>Score: {score}</div>
              <p>Thank you for subscribing</p>
              </div>
          ) : (
            <div className="auth-section">
              <button onClick={handleSubscribe}>Subscribe</button>
              <button onClick={logout}>Logout</button>
              <div>Score: {score}</div>
              </div>
          )}
        </>
      )}
      <RegisterModal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default Header;

