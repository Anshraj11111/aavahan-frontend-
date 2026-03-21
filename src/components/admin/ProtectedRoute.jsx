import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { STORAGE_KEYS } from '../../constants';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    console.log('ProtectedRoute: Checking authentication...');
    console.log('Current location:', location.pathname);
    
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const adminToken = localStorage.getItem('adminToken');
    
    console.log('AUTH_TOKEN:', token);
    console.log('adminToken:', adminToken);
    console.log('AUTH_TOKEN exists:', !!token);
    console.log('adminToken exists:', !!adminToken);
    
    // Check if either token exists
    const isAuth = !!(token || adminToken);
    console.log('Is authenticated:', isAuth);
    
    setIsAuthenticated(isAuth);
  }, [location.pathname]);

  if (isAuthenticated === null) {
    // Loading state
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-white">Checking authentication...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login...');
    return <Navigate to="/admin/login" replace />;
  }

  console.log('Authenticated, rendering protected content');
  return children;
};

export default ProtectedRoute;