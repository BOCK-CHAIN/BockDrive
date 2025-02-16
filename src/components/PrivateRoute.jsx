import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

function PrivateRoute({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
