import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (_req, res) => {
  res.send('<h1>Hello world</h1>');
});

// when the app opens, a user should connect to the socket server
io.on('connection', () => {
  console.log('a user connected');
});

// when the user opens a chat, we shoud connect the two clients
io.on('chat_init', () => {});

// when a user closes a chat, or closes the electron app entirely
io.on('disconnect', () => {
  console.log('a user disconnected');
});

server.listen(3001, () => {
  console.log('server running at http://localhost:3001');
});
