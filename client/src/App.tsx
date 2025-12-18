import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

// 🛡️ Guard Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading User Data...</div>;
  }

  if (!user) {
    // If not logged in, kick back to login
    return <Navigate to="/login" replace />;
  }

  // If logged in, show the page
  return children;
};

// 🧭 Main App Component
function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider is NOW strictly inside the Router */}
      <AuthProvider>
        <Routes>
          {/* Login Page */}
          <Route path="/login" element={<Login />} />

          {/* Protected Dashboard */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;