import axiosClient from './axiosClient';

/**
 * SIPANGAN API Services
 * Strictly follows API_DOCUMENTATION.md
 */

export const authService = {
  login: (credentials) => axiosClient.post('/auth/login', credentials),
  refresh: () => axiosClient.put('/auth/refresh'),
  logout: () => axiosClient.delete('/auth/logout'),
};

export const commodityService = {
  getAll: () => axiosClient.get('/commodities'),
  create: (data) => axiosClient.post('/commodities', data),
  update: (id, data) => axiosClient.put(`/commodities/${id}`, data),
  delete: (id) => axiosClient.delete(`/commodities/${id}`),
};

export const priceService = {
  getHistory: (params) => axiosClient.get('/prices', { params }),
  getOverview: () => axiosClient.get('/prices/overview'),
  create: (data) => axiosClient.post('/prices', data),
  update: (id, data) => axiosClient.put(`/prices/${id}`, data),
  delete: (id) => axiosClient.delete(`/prices/${id}`),
};

export const predictionService = {
  getPrediction: (commodity, region) => 
    axiosClient.get('/predict', { params: { commodity, region } }),
};

export const mapService = {
  getMapData: () => axiosClient.get('/maps'),
};

export const alertService = {
  getAlerts: () => axiosClient.get('/alerts'),
};
