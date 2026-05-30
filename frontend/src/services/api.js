import axios from 'axios';
import { getAuthToken, clearAuthTokens } from '../utils/authToken';

const API_BASE = process.env.REACT_APP_API_URL || '';
const baseURL = `${API_BASE.replace(/\/$/, '')}/api`;

const API = axios.create({ baseURL });

API.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const isPublicInquiry = err.config?.url?.includes('/inquiries');
      clearAuthTokens();
      if (!isPublicInquiry && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
};

export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getOne: (id) => API.get(`/products/${id}`),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  delete: (id) => API.delete(`/products/${id}`),
};

export const categoryAPI = {
  getAll: (params) => API.get('/categories', { params }),
  create: (data) => API.post('/categories', data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  delete: (id) => API.delete(`/categories/${id}`),
};

export const orderAPI = {
  create: (data) => API.post('/orders', data),
  getMyOrders: () => API.get('/orders/my'),
  getAll: (params) => API.get('/orders', { params }),
  updateStatus: (id, status) => API.patch(`/orders/${id}/status`, { status }),
};

export const inquiryAPI = {
  submit: (data) => API.post('/inquiries', data, { timeout: 15000 }),
};

export const userAPI = {
  getMe: () => API.get('/users/me'),
  updateMe: (data) => API.put('/users/me', data),
};

export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: (params) => API.get('/admin/users', { params }),
  updateUserRole: (id, role) => API.patch(`/admin/users/${id}/role`, { role }),
};

export const pricingAPI = {
  list: () => API.get('/admin/pricing'),
  setGlobal: (data) => API.post('/admin/pricing/global', data),
  setCategory: (data) => API.post('/admin/pricing/category', data),
  update: (id, data) => API.patch(`/admin/pricing/${id}`, data),
  deactivate: (id) => API.delete(`/admin/pricing/${id}`),
};

export const uploadAPI = {
  uploadImages: (productId, files) => {
    const form = new FormData();
    files.forEach(f => form.append('images', f));
    return API.post(`/uploads/products/${productId}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  removeImage: (productId, imagePath) =>
    API.delete(`/uploads/products/${productId}/image`, { data: { imagePath } }),
};

export default API;
