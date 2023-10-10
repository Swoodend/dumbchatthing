import React from 'react';
import FriendList, { Friend } from '../FriendList/FriendList';
import ChatWindow from '../ChatWindow/ChatWindow';

const friends: Friend[] = [
  { id: 'joe', displayName: 'BIG JOE', email: 'jmontana@nfl.com' },
];

const Home = () => {
  const [activeChats, setActiveChats] = React.useState([]);

  return (
    <div>
      <div>Welcome to beebchat</div>
      <FriendList friends={friends} />
      <ChatWindow />
    </div>
  );
};

export default Home;
