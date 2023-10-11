import React from 'react';
import FriendList, { Friend } from '../FriendList/FriendList';
import ChatWindow from '../ChatWindow/ChatWindow';
import { useAuth } from '../../hooks/useAuth';

const friends: Friend[] = [
  { id: 'joe', displayName: 'BIG JOE', email: 'jmontana@nfl.com' },
];

const Home = () => {
  const [activeChats, setActiveChats] = React.useState([]);
  const { userId } = useAuth();

  React.useEffect(() => {
    const fetchFriends = async () => {
      // fetch this endpoint, JWT must be passed which contains the userid
      const friendResponse = await fetch(
        `http://localhost:3000/friends/${userId}`
      );
      const friends = await friendResponse.json();
    };

    fetchFriends();
  }, []);

  return (
    <div>
      <div>Welcome to beebchat</div>
      <FriendList friends={friends} />
      <ChatWindow />
    </div>
  );
};

export default Home;
