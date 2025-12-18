import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Technova Dashboard</h1>
            <p className="text-gray-500">Welcome back!</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Log Out
          </button>
        </div>

        {/* User Details Section */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">User Profile</h2>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="font-bold w-24 text-gray-600">ID:</span>
              <span className="font-mono bg-white px-2 py-1 rounded border">
                {user?.userId || 'No ID Found'}
              </span>
            </div>
            
            <div className="flex items-center">
              <span className="font-bold w-24 text-gray-600">Email:</span>
              <span className="text-gray-800">
                {user?.email || 'No Email Found'}
              </span>
            </div>

            <div className="flex items-center">
              <span className="font-bold w-24 text-gray-600">Role:</span>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {user?.role || 'User'}
              </span>
            </div>
          </div>
        </div>

        {/* Placeholder Content */}
        <div className="mt-8 text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-400">Dashboard widgets will go here.</p>
        </div>
      </div>
    </div>
  );
};