import React, { useState } from 'react';
import RegisterModal from './registerModal';
import LoginModal from './loginModal';

const Header = ({ score }) => {  // Accept score as a prop
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="header">
      <h1>Weekly News Quiz</h1>  
      <div>
        <button onClick={() => setShowRegisterModal(true)}>Register</button>
        <button onClick={() => setShowLoginModal(true)}>Login</button>
        <RegisterModal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </div>
      <div className="score">Score: {score}</div>  
    </div>
  );
};

export default Header;
