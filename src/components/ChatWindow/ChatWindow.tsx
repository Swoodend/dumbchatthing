import './styles.css';
import ChatActionBar from '../ChatActionBar/ChatActionBar';
import ChatReadout from '../ChatReadout/ChatReadout';
import { Friend } from '../FriendList/FriendList';

interface Props {
  friend: Friend;
  onClose: (id: number) => void;
}

const ChatWindow = ({ friend, onClose }: Props) => {
  return (
    <div className="chat-window">
      <div onClick={() => onClose(friend.id)} className="close-button">
        x
      </div>
      <ChatReadout />
      <ChatActionBar />
    </div>
  );
};

export default ChatWindow;
