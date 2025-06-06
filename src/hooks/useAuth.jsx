import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenExpired } from '../utils/jwt';

export function useAuth(redirectPath = '/login') {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate(redirectPath);
    }
  }, [navigate, redirectPath]);
}