import api from './api';

export const uomService = {
  getAll: () => api.get('/UOM'),
};
