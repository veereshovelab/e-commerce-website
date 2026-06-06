import axios from 'axios';
import {
  getMockProducts,
  getMockCategories,
  getMockBrands,
  getMockFeatured,
  getMockTrending,
  getMockProductById
} from './mockProducts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses with fallback mock data
apiClient.interceptors.response.use(
  (response) => {
    const url = response.config?.url || '';
    if (response.config?.method === 'get') {
      if (url.endsWith('/products') && (!response.data?.products || response.data.products.length === 0)) {
        response.data = getMockProducts(response.config.params);
      } else if (url.endsWith('/products/featured') && (!response.data?.products || response.data.products.length === 0)) {
        response.data = getMockFeatured();
      } else if (url.endsWith('/products/trending') && (!response.data?.products || response.data.products.length === 0)) {
        response.data = getMockTrending();
      } else if (url.endsWith('/products/categories') && (!response.data?.categories || response.data.categories.length === 0)) {
        response.data = { categories: getMockCategories() };
      } else if (url.endsWith('/products/brands') && (!response.data?.brands || response.data.brands.length === 0)) {
        response.data = { brands: getMockBrands() };
      }
    }
    return response;
  },
  (error) => {
    const { config } = error;
    if (config && config.method === 'get') {
      const url = config.url || '';
      
      let mockData = null;
      if (url.endsWith('/products')) {
        mockData = getMockProducts(config.params);
      } else if (url.endsWith('/products/featured')) {
        mockData = getMockFeatured();
      } else if (url.endsWith('/products/trending')) {
        mockData = getMockTrending();
      } else if (url.endsWith('/products/categories')) {
        mockData = { categories: getMockCategories() };
      } else if (url.endsWith('/products/brands')) {
        mockData = { brands: getMockBrands() };
      } else if (url.includes('/products/')) {
        const parts = url.split('/');
        const id = parts[parts.length - 1];
        mockData = getMockProductById(id);
      }
      
      if (mockData) {
        console.warn(`Backend request to ${url} failed. Falling back to mock data.`, error);
        return Promise.resolve({
          data: mockData,
          status: 200,
          statusText: 'OK',
          headers: {},
          config
        });
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
