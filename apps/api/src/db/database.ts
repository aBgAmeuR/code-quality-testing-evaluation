import sqlite3 from 'sqlite3';
import { log } from '@repo/logger';
import initDatabase from './migrations/init';

let db: sqlite3.Database | null = null;

const DB_PATH = 'file:../../database.sqlite';

const connect = async (): Promise<sqlite3.Database> => {
  if (db) {
    return db;
  }

  return new Promise((resolve, reject) => {
    try {
      if (!DB_PATH) {
        throw new Error('DB_PATH environment variable not set');
      }

      db = new sqlite3.Database(DB_PATH, async (err) => {
        if (err) {
          log('Error connecting to database:', err);
          reject(err);
          return;
        }

        log('Connected to SQLite database');

        // Run migrations
        try {
          if (db) {
            await initDatabase(db);
            log('Database initialized');
            resolve(db);
          }
        } catch (initErr) {
          log('Error initializing database:', initErr);
          reject(initErr);
        }
      });
    } catch (err) {
      log('Failed to create database connection:', err);
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
        log('Error closing database:', err);
        reject(err);
      } else {
        db = null;
        resolve();
      }
    });
  });
};

export { connect, getDb, closeConnection };
