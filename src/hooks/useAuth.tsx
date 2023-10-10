import React from 'react';
import { useNavigate } from 'react-router-dom';

type Auth = {
  email: string;
  userId: string;
  login: (auth: Auth) => void;
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
  const login = async (data: Auth) => {
    setAuth(data);
    navigate('/');
  };

  const logout = React.useCallback(() => {
    setAuth(null);
    navigate('/login', { replace: true });
  }, []);

  const val = React.useMemo(
    () => ({
      email: auth?.email,
      userId: auth?.userId,
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
