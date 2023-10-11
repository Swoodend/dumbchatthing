import Home from './Home/Home';
import Login from './Login/Login';
import Register from './Register/Register';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';

import { HashRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth';

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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
