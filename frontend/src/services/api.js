import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Send and receive HTTP-only session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if present as supplementary authorization
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auracv_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  demoLogin: () => api.post('/auth/demo'),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const analysisAPI = {
  analyze: (formData) =>
    api.post('/analysis/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  analyzeText: (data) => api.post('/analysis/analyze', data),
  getHistory: () => api.get('/analysis/history'),
  getStats: () => api.get('/analysis/stats'),
  getById: (id) => api.get(`/analysis/${id}`),
  delete: (id) => api.delete(`/analysis/${id}`),
  getSample: () => api.get('/analysis/sample'),
};

export default api;
