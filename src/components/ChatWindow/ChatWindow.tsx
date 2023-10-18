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
    const updateMessages = (message: string) => {
      setMessages([...messagesRef.current, message]);
    };

    // TODO - make sure you call socket.off on all instances of socket.on when a component unmounts
    socket.on(socketEvents.CLIENT_MESSAGE, updateMessages);

    return () => {
      socket.off(socketEvents.CLIENT_MESSAGE, updateMessages);
    };
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
