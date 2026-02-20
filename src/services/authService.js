import api from './api';

export const authService = {
  login: async (username, password) => {
    try {
      console.log('🌐 authService: Sending login request...', { username });
      
      const response = await api.post('/Auth/Login', {
        username,
        password
      });
      
      console.log('✅ authService: Login response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ authService: Login error:', error);
      
      if (error.response) {
        // Server responded with error status
        console.error('Server error response:', {
          status: error.response.status,
          data: error.response.data
        });
      } else if (error.request) {
        // Request made but no response
        console.error('No response from server. Backend may not be running.');
      }
      
      throw error;
    }
  },

  logout: () => {
    console.log('🚪 authService: Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};
