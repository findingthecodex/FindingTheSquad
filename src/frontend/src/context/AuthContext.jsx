import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (email, password) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await authService.login(email, password);
      const { token, userId, username } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser({ userId, username, email });
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email, username, password) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await authService.register(email, username, password);
      const { token, userId } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser({ userId, username, email });
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError('');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, register, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

