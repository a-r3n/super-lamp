import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext'; 
import Quiz from './components/Quiz';
import Footer from './components/Footer';
import Header from './components/Header'; 

function App() {
  return (
    <UserProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Quiz />} />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
