import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
  const [score, setScore] = useState(0);

  const login = (token, userId, isSubscribed) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    setIsLoggedIn(true);
    setUserId(userId); // Set user ID upon login
    setIsSubscribed(isSubscribed);
  };

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
        if (!isLoggedIn || !userId) return;
        try {
            const response = await axios.get(`/api/check-subscription/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Received subscription status:', response.data.isSubscribed);
            setIsSubscribed(response.data.isSubscribed); 
        } catch (error) {
            console.error('Error checking subscription status:', error);
        }
    };

    checkSubscriptionStatus();
}, [isLoggedIn, userId]);

  const subscribe = async () => {
    setIsSubscribed(true);

    try {
      await axios.post('/api/update-subscription', {
          userId: userId,
          isSubscribed: true
      }, {
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
      });
      console.log('Subscription updated successfully!');
  } catch (error) {
      console.error('Failed to update subscription:', error);
      setIsSubscribed(false);  // Revert if the update fails
  }
};

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setIsSubscribed(false);
    setUserId(null);
    setScore(0); // Reset score on logout
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

  const incrementScore = () => {
    setScore(score + 1); // Increment score function
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, userId, isSubscribed, score, setScore, login, logout, subscribe, saveScore, incrementScore }}>
      {children}
    </UserContext.Provider>
  );
};
