import axios from 'axios';
import { isTokenExpired } from '../utils/jwt';
import { Navigate } from 'react-router-dom';

const api = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use((config) => {
  
  if (
    config.url.includes('/api/auth/login') ||
    config.url.includes('/api/auth/register')
  ) {
    return config;
  }

  const token = localStorage.getItem('token');
  if (token && !isTokenExpired(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    throw new axios.Cancel('Session expired');
  }
  return config;
});
export default api;