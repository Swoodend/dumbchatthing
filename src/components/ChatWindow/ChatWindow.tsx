import React from 'react';
import { socket } from '../../socket';
import { socketEvents } from '../../backend/socket_server/events';

import './styles.css';
import ChatActionBar from '../ChatActionBar/ChatActionBar';
import ChatReadout from '../ChatReadout/ChatReadout';
import { Friend } from '../FriendList/FriendList';

interface Props {
  friend: Friend;
  onClose: (id: number) => void;
}

const ChatWindow = ({ friend, onClose }: Props) => {
  const [messages, setMessages] = React.useState<string[]>([]);
  React.useEffect(() => {
    socket.on(socketEvents.CLIENT_MESSAGE, (message) => {
      console.log('the socket ran and heard message:', message);
      setMessages([...messages, message]);
    });

    console.log(
      'socket listener setup complete. listening for CLIENT_MESSAGE EVENTS'
    );
  }, []);
  return (
    <div className="chat-window">
      <div onClick={() => onClose(friend.id)} className="close-button">
        x
      </div>
      <ChatReadout />
      <ChatActionBar friend={friend} />
    </div>
  );
};

export default ChatWindow;
