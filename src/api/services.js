import axiosClient from './axiosClient';

/**
 * SIPANGAN API Services
 * Strictly follows API_DOCUMENTATION.md
 */

export const authService = {
  login: (credentials) => axiosClient.post('auth/login', credentials),
  refresh: (refreshToken) => axiosClient.put('auth/refresh', { refreshToken }),
  logout: (refreshToken) => axiosClient.delete('auth/logout', { data: { refreshToken } }),
};

export const commodityService = {
  getAll: () => axiosClient.get('commodities'),
  create: (data) => axiosClient.post('commodities', data),
  update: (id, data) => axiosClient.put(`commodities/${id}`, data),
  delete: (id) => axiosClient.delete(`commodities/${id}`),
};

export const priceService = {
  getHistory: (params) => axiosClient.get('prices', { params }),
  getOverview: (params) => axiosClient.get('prices/overview', { params }),
  create: (data) => axiosClient.post('prices', data),
  update: (id, data) => axiosClient.put(`prices/${id}`, data),
  delete: (id) => axiosClient.delete(`prices/${id}`),
};

export const predictionService = {
  getPrediction: (commodity, region) =>
    axiosClient.get('predict', { params: { commodity, region } }),
};

export const mapService = {
  getMapData: () => axiosClient.get('maps'),
};

export const alertService = {
  getAlerts: () => axiosClient.get('alerts'),
};
export const userService = {
  getAll: () => axiosClient.get('users'),
  create: (data) => axiosClient.post('users', data),
  update: (id, data) => axiosClient.put(`users/${id}`, data),
  delete: (id) => axiosClient.delete(`users/${id}`),
};

export const logService = {
  getLogs: (params) => axiosClient.get('logs', { params }),
};
