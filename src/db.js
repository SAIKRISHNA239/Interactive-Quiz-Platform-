import Dexie from 'dexie';

const db = new Dexie('QuizApp');
db.version(1).stores({
  attempts: '++id, score, timestamp'
});

export const saveAttempt = async (score) => {
  await db.attempts.add({ score, timestamp: new Date() });
};

export const getAttempts = async () => {
  return await db.attempts.toArray();
};

export default db;