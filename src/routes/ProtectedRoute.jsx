import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, userProfile } = useAppContext();

  if (!isAuthenticated || !userProfile) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
    // If the user is trying to access a route not allowed for their role,
    // redirect them to their default dashboard.
    return <Navigate to={ProtectedRoute.getRedirectPath(userProfile.role)} replace />;
  }

  return <Outlet />;
};

ProtectedRoute.getRedirectPath = (role) => {
  switch (role) {
    case 'admin':
    case 'project_owner':
      return '/dashboard';
    case 'worker':
      return '/worker/dashboard';
    case 'laboratory':
      return '/lab/dashboard';
    default:
      return '/login';
  }
};

export default ProtectedRoute;