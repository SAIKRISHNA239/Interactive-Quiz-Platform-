import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Quiz from './Quiz';
import History from './History';
import quizData from './quizData.json';
import './styles.css';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Interactive Quiz Platform</h1>
        <nav>
          <Link to="/">Quiz</Link> | <Link to="/history">History</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Quiz questions={quizData} />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;