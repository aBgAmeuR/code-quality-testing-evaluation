import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sqlite3 from 'sqlite3';
import { log } from '@repo/logger';
import initDatabase from './migrations/init';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    db.close((err) =>
      err ? reject(log('Error closing database:', err)) : resolve()
    );
  });
};

export { connect, getDb, closeConnection };