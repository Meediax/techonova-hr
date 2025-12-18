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
    console.log("🚀 Sending Login Request...");
    
    const res = await axios.post('/api/auth/login', { email, password });
    
    // 👇 THIS LOG WILL REVEAL THE TRUTH
    console.log("✅ SERVER RESPONSE:", res.data); 

    // Try to find the token (Handle both common names)
    const token = res.data.token || res.data.accessToken || res.data.access_token;

    if (!token) {
      console.error("❌ NO TOKEN FOUND in response!", res.data);
      throw new Error("Server sent 200 OK, but no token found.");
    }

    // Save and Decode
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    try {
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1]));
      setUser({ userId: payload.userId, email: payload.email, role: payload.role });
    } catch (e) {
      console.error("⚠️ Token decode failed (but login succeeded):", e);
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