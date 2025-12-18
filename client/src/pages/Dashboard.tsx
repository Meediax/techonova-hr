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
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 flex flex-col md:flex-row justify-between items-center border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Technova Dashboard</h1>
            <p className="text-gray-500 mt-2">Manage your HR operations seamlessly.</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 md:mt-0 bg-red-50 text-red-600 px-6 py-2.5 rounded-xl font-medium hover:bg-red-100 transition-colors border border-red-100"
          >
            Log Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 col-span-1 md:col-span-1">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mb-6">
              {user?.email?.[0].toUpperCase() || 'U'}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">User Profile</h2>
            <p className="text-sm text-gray-500 mb-6">Your active session details</p>
            
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</span>
                <span className="text-gray-900 font-medium">{user?.role || 'User'}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg overflow-hidden">
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</span>
                <span className="text-gray-900 font-medium break-all">{user?.email}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg overflow-hidden">
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">ID</span>
                <span className="text-xs text-gray-500 font-mono break-all">{user?.userId}</span>
              </div>
            </div>
          </div>

          {/* Main Content Area (Placeholder) */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 col-span-1 md:col-span-2 flex flex-col justify-center items-center text-center min-h-[400px]">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">📊</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome Aboard!</h3>
            <p className="text-gray-500 max-w-md">
              Your dashboard is ready. This is where your widgets, charts, and employee data will live.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};