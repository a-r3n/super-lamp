import React, { createContext, useState } from 'react';
import axios from 'axios';  // Import axios to make HTTP requests

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [score, setScore] = useState(0);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const saveScore = async () => {
    try {
      await axios.post('/api/save-score', { score }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Score saved successfully!');
    } catch (error) {
      console.error('Failed to save score:', error);
    }
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, score, setScore, login, logout, saveScore }}>
      {children}
    </UserContext.Provider>
  );
};