import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // According to documentation: PUT /api/v1/auth/refresh
        await axios.put(
          `${axiosClient.defaults.baseURL}/auth/refresh`,
          {},
          { 
            headers: { 'x-api-key': import.meta.env.VITE_API_KEY || '' },
            withCredentials: true 
          }
        );

        return axiosClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
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
