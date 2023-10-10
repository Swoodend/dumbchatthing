import sqlite3 from 'sqlite3';

console.log('initiating in memory sqlite3 database');

export const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error('unable to connect to db', err);
    return;
  }

  db.run(
    `CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP);`,

    (err) => {
      if (err) {
        console.error('attempt to creat users table failed', err);
        return;
      }
      console.log('users table created successfully');
    }
  );
});
