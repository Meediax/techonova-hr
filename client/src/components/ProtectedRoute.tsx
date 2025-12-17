import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // 1. Wait for the Auth Check to finish
  // Without this, the app might redirect you while it's still checking LocalStorage
  if (isLoading) {
    return <div className="p-10">Loading...</div>; // Or a nice spinner component
  }

  // 2. If not logged in, kick them out
  if (!isAuthenticated) {
    // "replace" prevents them from hitting "Back" to return to the protected page
    return <Navigate to="/login" replace />;
  }

  // 3. If authorized, render the child route (The Dashboard)
  return <Outlet />;
};