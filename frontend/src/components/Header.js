import React, { useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import RegisterModal from './registerModal';
import LoginModal from './loginModal';

const Header = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isLoggedIn, score, saveScore, logout } = useContext(UserContext);  

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
          <button onClick={logout}>Logout</button>
          <button onClick={saveScore}>Save my score</button>
          <div>Score: {score}</div>
        </>
      )}
      <RegisterModal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default Header;

