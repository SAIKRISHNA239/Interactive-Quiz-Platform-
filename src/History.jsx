// History.jsx
import React, { useState, useEffect } from 'react';
import { getAttempts } from './db';

const History = () => {
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    // Fetch all attempts from IndexedDB
    const fetchHistory = async () => {
      const data = await getAttempts();
      setAttempts(data);
    };
    fetchHistory();
  }, []);

  return (
    <div>
      <h2>Quiz Attempt History</h2>
      {attempts.length === 0 ? (
        <p>No attempts recorded yet.</p>
      ) : (
        <ul>
          {attempts.map((attempt, index) => (
            <li key={index}>
              Attempt {index + 1}: Score: {attempt.score}, Date: {new Date(attempt.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
