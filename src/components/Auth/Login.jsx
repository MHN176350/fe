import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import api from '../../api/apis';
import { isTokenExpired } from '../../utils/jwt';

const Login = ({setUser}) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
      navigate('/warehouses');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (credentials.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    try {
      const response = await api.post('/api/auth/login', credentials);
      const userData = response.data.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token);
      navigate('/warehouses'); 
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-red-400 to-blue-300">
      <div className="bg-gray-500 bg-opacity-30 p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col items-center transition duration-500 ease-in-out transform hover:scale-105">
        <div className="mb-6">
          <svg className="w-16 h-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12l2 2 4-4" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-white mb-2 text-center">Sign i  n to your account</h2>
        <p className="text-gray-400 mb-6 text-center text-sm">Welcome back! Please enter your credentials.</p>
        {error && <div className="mb-4 text-red-400 text-center w-full">{error}</div>}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder='Enter your username'
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              autoComplete="username"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder='Enter your password'
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              autoComplete="current-password"
            />
            <div className="place-self-center text-gray-300">
              Don't Have an account?
              <a href="signup" className='text-blue-400 hover:underline-offset-2'> Create Now</a>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-blue-400 to-white text-white font-semibold text-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;