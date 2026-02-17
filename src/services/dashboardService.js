import api from './api';

export const dashboardService = {
  getSummary: () => api.get('/Dashboard/Summary'),
  getLowStock: (top = 10) => api.get('/Dashboard/LowStock', { params: { top } }),
  getRecentTransactions: (top = 10) => api.get('/Dashboard/RecentTransactions', { params: { top } }),
};
