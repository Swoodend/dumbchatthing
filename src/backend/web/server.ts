import express from 'express';
import https from 'https';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '../db/db';
import { RunResult } from 'sqlite3';
import { socketEvents } from '../socket/events';
import { Friend } from '../../components/FriendList/FriendList';
import { userIdToSocketMap } from '../socket/server';

dotenv.config();

type jwtToken = {
  username: string;
  email: string;
  id: number;
};

const app = express();
export const server = https.createServer(
  {
    key: fs.readFileSync(
      path.resolve(__dirname, '../../../localhost+2-key.pem')
    ),
    cert: fs.readFileSync(path.resolve(__dirname, '../../../localhost+2.pem')),
  },
  app
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // find user
  const userQuery = 'SELECT * FROM users WHERE email=?';
  db.get(
    userQuery,
    [email],
    (error, user: { id: number; password: string; username: string }) => {
      if (error) {
        console.error('something went wrong in /login', email);
        res.sendStatus(500);
        return;
      }
      if (user && bcrypt.compareSync(user.password, password)) {
        const responsePayload = {
          id: user.id,
          email,
          username: user.username,
        };

        const token = jwt.sign(responsePayload, process.env.JWT_SECRET);
        res.cookie('jwt', token, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        });
        res.status(200).json(responsePayload);
      } else {
        console.error('Incorrect login');
        res.sendStatus(401);
      }
    }
  );
});

app.post('/register', (req, res) => {
  const { email, password, username } = req.body;

  const hashedPass = bcrypt.hashSync(password, 10);
  // create user and save to db
  // TODO - all these queries can get pulled out somewhere so they aren't  redefined over and over for each request
  const user = 'INSERT INTO users (username, email, password) VALUES (?,?,?)';

  db.run(
    user,
    [username, email, hashedPass],
    function (_result: RunResult, error: Error) {
      if (error) {
        console.error('REGISTRATION ERROR', error);
        // check it is a duplicate error
        res.sendStatus(400);
        return;
      }

      const responsePayload: jwtToken = {
        id: this.lastId,
        email,
        username,
      };

      const token = jwt.sign(responsePayload, process.env.JWT_SECRET);
      res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      res.status(200).json(responsePayload);
      console.log('ADDED TO DB');
    }
  );
});

app.get('/friends/:userId', (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.sendStatus(400);
  }

  try {
    const userData = jwt.verify(token, process.env.JWT_SECRET) as jwtToken;
    const friendsQuery = `SELECT id, username, email FROM users INNER JOIN friends on users.id = friends.user_id WHERE friends.friend_id = ?`;

    db.all(friendsQuery, [userData.id], (err, friends: Friend[]) => {
      if (err) {
        console.error('friends query failed', err);
        return res.sendStatus(500);
      }

      return res.status(200).json(
        friends.map(({ id, username, email }) => ({
          id,
          username,
          email,
        }))
      );
    });
  } catch (err) {
    // catch the jwt.verify with an invalid secret
    return res.sendStatus(401);
  }
});

// this route creates a new friend request
app.post('/add-friend', (req, res) => {
  // send /post to server
  const { friendEmail } = req.body;
  const token = req.cookies.jwt;

  try {
    // server will validate JWT
    const userData = jwt.verify(token, process.env.JWT_SECRET) as jwtToken;
    const userQuery = `SELECT id, username, email FROM users WHERE email=?`;

    db.get(userQuery, [friendEmail], (err: Error, friend: Friend) => {
      if (err) {
        console.error(err);
        throw new Error('ERR FINDING FRIEND EMAIL!');
      }

      // server will validate friend exists
      if (!friend) {
        throw new Error('FRIEND NOT FOUND AT THAT EMAIL');
      }

      // server will emit new friend event to the user
      const friendSocket = userIdToSocketMap.get(friend.id);
      friendSocket.emit(socketEvents.FRIEND_REQUEST, {
        from: { email: userData.email, username: userData.username },
      });
      return res.sendStatus(200);
    });
  } catch (err) {
    console.error('JWT IS INVALID');
  }
});

// TODO - create the friend relationship in SQL
app.post('/accept-friend', () => {});

server.listen(3001, () => {
  console.log('server running at http://localhost:3001');
});
