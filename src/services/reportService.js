import api from './api';

export const reportService = {
  getCurrentStock: (params) => api.get('/Reports/CurrentStock', { params }),
  exportCurrentStock: (params) => {
    return api.get('/Reports/CurrentStock/Export', {
      params,
      responseType: 'blob',
    });
  },
};
