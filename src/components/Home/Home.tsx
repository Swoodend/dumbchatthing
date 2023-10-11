import React from 'react';
import FriendList, { Friend } from '../FriendList/FriendList';
import ChatWindow from '../ChatWindow/ChatWindow';
import { useAuth } from '../../hooks/useAuth';

const Home = () => {
  const [friends, setFriends] = React.useState<Friend[]>([]);
  const [activeChats, setActiveChats] = React.useState<number[]>([]);
  const { userId } = useAuth();

  React.useEffect(() => {
    const fetchFriends = async () => {
      // fetch this endpoint, JWT must be passed which contains the userid
      // start building this endpoint out
      const friendResponse = await fetch(
        `http://localhost:3001/friends/${userId}`
      );

      const friends = await friendResponse.json();
      setFriends(friends);
    };

    fetchFriends();
  }, []);

  return (
    <div>
      <div>Welcome to beebchat</div>
      <FriendList
        friends={friends}
        updateActiveChats={(friendId: number) =>
          setActiveChats([...activeChats, friendId])
        }
      />
      {activeChats.map((friendId: number) => (
        <ChatWindow
          key={friendId}
          friend={friends.find((friend) => friend.id === friendId)}
          onClose={(friendId: number) =>
            setActiveChats(
              activeChats.filter((activeChat) => activeChat !== friendId)
            )
          }
        />
      ))}
    </div>
  );
};

export default Home;
