import api from './api';

export const itemService = {
  getAll: (params) => api.get('/Items', { params }),
  getById: (id) => api.get(`/Items/${id}`),
  getStock: (id) => api.get(`/Items/${id}/stock`),
  create: (data) => api.post('/Items', data),
  update: (id, data) => api.put(`/Items/${id}`, data),
  delete: (id) => api.delete(`/Items/${id}`),
};
