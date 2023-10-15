import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { Server } from 'socket.io';
import { socketEvents } from './events';
import bodyParser from 'body-parser';
import { db } from '../db/db';
import { RunResult } from 'sqlite3';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { Friend } from '../../components/FriendList/FriendList';
import { Socket } from 'socket.io-client';
import dotenv from 'dotenv';

dotenv.config();

// TODO - move to env var
const JWT_SECRET = process.env.JWT_SECRET;

type jwtToken = {
  username: string;
  email: string;
  id: number;
};

export type ServerMessagePayload = {
  message: string;
  destinationClientId: number;
};

const app = express();
const server = https.createServer(
  {
    key: fs.readFileSync(
      path.resolve(__dirname, '../../../localhost+2-key.pem')
    ),
    cert: fs.readFileSync(path.resolve(__dirname, '../../../localhost+2.pem')),
  },
  app
);
const io = new Server(server);

const userIdToSocketMap = new Map<number, Socket>();
const socketIdToUserIdMap = new Map<string, number>();

// TODO - pull socket logic out to it's own module
// when the app opens, a user should connect to the socket server
io.on(socketEvents.CONNECTION, (socket) => {
  // TODO - after login, lets add the client to our map
  socket.on(socketEvents.CHAT_INIT, (userId: number) => {
    userIdToSocketMap.set(userId, socket);
    socketIdToUserIdMap.set(socket.id, userId);
  });

  // when a client sends a message to the server
  socket.on(socketEvents.SERVER_MESSAGE, (payload: ServerMessagePayload) => {
    console.log('PAYLOAD:', payload);
    const destinationSocket = userIdToSocketMap.get(
      payload.destinationClientId
    );

    if (!destinationSocket) {
      console.log('you fucked up');
      return;
    }

    socket
      .to(destinationSocket)
      .emit(socketEvents.CLIENT_MESSAGE, payload.message);
  });

  // when a user closes a chat, or closes the electron app entirely
  socket.on(socketEvents.DISCONNECT, () => {
    const userId = socketIdToUserIdMap.get(socket.id);
    if (userId) {
      userIdToSocketMap.delete(userId);
    }
    socketIdToUserIdMap.delete(socket.id);
    console.log('a user disconnected');
  });
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  // TODO -  salt/hash the password

  console.log('LOGIN ROUTE HIT', req.body);
  // find user
  const userQuery = 'SELECT * FROM users WHERE email=?';
  db.get(
    userQuery,
    [email],
    // TODO - where to type these responses?
    (error, user: { id: number; password: string; username: string }) => {
      console.log('EXECUTED A QUERY');
      if (error) {
        console.error('something went wrong', email);
        res.sendStatus(500);
        return;
      }

      //TODO - salt/hash this shit
      if (user && user?.password === password) {
        const responsePayload = {
          id: user.id,
          email,
          username: user.username,
        };

        const token = jwt.sign(responsePayload, JWT_SECRET);
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

// TODO - pull REST stuff out to it's own module
app.post('/register', (req, res) => {
  const { email, password, username } = req.body;
  // TODO -  salt/hash the password
  // create user and save to db
  // TODO - all these queries can get pulled out somewhere so they aren't  redefined over and over for each request
  const user = 'INSERT INTO users (username, email, password) VALUES (?,?,?)';

  db.run(
    user,
    [username, email, password],
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

      const token = jwt.sign(responsePayload, JWT_SECRET);
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
    const userData = jwt.verify(token, JWT_SECRET) as jwtToken;
    const friendsQuery = `SELECT id, username, email FROM users INNER JOIN friends on users.id = friends.user_id WHERE friends.friend_id = ?`;

    console.log('UD', userData);

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
    const userData = jwt.verify(token, JWT_SECRET) as jwtToken;
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
