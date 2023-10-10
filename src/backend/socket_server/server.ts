import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { socketEvents } from './events';

const app = express();
const server = createServer(app);
const io = new Server(server);

// when the app opens, a user should connect to the socket server
io.on(socketEvents.CONNECTION, (socket) => {
  console.log('a user connected');

  // when the user opens a chat, we shoud connect the two clients
  socket.on('chat_init', () => {});

  // when a user sends  a message
  socket.on(socketEvents.CHAT_MESSAGE, (message: string) => {
    console.log('MESSAGE:', message);
  });

  // when a user closes a chat, or closes the electron app entirely
  socket.on(socketEvents.DISCONNECT, () => {
    console.log('a user disconnected');
  });
});

server.listen(3001, () => {
  console.log('server running at http://localhost:3001');
});
