// src/services/authService.ts
import axios from 'axios';
import Cookies from 'js-cookie';

// Set your base URL with environment variable support
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  // Register new user
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/users', { name, email, password });
    return response.data;
  },

  // Login user
  login: async (email: string, password: string) => {
    const response = await api.post('/users/login', { email, password });
    
    // Store token in cookies
    if (response.data.token) {
      Cookies.set('token', response.data.token, { expires: 7 }); // Token expires in 7 days
      
      const userData = {
        id: response.data._id || '123',
        name: response.data.name || email.split('@')[0],
        email: email
      };
      
      Cookies.set('user', JSON.stringify(userData), { expires: 7 });
    }
    
    return response.data;
  },

  // Logout user
  logout: () => {
    Cookies.remove('token');
    Cookies.remove('user');
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!Cookies.get('token');
  },
  
  // Get stored user data
  getUser: () => {
    const userData = Cookies.get('user');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }
};