import './styles.css';
import ChatActionBar from '../ChatActionBar/ChatActionBar';
import ChatReadout from '../ChatReadout/ChatReadout';

const ChatWindow = () => {
  return (
    <div className="chat-window">
      <ChatReadout />
      <ChatActionBar />
    </div>
  );
};

export default ChatWindow;
