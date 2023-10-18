import { server } from '../web/server';
import { Server } from 'socket.io';
import { socketEvents } from './events';
import { Socket } from 'socket.io-client';
import dotenv from 'dotenv';

dotenv.config();

export type ServerMessagePayload = {
  message: string;
  destinationClientId: number;
};

const io = new Server(server);

export const userIdToSocketMap = new Map<number, Socket>();
export const socketIdToUserIdMap = new Map<string, number>();

// TODO - pull socket logic out to it's own module
// when the app opens, a user should connect to the socket server
io.on(socketEvents.CONNECTION, (socket) => {
  // after login, lets add the client to our map
  socket.on(socketEvents.CHAT_INIT, (userId: number) => {
    userIdToSocketMap.set(userId, socket);
    socketIdToUserIdMap.set(socket.id, userId);
  });

  // when a client sends a message to the server
  socket.on(socketEvents.SERVER_MESSAGE, (payload: ServerMessagePayload) => {
    const destinationSocket = userIdToSocketMap.get(
      payload.destinationClientId
    );

    if (!destinationSocket) {
      console.log('you fucked up');
      return;
    }

    console.log(
      `SERVER_MESSAGE heard on the server. Sending CLIENT_MESSAGE event to userid: ${payload.destinationClientId}`
    );

    try {
      socket
        .to(destinationSocket.id)
        .emit(socketEvents.CLIENT_MESSAGE, payload.message);
    } catch (err) {
      console.error('ERRROR WHEN SENDING SOCKET.CLIENT_MESSAGE', err);
    }
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
