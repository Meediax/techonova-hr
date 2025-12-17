import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import axios from 'axios'
import { AuthProvider } from './context/AuthContext' // <--- 1. Import the Provider

// --- ENVIRONMENT CONFIGURATION ---
if (import.meta.env.VITE_API_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
} else {
  axios.defaults.baseURL = 'http://localhost:3000';
}

console.log('--- APP STARTING ---');
console.log('Environment:', import.meta.env.MODE);
console.log('API Target:', axios.defaults.baseURL);
// ---------------------------------

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. Wrap the App component so the whole app has access to Login Data */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)