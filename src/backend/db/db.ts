import sqlite3 from 'sqlite3';
import { createUsers, createFriends } from './seed';

console.log('initiating in memory sqlite3 database');

export const db = new sqlite3.Database(':memory:', async (err) => {
  if (err) {
    return console.error('unable to connect to db', err);
  }
  try {
    await createUsers(db);
    await createFriends(db);
  } catch (err) {
    console.error('error when init db:', err);
  }
});
