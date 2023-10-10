import Home from './Home/Home';
import Login from './Login/Login';

const checkIsLoggedIn = (): boolean => {
  return document.cookie.indexOf('beeb_chat_jwt') !== -1;
};

const App = () => {
  /* useEffect(() => { */
  /*   socket.emit(socketEvents.CHAT_INIT, 'alice'); */
  /* }, []); */

  const isLoggedIn = checkIsLoggedIn();

  return isLoggedIn ? <Home /> : <Login />;
};

export default App;
