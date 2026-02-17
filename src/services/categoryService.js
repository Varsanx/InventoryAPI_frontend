import api from './api';

export const categoryService = {
  getAll: () => api.get('/Categories'),
  getById: (id) => api.get(`/Categories/${id}`),
  create: (data) => api.post('/Categories', data),
  update: (id, data) => api.put(`/Categories/${id}`, data),
  delete: (id) => api.delete(`/Categories/${id}`),
};
