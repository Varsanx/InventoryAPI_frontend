import api from './api';

export const alertService = {
  getAll: (params) => api.get('/Alerts', { params }),
  acknowledge: (id, userId) => api.post(`/Alerts/Acknowledge/${id}`, userId),
  generate: () => api.post('/Alerts/Generate'),
};
