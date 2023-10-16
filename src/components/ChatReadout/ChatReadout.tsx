import { socketEvents } from '../../backend/socket_server/events';
import React from 'react';
import { socket } from '../../socket';
import './styles.css';

type Props = {
  messages: string[];
};

const ChatReadout = ({ messages }: Props) => {
  return (
    <div className="chat-readout-container">
      <div className="chat-readout">
        {messages.map((msg) => {
          <p key={msg} style={{ padding: '10px 0px' }}>
            {msg}
          </p>;
        })}
      </div>
    </div>
  );
};

export default ChatReadout;
