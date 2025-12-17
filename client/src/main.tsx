import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import axios from 'axios'

// --- ENVIRONMENT CONFIGURATION ---

// 1. Check if we are in Production (Vercel) or Development (Localhost)
if (import.meta.env.VITE_API_URL) {
  // If Vercel set the variable, use it!
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
} else {
  // Fallback for local development
  axios.defaults.baseURL = 'http://localhost:3000';
}

// 2. Log the URL to the browser console so we can debug
console.log('--- APP STARTING ---');
console.log('Environment:', import.meta.env.MODE);
console.log('API Target:', axios.defaults.baseURL);

// ---------------------------------

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)