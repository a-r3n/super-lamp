import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/custom.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.post('http://localhost:4000/graphql', {
          query: `{ getQuestions { id questionText answer } }`
        }, {
          headers: {
            'Content-Type': 'application/json'
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
          console.log("Toggling showAnswer for question:", id, "Current state:", question.showAnswer);
          return {...question, showAnswer: !question.showAnswer};
        }
        return question;
      })
    );
  };
 

  const handleCorrect = (id) => {
    setQuestions(currentQuestions =>
      currentQuestions.map(question => {
        if (question.id === id && !question.correct) { // Check if not already marked correct
          // Update the question to mark as correct
          return {...question, correct: true};
        }
        return question;
      })
    );
    // Check if the question is being marked correct for the first time to update score
    const question = questions.find(q => q.id === id);
    if (question && !question.correct) {
      setScore(prevScore => prevScore + 1);
    }
  };

  return (
    <div>
    <div className="score">Score: {score}/10 </div>
      {questions.map(question => (
        <div className="question-card" key={question.id}>
          <p className="question-text">{question.questionText}</p>
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
  );
};

export default Quiz;
