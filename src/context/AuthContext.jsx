import { createContext, useState, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('expiry_manager_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('expiry_manager_token') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { user: userData, token: tokenData } = res.data;
      setUser(userData);
      setToken(tokenData);
      localStorage.setItem('expiry_manager_user', JSON.stringify(userData));
      localStorage.setItem('expiry_manager_token', tokenData);
      setLoading(false);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/api/auth/register', { name, email, password });
      const { user: userData, token: tokenData } = res.data;
      setUser(userData);
      setToken(tokenData);
      localStorage.setItem('expiry_manager_user', JSON.stringify(userData));
      localStorage.setItem('expiry_manager_token', tokenData);
      setLoading(false);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('expiry_manager_user');
    localStorage.removeItem('expiry_manager_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        error,
        setError,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
