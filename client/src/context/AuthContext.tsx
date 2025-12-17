import { createContext, useContext, useState, useEffect } from 'react';
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
        // Set default header for all future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          // 👇 NOTICE: No "http://localhost:3000" here. Just the path.
          // Axios will verify the token with the backend
          // (Assuming you have a verify route, or we just decode the token locally)
          // For simplicity in this project, we often just trust the token exists:
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser({ userId: payload.userId, email: payload.email, role: payload.role });
        } catch (err) {
          console.error("Invalid token", err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // 2. Login Function
  const login = async (email: string, password: string) => {
    // 👇 CRITICAL FIX: Remove "http://localhost:3000"
    // Use the relative path so it uses the baseURL from main.tsx
    const res = await axios.post('/api/auth/login', { email, password });
    
    const { token, user: userData } = res.data;
    localStorage.setItem('token', token);
    
    // Set header for future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
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
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};