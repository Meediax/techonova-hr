import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // <--- Get the login function from context
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        // Call your backend
        const response = await axios.post('http://localhost:3000/api/auth/login', {
            email,
            password
        });
        
        // Update the global state
        login(response.data.token, response.data.user);
        
        // Redirect to Dashboard
        navigate('/dashboard');

    } catch (err) {
        alert('Login failed!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <input 
        className="border p-2 w-full mb-4" 
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input 
        className="border p-2 w-full mb-4" 
        type="password" 
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-blue-600 text-white p-2 w-full rounded">
        Log In
      </button>
    </form>
  );
};