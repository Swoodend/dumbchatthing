import { useEffect } from 'react';
import Home from './Home/Home';
import { socket } from '../socket';
import { socketEvents } from '../backend/socket_server/events';

const App = () => {
  useEffect(() => {
    socket.emit(socketEvents.CHAT_INIT, 'alice');
  }, []);

  return <Home />;
};

export default App;
