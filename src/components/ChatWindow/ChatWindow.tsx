import React from 'react';
import { socket } from '../../socket';
import { socketEvents } from '../../backend/socket_server/events';

import './styles.css';
import ChatActionBar from '../ChatActionBar/ChatActionBar';
import ChatReadout from '../ChatReadout/ChatReadout';
import { Friend } from '../FriendList/FriendList';

interface Props {
  friend: Friend;
}

const ChatWindow = ({ friend }: Props) => {
  const [messages, setMessages] = React.useState<string[]>([]);
  const messagesRef = React.useRef<string[]>([]);

  React.useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  React.useEffect(() => {
    socket.on(socketEvents.CLIENT_MESSAGE, (message) => {
      setMessages([...messagesRef.current, message]);
    });
  }, []);

  const onSendMessage = (message: string) => {
    // when YOU send a message, we want to add the message you send to the chat readout
    // we don't ONLY want to add recieved messages from the socket to the readout
    setMessages([...messages, message]);
  };

  return (
    <div className="chat-window">
      <ChatReadout messages={messages} />
      <ChatActionBar friend={friend} onSend={onSendMessage} />
    </div>
  );
};

export default ChatWindow;
