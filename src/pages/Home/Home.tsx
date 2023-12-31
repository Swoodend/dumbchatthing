import React from 'react';
import FriendList, { Friend } from '../../components/FriendList/FriendList';
import ChatWindow from '../../components/ChatWindow/ChatWindow';
import WindowPortal from '../../components/WindowPortal/WindowPortal';
import UserMenu from '../../components/UserMenu/UserMenu';
import { useAuth } from '../../hooks/useAuth';
import { socketEvents } from '../../backend/socket/events';
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
      const friendResponse = await fetch(
        `${process.env.API_URL}/friends/${userId}`,
        { credentials: 'include' }
      );

      const friends = await friendResponse.json();
      setFriends(friends);
    };

    fetchFriends();
  }, []);

  React.useEffect(() => {
    const updateFriends = (friendRequest: FriendRequest) => {
      setFriendRequests([friendRequest, ...friendRequests]);
    };

    // friends UI will be present them with a "new friend request" badge on emit
    // they can click the badge, open the "accept friend modal thing" and click "accept friend"
    // if they click "accept friend" we fire off a REST call to establish the friendship in the DB
    // emit a "FRIEND ACCEPTED" event, the UI can then add that friend to your list so no page refresh necessary
    // once the page is reloaded, the friend(s) will be loaded from the DB
    socket.on(socketEvents.FRIEND_REQUEST, updateFriends);

    return () => {
      socket.off(socketEvents.FRIEND_REQUEST, updateFriends);
    };
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
        <WindowPortal
          key={friendId}
          friendId={friendId}
          mainWindow={window}
          onClose={(friendId: number) => {
            setActiveChats(
              activeChats.filter((activeChat) => activeChat !== friendId)
            );
          }}
        >
          <ChatWindow
            friend={friends.find((friend) => friend.id === friendId)}
          />
        </WindowPortal>
      ))}
    </div>
  );
};

export default Home;
