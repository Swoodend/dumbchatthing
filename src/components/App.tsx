import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';

import { HashRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth';
import AddFriend from './AddFriend/AddFriend';
import '@szhsin/react-menu/dist/core.css';

const App = () => {
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
          <Route
            path="/add-friend"
            element={
              <ProtectedRoute>
                <AddFriend />
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
