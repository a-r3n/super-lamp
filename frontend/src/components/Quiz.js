import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PaymentModal from './paymentModal';
import '../styles/custom.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${apiUrl}/graphql`, {
        query: `{ getQuestions { id questionText answer hint } }`
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
        showHint: false
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
    toggleQuestionProperty(id, 'correct');
    const question = questions.find(q => q.id === id);
    if (question && !question.correct) {
      setScore(score + 1);
    }
  };

  const handleGetHint = (id) => {
    setCurrentQuestionId(id); // Store the current question ID to know which hint to show upon return
    // Redirect to Stripe payment link
    window.location.href = "https://buy.stripe.com/bIYdTqf1C9d59xecMM";
  };
  
  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    toggleQuestionProperty(currentQuestionId, 'showHint');
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
          {question.showHint && <p className="hint-text">{question.hint}</p>}
          <button className="button" onClick={() => handleShowAnswer(question.id)}>Show Answer</button>
          <button className="button" onClick={() => handleCorrect(question.id)} disabled={question.correct}>Correct</button>
          <button className="button" onClick={() => handleGetHint(question.id)}>Get a Hint</button>
        </div>
      ))}
      <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} onSuccess={handlePaymentSuccess} />
    </div>
  );
};


export default Quiz;
