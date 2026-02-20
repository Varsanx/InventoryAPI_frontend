import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (username, password) => {
  try {
    console.log('🔐 AuthContext: Starting login...', { username });
    
    const response = await authService.login(username, password);
    
    console.log('✅ AuthContext: Login response received:', response);
    
    if (response.token) {
      // Store in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
      
      console.log('💾 AuthContext: Stored in localStorage');
      
      // Update state
      setUser(response);
      
      console.log('✅ AuthContext: Login complete');
      
      return response;
    } else {
      console.error('❌ AuthContext: No token in response');
      throw new Error('No token received from server');
    }
  } catch (error) {
    console.error('❌ AuthContext: Login failed:', error);
    throw error;
  }
};
  const register = async (userData) => {
    const newUser = await authService.register(userData);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
