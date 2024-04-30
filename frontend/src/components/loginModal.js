import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

Modal.setAppElement('#root'); // Suppresses modal-related console warnings

const LoginModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  // State to handle error messages
  const navigate = useNavigate();  // Hook for navigation

  // Define the base URL for API calls
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';  // Use the environment variable or default to localhost:4000

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, { username, password });
      localStorage.setItem('token', response.data.token); // Store the token
      navigate('/'); // Redirect to home on successful login
      onClose(); // Close the modal on success
    } catch (error) {
      setError(error.response && error.response.data ? error.response.data : "Login failed");
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Login Modal">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
        <button onClick={onClose}>Cancel</button>
        {error && <p>{error}</p>}  
      </form>
    </Modal>
  );
};

export default LoginModal;
