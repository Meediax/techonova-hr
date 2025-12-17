import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx' // Import it
import axios from 'axios';

// If we are in production, use the environment variable.
// If in development (localhost), use the local proxy.
// We will set VITE_API_URL in Vercel later.
if (import.meta.env.VITE_API_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>  {/* Wrap the App */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
)