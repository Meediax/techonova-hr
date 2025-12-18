import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Employees } from './pages/Employees';
import { TimeOff } from './pages/TimeOff';
import { Payroll } from './pages/Payroll';
import { Profile } from './pages/Profile';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthProvider, useAuth } from './context/AuthContext';

// 🛡️ The Bouncer: Checks if user is logged in
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Login */}
          <Route path="/login" element={<Login />} />

          {/* All these pages will now have the Sidebar/Menu thanks to DashboardLayout */}
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="time-off" element={<TimeOff />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Redirect any typos to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;