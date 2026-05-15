import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1/',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.VITE_API_KEY || '',
  },
  withCredentials: true,
});

// Interceptor for responses
axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403) {
      alert('Anda tidak memiliki izin untuk melakukan aksi ini.');
      return Promise.reject(error);
    }

    // Don't attempt refresh if the request was to login itself
    const isLoginRequest = originalRequest.url.includes('/auth/login');

    if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');

        // Normalisasi URL untuk menghindari double slash
        const baseUrl = axiosClient.defaults.baseURL.endsWith('/') 
          ? axiosClient.defaults.baseURL.slice(0, -1) 
          : axiosClient.defaults.baseURL;

        const response = await axios.put(
          `${baseUrl}/auth/refresh`,
          { refreshToken },
          {
            headers: { 'x-api-key': import.meta.env.VITE_API_KEY || '' },
            withCredentials: true
          }
        );

        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);

        // Update header Authorization untuk request yang sedang diulang
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Hanya logout jika refresh token benar-benar tidak valid (400/401)
        // Jika error server (500), mungkin jangan langsung logout agar tidak mengganggu user
        if (refreshError.response?.status === 400 || refreshError.response?.status === 401 || !localStorage.getItem('refreshToken')) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userFullname');
          
          if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
            window.location.href = '/admin/login?expired=true';
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Interceptor for requests
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
