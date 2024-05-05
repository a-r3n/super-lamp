import React, { useState, useContext } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';  // Import UserContext

Modal.setAppElement('#root'); // Suppresses modal-related console warnings

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(UserContext);  // Use login function from context

  // Define the base URL for API calls
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
      login(response.data.token);  // Update the login state via context
      onClose();  // Close the modal
      navigate('/'); // Redirect to home on successful login
    } catch (error) {
      setError(error.response && error.response.data ? error.response.data : "Login failed");
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Login Modal">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
        <button onClick={onClose}>Cancel</button>
        {error && <p>{error}</p>}
      </form>
    </Modal>
  );
};

export default LoginModal;

