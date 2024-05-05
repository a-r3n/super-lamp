import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import '../styles/custom.css';
import heroImage from '../assets/placeholder.png'; 


const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const { incrementScore, isSubscribed } = useContext(UserContext);  // Use incrementScore from UserContext

  const fetchQuestions = useCallback(async () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${apiUrl}/graphql`, {
        query: `{ getQuestions { id questionText answer isSubscriberOnly } }`
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const fetchedQuestions = response.data.data.getQuestions;
      console.log('Is Subscribed Status in Quiz:', isSubscribed);  // Log the subscription status
      const visibleQuestions = fetchedQuestions.filter(q => !q.isSubscriberOnly || isSubscribed);
      setQuestions(visibleQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }, [isSubscribed]);  // Include isSubscribed as a dependency

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]); // Include fetchQuestions as a dependency

  const handleShowAnswer = (id) => {
    toggleQuestionProperty(id, 'showAnswer');
  };

  const handleCorrect = (id) => {
    const question = questions.find(q => q.id === id);
    if (question && !question.correct) {
      incrementScore();
      toggleQuestionProperty(id, 'correct');
    }
  };

  const toggleQuestionProperty = (id, property) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        return { ...q, [property]: !q[property] };
      }
      return q;
    }));
  };

  return (
    <div className="content">
      <img src={heroImage} alt="Hero" className="hero-image" />
      {questions.map(question => (
        <div className="question-card" key={question.id}>
          <p className="question-text" dangerouslySetInnerHTML={{ __html: question.questionText }}></p>
          <p className={`answer-text ${question.showAnswer ? 'visible' : ''}`}>{question.answer}</p>
          <button className="button" onClick={() => handleShowAnswer(question.id)}>Show Answer</button>
          <button className="button" onClick={() => handleCorrect(question.id)} disabled={question.correct}>Correct</button>
        </div>
      ))}
    </div>
  );
};

export default Quiz;