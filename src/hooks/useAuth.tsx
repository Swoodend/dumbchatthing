import React from 'react';
import { useNavigate } from 'react-router-dom';

type Auth = {
  userId: number | null;
  username?: string;
  isLoggedIn: boolean;
  login: (userId: number, username: string) => void;
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
  const login = React.useCallback(
    (userId: number, username: string) => {
      setAuth({ ...auth, userId, username, isLoggedIn: true });
      navigate('/');
    },
    [auth]
  );

  const logout = React.useCallback(() => {
    setAuth({ ...auth, isLoggedIn: false });
    navigate('/login', { replace: true });
  }, [auth]);

  const val = React.useMemo(
    () => ({
      userId: auth?.userId ?? null,
      isLoggedIn: auth?.isLoggedIn ?? false,
      username: auth?.username,
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
