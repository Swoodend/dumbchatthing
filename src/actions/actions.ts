import { Socket } from 'socket.io-client';
import { socketEvents } from '../backend/socket/events';
import { ServerMessagePayload } from '../backend/socket/server';

export const actions = {
  SEND_SERVER_MESSAGE: (socket: Socket, payload: ServerMessagePayload) => {
    socket.emit(socketEvents.SERVER_MESSAGE, payload);
  },
};
