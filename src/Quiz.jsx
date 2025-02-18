import React, { useState, useEffect } from 'react';
import { saveAttempt } from './db';
import './styles.css';

const Quiz = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [globalTimeLeft, setGlobalTimeLeft] = useState(1800); // 30 minutes
  const [quizFinished, setQuizFinished] = useState(false);
  const [integerInput, setIntegerInput] = useState(''); // Track input for integer questions

  // Global Timer
  useEffect(() => {
    const globalTimer = setInterval(() => {
      setGlobalTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(globalTimer);
  }, []);

  useEffect(() => {
    if (globalTimeLeft === 0) {
      finishQuiz();
    }
  }, [globalTimeLeft]);

  // Question Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQuestion]);

  useEffect(() => {
    if (timeLeft === 0) {
      nextQuestion();
    }
  }, [timeLeft]);

  const handleAnswer = (answer) => {
    let isCorrect = false;
    const currentQ = questions[currentQuestion];

    if (currentQ.type === 'integer') {
      const userAnswer = parseInt(integerInput, 10);
      isCorrect = userAnswer === currentQ.answer;
    } else if (currentQ.type === 'multiple-choice') {
      const correctAnswerIndex = currentQ.answer.charCodeAt(0) - 'A'.charCodeAt(0);
      isCorrect = answer === currentQ.options[correctAnswerIndex];
    }

    if (isCorrect) {
      setScore(score + 1);
      setFeedback('Correct!');
    } else {
      setFeedback('Incorrect!');
    }

    setSelectedAnswer(answer);
  };

  const submitIntegerAnswer = () => {
    handleAnswer(integerInput); // Manually call handleAnswer for integer questions
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setFeedback(null);
      setIntegerInput(''); // Clear input for the next question
      setTimeLeft(30); // Reset timer
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    saveAttempt(score);
    setQuizFinished(true);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setFeedback(null);
    setIntegerInput('');
    setTimeLeft(30);
    setGlobalTimeLeft(1800);
    setQuizFinished(false);
  };

  if (quizFinished) {
    return (
      <div className="quiz-container">
        <h2>Quiz Finished!</h2>
        <p>Your score: {score} / {questions.length}</p>
        <button onClick={restartQuiz}>Retake Quiz</button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <p>Global Time Left: {Math.floor(globalTimeLeft / 60)}:{globalTimeLeft % 60 < 10 ? `0${globalTimeLeft % 60}` : globalTimeLeft % 60}</p>
      <h2>{questions[currentQuestion].question}</h2>

      {questions[currentQuestion].options ? (
        questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className={selectedAnswer === option ? (feedback === 'Correct!' ? 'correct' : 'incorrect') : ''}
            disabled={!!selectedAnswer}
          >
            {option}
          </button>
        ))
      ) : (
        <div>
          <input
            type="number"
            value={integerInput}
            onChange={(e) => setIntegerInput(e.target.value)}
            disabled={!!selectedAnswer}
          />
          <button onClick={submitIntegerAnswer} disabled={!!selectedAnswer}>
            Submit Answer
          </button>
        </div>
      )}

      <p>Time Left for this question: {timeLeft} seconds</p>

      {feedback && <p>{feedback}</p>}

      <button onClick={nextQuestion} disabled={!selectedAnswer}>
        {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
      </button>
    </div>
  );
};

export default Quiz;
