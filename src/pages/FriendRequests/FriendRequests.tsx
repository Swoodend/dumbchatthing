import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
const FriendRequests = () => {
  const location = useLocation();
  const friendRequests = location.state.friendRequests;

  return friendRequests && friendRequests.length ? (
    <p>you have friend requests!</p>
  ) : (
    <p>
      no friend requests :(<Link to="/add-friend">Add a friend</Link>
    </p>
  );
};

export default FriendRequests;
