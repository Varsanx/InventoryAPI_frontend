import api from './api';

export const transactionService = {
  getAll: (params) => api.get('/StockTransactions', { params }),
  getById: (id) => api.get(`/StockTransactions/${id}`),
  createInward: (data) => api.post('/StockTransactions/Inward', data),
  createOutward: (data) => api.post('/StockTransactions/Outward', data),
  createAdjustment: (data) => api.post('/StockTransactions/Adjustment', data),
};