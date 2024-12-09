import sqlite3 from 'sqlite3';
import path from 'path';
import initDatabase from './migrations/init';

let db: sqlite3.Database | null = null;

const DB_PATH = path.join(__dirname, '..', 'database.sqlite');

const connect = async (): Promise<sqlite3.Database> => {
  if (db) {
    return db;
  }

  return new Promise((resolve, reject) => {
    try {
      db = new sqlite3.Database(DB_PATH, async (err) => {
        if (err) {
          console.error('Error connecting to database:', err);
          reject(err);
          return;
        }

        console.log('Connected to SQLite database');

        // Run migrations
        try {
          if (db) {
            await initDatabase(db);
            console.log('Database initialized');
            resolve(db);
          }
        } catch (initErr) {
          console.error('Error initializing database:', initErr);
          reject(initErr);
        }
      });

    } catch (err) {
      console.error('Failed to create database connection:', err);
      reject(err);
    }
  });
};

// Get database instance - throws error if not connected
const getDb = (): sqlite3.Database => {
  if (!db) {
    throw new Error('Database not connected. Call connect() first.');
  }
  return db;
};

const closeConnection = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      resolve();
      return;
    }

    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
        reject(err);
        return;
      }
      db = null;
      resolve();
    });
  });
};

export {
  connect,
  getDb,
  closeConnection,
};
