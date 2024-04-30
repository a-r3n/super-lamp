import React, { useState } from 'react';
import RegisterModal from './registerModal';
import LoginModal from './loginModal';

const Header = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="header">
      <button onClick={() => setShowRegisterModal(true)}>Register</button>
      <button onClick={() => setShowLoginModal(true)}>Login</button>
      <RegisterModal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default Header;
