import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';  // Import UserContext
import '../styles/custom.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const { incrementScore } = useContext(UserContext);  // Use incrementScore from UserContext

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${apiUrl}/graphql`, {
        query: `{ getQuestions { id questionText answer } }`
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const initialQuestions = response.data.data.getQuestions.map(q => ({
        ...q,
        showAnswer: false,
        correct: false,
      }));
      setQuestions(initialQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleShowAnswer = (id) => {
    toggleQuestionProperty(id, 'showAnswer');
  };

  const handleCorrect = (id) => {
    const question = questions.find(q => q.id === id);
    if (question && !question.correct) {
      incrementScore();  // Use incrementScore to update the score globally
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
