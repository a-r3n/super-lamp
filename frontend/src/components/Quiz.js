import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header'; // Import the Header component
import '../styles/custom.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000'; // Fallback to localhost if the env variable is not set
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        const response = await axios.post(`${apiUrl}/graphql`, {
          query: `{ getQuestions { id questionText answer } }`
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // Include the token in the authorization header
          }
        });
        const initialQuestions = response.data.data.getQuestions.map(question => ({
          ...question,
          showAnswer: false,
          correct: false  // Initialize correct state
        }));
        setQuestions(initialQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleShowAnswer = (id) => {
    setQuestions(currentQuestions =>
      currentQuestions.map(question => {
        if (question.id === id) {
          return {...question, showAnswer: !question.showAnswer};
        }
        return question;
      })
    );
  };

  const handleCorrect = (id) => {
    setQuestions(currentQuestions =>
      currentQuestions.map(question => {
        if (question.id === id && !question.correct) {
          return {...question, correct: true};
        }
        return question;
      })
    );
    const question = questions.find(q => q.id === id);
    if (question && !question.correct) {
      setScore(prevScore => prevScore + 1);
    }
  };

  return (
    <div>
      <Header score={score} />  
      <div className="content">
        {questions.map(question => (
          <div className="question-card" key={question.id}>
            <p className="question-text" dangerouslySetInnerHTML={{ __html: question.questionText }}></p>
            <p className={`answer-text ${question.showAnswer ? 'visible' : ''}`}>{question.answer}</p>
            <button className="button" onClick={() => handleShowAnswer(question.id)}>
              Show Answer
            </button>
            <button className="button" onClick={() => handleCorrect(question.id)} disabled={question.correct}>
              Correct
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
