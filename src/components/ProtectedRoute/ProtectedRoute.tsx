import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

type Props = {
  children: React.JSX.Element;
  redirectTo?: string;
};

const ProtectedRoute = ({ children, redirectTo = '/login' }: Props) => {
  const { userId } = useAuth();

  if (!userId) {
    // user is not authenticated
    return <Navigate to={redirectTo} />;
  }
  return children;
};

export default ProtectedRoute;
