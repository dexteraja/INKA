import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  component: React.FC;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  adminOnly = false
}) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        setLocation('/login?redirect=' + encodeURIComponent(location));
      } else if (adminOnly && !isAdmin) {
        // Redirect to home if not admin but trying to access admin-only page
        setLocation('/');
      }
    }
  }, [isAuthenticated, isLoading, isAdmin, location, setLocation]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // If authenticated and meets admin requirements, render the component
  if (isAuthenticated && (!adminOnly || isAdmin)) {
    return <Component />;
  }

  // Return null while redirecting
  return null;
};