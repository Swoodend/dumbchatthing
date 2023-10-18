import './styles.css';
import { socket } from '../../socket';
import { socketEvents } from '../../backend/socket/events';

export type Friend = {
  id: number;
  username: string;
  email: string;
};
type Props = {
  friends: Friend[];
  updateActiveChats: (friendId: number) => void;
};
const FriendList = ({ friends, updateActiveChats }: Props) => {
  const onClickFriend = (friendId: number) => {
    socket.emit(socketEvents.CREATE_ROOM, friendId);
    updateActiveChats(friendId);
  };

  return (
    <div>
      <ul>
        {friends.map((friend) => (
          <li
            key={friend.id}
            className="friend-row"
            onClick={() => onClickFriend(friend.id)}
          >
            {friend.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;
