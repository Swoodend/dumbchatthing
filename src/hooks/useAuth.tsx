import React from 'react';
import { useNavigate } from 'react-router-dom';

type Auth = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

type Props = {
  children: React.ReactNode;
};

const AuthContext = React.createContext<Auth | null>(null);

export const AuthProvider = ({ children }: Props) => {
  const [auth, setAuth] = React.useState<Auth | null>(null);
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = React.useCallback(() => {
    setAuth({ ...auth, isLoggedIn: true });
    navigate('/');
  }, []);

  const logout = React.useCallback(() => {
    setAuth({ ...auth, isLoggedIn: false });
    navigate('/login', { replace: true });
  }, []);

  const val = React.useMemo(
    () => ({
      isLoggedIn: auth?.isLoggedIn ?? false,
      login,
      logout,
    }),
    [auth]
  );
  return <AuthContext.Provider value={val}>{children}</AuthContext.Provider>;
};

export const useAuth = (): Auth => {
  return React.useContext(AuthContext);
};
