import Home from './Home/Home';
import Login from './Login/Login';
import Register from './Register/Register';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';

import { HashRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth';

const checkIsLoggedIn = (): boolean => {
  return document.cookie.indexOf('beeb_chat_jwt') !== -1;
};

const App = () => {
  /* useEffect(() => { */
  /*   socket.emit(socketEvents.CHAT_INIT, 'alice'); */
  /* }, []); */

  /* const isLoggedIn = checkIsLoggedIn(); */

  /* return isLoggedIn ? <Home /> : <Login />; */
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
