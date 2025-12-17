import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Calendar, LogOut, Building2, DollarSign } from 'lucide-react';
import { UserCircle } from 'lucide-react';

export const DashboardLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to highlight the active tab
  const getLinkClass = (path: string) => {
    const baseClass = "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors";
    const activeClass = "bg-blue-50 text-blue-700";
    const inactiveClass = "text-gray-600 hover:bg-gray-50 hover:text-gray-900";
    
    return `${baseClass} ${location.pathname === path ? activeClass : inactiveClass}`;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo Area */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
            <Building2 className="w-8 h-8" />
            <span>TechNova HR</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/dashboard" className={getLinkClass('/dashboard')}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          
          <Link to="/employees" className={getLinkClass('/employees')}>
            <Users className="w-5 h-5" />
            Employees
          </Link>
          
          <Link to="/time-off" className={getLinkClass('/time-off')}>
            <Calendar className="w-5 h-5" />
            Time Off
          </Link>

          <Link to="/payroll" className={getLinkClass('/payroll')}> 
            <DollarSign className="w-5 h-5" /> Payroll
          </Link>

          <Link to="/profile" className={getLinkClass('/profile')}>
            <UserCircle className="w-5 h-5" />
            My Profile
          </Link>
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {user?.first_name?.[0] || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.first_name} User</p>
              <p className="text-xs text-gray-500 truncate">{user?.role}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet /> {/* This is where the page content (Dashboard/Profile) renders */}
        </div>
      </main>
    </div>
  );
};