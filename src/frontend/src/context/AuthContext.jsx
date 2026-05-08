import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

// Helper function to decode JWT token
function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const claims = JSON.parse(decodedPayload);
    
    // Extract user info from JWT claims
    return {
      userId: claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
      username: claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      email: claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']
    };
  } catch (err) {
    console.error('Failed to decode token:', err);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // On mount, restore user from token if it exists
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      console.log('🔐 AuthContext: Found token in localStorage, decoding user info...');
      const userFromToken = decodeToken(storedToken);
      if (userFromToken) {
        console.log('🔐 AuthContext: User restored from token:', userFromToken);
        setUser(userFromToken);
      }
    }
  }, []);

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
  console.log('🔐 useAuth hook called - current user:', context.user, 'token:', context.token ? 'exists' : 'missing');
  return context;
};

