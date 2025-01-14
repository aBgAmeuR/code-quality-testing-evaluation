import { Database } from 'sqlite3';
import bcrypt from 'bcryptjs';
import { log } from '@repo/logger';

const initDatabase = (db: Database): Promise<void> =>
  new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create Users table
      db.run(
        `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          firstname TEXT,
          lastname TEXT,
          username TEXT UNIQUE,
          password TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME
        )
      `,
        (err: Error) => {
          if (err) {
            log('Error creating users table:', err);
            reject(err);
          }
        }
      );

      // Create Products table
      db.run(
        `
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          price REAL DEFAULT 0,
          stock INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT (datetime('now')),
          updated_at DATETIME
        )
      `,
        (err: Error) => {
          if (err) {
            log('Error creating products table:', err);
            reject(err);
          }
        }
      );

      // Add sample data if tables are empty
      db.get(
        'SELECT COUNT(*) as count FROM users',
        [],
        (err: Error, result: { count: number }) => {
          if (err) {
            log('Error checking users:', err);
            reject(err);
            return;
          }

          if (result.count === 0) {
            const hashedPassword = bcrypt.hashSync('admin123', 8);

            db.run(
              `
            INSERT INTO users (firstname, lastname, username, password)
            VALUES (?, ?, ?, ?)
          `,
              ['Admin', 'User', 'admin', hashedPassword],
              (err: Error) => {
                if (err) {
                  log('Error creating admin user:', err);
                  reject(err);
                }
              }
            );
          }
        }
      );

      db.get(
        'SELECT COUNT(*) as count FROM products',
        [],
        (err: Error, result: { count: number }) => {
          if (err) {
            log('Error checking products:', err);
            reject(err);
            return;
          }

          if (result.count === 0) {
            const sampleProducts = [
              ['Laptop', 999.99, 10],
              ['Smartphone', 499.99, 15],
              ['Headphones', 79.99, 20]
            ];

            sampleProducts.forEach(([name, price, stock]) => {
              db.run(
                'INSERT INTO products (name, price, stock) VALUES (?, ?, ?)',
                [name, price, stock],
                (err: Error) => {
                  if (err) log('Error inserting product:', name, err);
                }
              );
            });
          }
        }
      );

      resolve();
    });
  });

export default initDatabase;
