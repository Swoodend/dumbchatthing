import { Database } from 'sqlite3';

// TODO - probably want to only expose alice/bob in a dev specific instance of the app

// TODO - pull this work out to db migrations
export const createUsers = (db: Database): Promise<void | Error> => {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP);`,

      (err) => {
        if (err) {
          throw err;
        }

        Promise.all([
          createUser(db, 'Alice', 'alice', 'alice@aol.com'),
          createUser(db, 'BIG BOB', 'bob', 'bob@bobbysworld.com'),
        ])
          .then(() => resolve())
          .catch((err) => reject(err));
      }
    );
  });
};

export const createFriends = (db: Database): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      `
    CREATE TABLE friends (
        user_id INTEGER NOT NULL,
        friend_id INTEGER NOT NULL,
        FRIENDSHIP_DATE DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(user_id),
        FOREIGN KEY(friend_id) REFERENCES users(user_id)
    );`,
      (err) => {
        if (err) {
          return reject(err);
        }

        Promise.all([createFriend(db, 1, 2), createFriend(db, 2, 1)])
          .then(() => {
            console.log('Alice -> Bob and Bob -> Alice friendship established');
            resolve();
          })
          .catch((err) => reject(err));
      }
    );
  });
};

const createUser = (
  db: Database,
  username: string,
  password: string,
  email: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (username, password, email) VALUES (?,?,?);',
      [username, password, email],
      (err) => {
        if (err) {
          return reject(err);
        }

        console.log('created user', username);
        resolve();
      }
    );
  });
};

const createFriend = (
  db: Database,
  userId: number,
  friendId: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO friends (user_id, friend_id) VALUES (?,?)`,
      [userId, friendId],
      (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      }
    );
  });
};
