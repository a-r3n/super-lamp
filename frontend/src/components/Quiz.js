import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/custom.css';  // Ensure the path to your CSS file is correct

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
        setQuestions(response.data.data.getQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleShowAnswer = (id) => {
    setQuestions(current =>
      current.map(q => q.id === id ? { ...q, showAnswer: !q.showAnswer } : q)
    );
  };

  const handleCorrect = (id) => {
    setQuestions(current =>
      current.map(q => q.id === id ? { ...q, correct: true } : q)
    );
    setScore(prevScore => prevScore + 1); // Use prevScore for accurate updating
  };

  return (
    <div>
      <h1>Weekly News Quiz</h1>
      <p> Catch up on the news of the week with the Equity Mates weekend quiz </p>
      {questions.map(question => (
        <Card className="question-card" key={question.id}>
          <p className="question-text">{question.questionText}</p>
          {question.showAnswer && <p className="answer-text">{question.answer}</p>}
          <Button className="button" onClick={() => handleShowAnswer(question.id)}>
            Show Answer
          </Button>
          <Button className="button" onClick={() => handleCorrect(question.id)}>
            Correct
          </Button>
        </Card>
      ))}
      <div className="score">Score: {score}</div>
    </div>
  );
};

export default Quiz;
