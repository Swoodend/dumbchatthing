import React from 'react';
import FriendList, { Friend } from '../../components/FriendList/FriendList';
import ChatWindow from '../../components/ChatWindow/ChatWindow';
import UserMenu from '../../components/UserMenu/UserMenu';
import { useAuth } from '../../hooks/useAuth';
import { socketEvents } from '../../backend/socket_server/events';
import { socket } from '../../socket';

import './styles';

export type FriendRequest = { from: { email: string; username: string } };

const Home = () => {
  const [friends, setFriends] = React.useState<Friend[]>([]);
  const [activeChats, setActiveChats] = React.useState<number[]>([]);
  const [friendRequests, setFriendRequests] = React.useState<FriendRequest[]>(
    []
  );
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

  React.useEffect(() => {
    socket.on(socketEvents.FRIEND_REQUEST, (friendRequest: FriendRequest) => {
      setFriendRequests([friendRequest, ...friendRequests]);

      // friends UI will be present them with a "new friend request" badge on emit
      // they can click the badge, open the "accept friend modal thing" and click "accept friend"
      // if they click "accept friend" we fire off a REST call to establish the friendship in the DB
      // emit a "FRIEND ACCEPTED" event, the UI can then add that friend to your list so no page refresh necessary
      // once the page is reloaded, the friend(s) will be loaded from the DB
    });
  }, []);

  return (
    <div>
      <div>Welcome to beebchat</div>
      <div className="justify-end">
        <UserMenu friendRequests={friendRequests} />
      </div>
      <FriendList
        friends={friends}
        updateActiveChats={(friendId: number) => {
          if (activeChats.indexOf(friendId) > -1) return;
          setActiveChats([...activeChats, friendId]);
        }}
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
