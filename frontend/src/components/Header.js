import React, { useState, useContext } from 'react';
import RegisterModal from './registerModal';
import LoginModal from './loginModal';

// Context or global state that stores user's authentication status and score
import { UserContext } from '../contexts/UserContext';

const Header = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isLoggedIn, score, saveScore } = useContext(UserContext);  // Assuming you have a UserContext

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
          <button onClick={() => {/* logic to handle logout */}}>Logout</button>
          <div>Score: {score}</div>
          <button onClick={saveScore}>Save my score</button>
        </>
      )}
      <RegisterModal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default Header;

