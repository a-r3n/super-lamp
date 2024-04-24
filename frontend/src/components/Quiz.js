import React, { useState, useEffect } from 'react';
import axios from 'axios';

axios.post('http://localhost:4000/graphql', {
  query: `{ getQuestions { id questionText answer } }`
}, {
  headers: {
    'Content-Type': 'application/json'
  }
}).then(response => {
  // handle response
}).catch(error => {
  console.error('Error fetching questions:', error);
});


const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data } = await axios.get('/graphql', {
        query: `{ getQuestions { id questionText answer } }`
      });
      setQuestions(data.data.getQuestions);
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
    setScore(score + 1);
  };

  return (
    <div>
      {questions.map(q => (
        <div key={q.id}>
          <p>{q.questionText}</p>
          {q.showAnswer && <p>{q.answer}</p>}
          <button onClick={() => handleShowAnswer(q.id)}>Show Answer</button>
          <button onClick={() => handleCorrect(q.id)}>Correct</button>
        </div>
      ))}
      <div>Score: {score}</div>
    </div>
  );
};

export default Quiz;
