import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  userId: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Check if user is logged in on page load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            // Restore session
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser({ userId: payload.userId, email: payload.email, role: payload.role });
          } else {
            throw new Error("Invalid token format");
          }
        } catch (err) {
          console.error("Session invalid:", err);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // 2. Login Function (Updated to manually decode token)
  const login = async (email: string, password: string) => {
    // Call backend
    const res = await axios.post('/api/auth/login', { email, password });
    
    // Get token
    const { token } = res.data;
    
    // Save token
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Decode user data from token immediately
    // This ensures we don't rely on the backend sending a separate 'user' object
    try {
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1]));
      setUser({ userId: payload.userId, email: payload.email, role: payload.role });
    } catch (e) {
      console.error("Failed to decode token", e);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; // <--- This closing brace was likely missing!

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};