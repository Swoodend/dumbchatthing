import './styles.css';
import { socket } from '../../socket';
import { socketEvents } from '../../backend/socket_server/events';

export type Friend = {
  id: string;
  displayName: string;
  email: string;
};
type Props = {
  friends: Friend[];
};
const FriendList = ({ friends }: Props) => {
  const onClickFriend = (friendId: string) => {
    socket.emit(socketEvents.CREATE_ROOM, friendId);
  };

  return (
    <div>
      <ul>
        {friends.map((friend) => (
          <li
            className="friend-row"
            onClick={() => onClickFriend(friend.id)}
            key={friend.id}
          >
            {friend.displayName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;
