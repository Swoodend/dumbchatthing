import { socketEvents } from '../../backend/socket_server/events';
import React from 'react';
import { socket } from '../../socket';
import './styles.css';
const ChatReadout = () => {
  const [messages, setMessages] = React.useState<string[]>([]);

  React.useEffect(() => {
    socket.on(socketEvents.CLIENT_MESSAGE, (message) => {
      setMessages([...messages, message]);
    });
  }, []);

  return (
    <div className="chat-readout-container">
      <div className="chat-readout">
        {messages.map((msg) => {
          <p style={{ padding: '10px 0px' }}>{msg}</p>;
        })}
      </div>
    </div>
  );
};

export default ChatReadout;
