import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

type Props = {
  children: React.ReactElement;
  redirectTo?: string;
};

const ProtectedRoute = ({ children, redirectTo = '/login' }: Props) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    // user is not authenticated
    return <Navigate to={redirectTo} />;
  }
  return children;
};

export default ProtectedRoute;
