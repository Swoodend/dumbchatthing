import React from 'react';
import './styles.css';
import { socket } from '../../socket';
import { socketEvents } from '../../backend/socket_server/events';

const ChatActionBar = () => {
  const [text, setText] = React.useState('');

  const onSendMessage = (message: string) => {
    if (!message) return;

    socket.emit(socketEvents.CHAT_MESSAGE, message);
    setText('');
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // enter will submit the message
    // and we allow shift+enter to start a new line
    if (event.key.toLowerCase() === 'enter' && !event.shiftKey) {
      event.preventDefault();
      onSendMessage(text);
    }
  };

  return (
    <div className="chat-action-row">
      <textarea
        className="block chat-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <div className="chat-send-button-container">
        <button
          className="chat-send-button"
          value="Send"
          onClick={() => onSendMessage(text)}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatActionBar;