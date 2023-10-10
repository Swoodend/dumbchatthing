import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { socketEvents } from './events';
import bodyParser from 'body-parser';

type SocketID = string;

type ClientRepo = {
  [clientId: string]: SocketID;
};

export type ServerMessagePayload = {
  message: string;
  destinationClientId: string;
  sender: string;
};

const app = express();
const server = createServer(app);
const io = new Server(server);

const clientRepo: ClientRepo = {};

// when the app opens, a user should connect to the socket server
io.on(socketEvents.CONNECTION, (socket) => {
  // after the client app spins up, lets add the client to our map
  socket.on(socketEvents.CHAT_INIT, (clientId: string) => {
    clientRepo[clientId] = socket.id;
  });

  // when a client sends a message to the server
  socket.on(socketEvents.SERVER_MESSAGE, (payload: ServerMessagePayload) => {
    console.log('PAYLOAD:', payload);
    const destinationSocket = clientRepo[payload.destinationClientId];

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
    console.log('a user disconnected');
  });
});

app.use(bodyParser.json());

app.post('/login', (req, res) => {
  console.log('POSTED TO /login, GOT BODY', req.body);
  res.sendStatus(200);
});

app.post('/register', (req, res) => {
  console.log('POSTED TO /register, GOT BODY', req.body);
  res.sendStatus(200);
});

server.listen(3001, () => {
  console.log('server running at http://localhost:3001');
});
