import axios from 'axios';
import { supabase } from './supabase';

const api = axios.create({
  baseURL: 'localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  // First try to get token from supabase session
  try {
    const session = await supabase.auth.getSession();
    if (session?.data?.session?.access_token) {
      config.headers.Authorization = `Bearer ${session.data.session.access_token}`;
      return config;
    }
  } catch (error) {
    console.error("Error getting Supabase session:", error);
  }
  
  // If no supabase token, check for our app token
  const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Don't set Content-Type for FormData requests
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
});

// Handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, clear storage and redirect to login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      sessionStorage.removeItem('userToken');
      sessionStorage.removeItem('userData');
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = `/login?redirectTo=${encodeURIComponent(window.location.pathname)}`;
      }
    }
    return Promise.reject(error);
  }
);

// Events API
export const eventsApi = {
  getAll: (filters = {}) => api.get('/events', { params: filters }),
  getById: (id) => api.get(`/events/${id}`),
  create: (formData) => {
    // If formData is FormData object, it contains a file
    if (formData instanceof FormData) {
      return api.post('/events', formData);
    } else {
      // Regular JSON data
      return api.post('/events', formData);
    }
  },
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  getUserEvents: () => api.get('/events/myEvents'),
};

// Registration API
export const registrationApi = {
  register: (data) => api.post('/registrations', data),
  getUserRegistrations: () => api.get('/registrations'),
};

// Auth API
export const authApi = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    getCurrentUserByMail: () => api.get('/auth/by-email'),
    updateProfile: (data) => api.put('/profile', data),  // <-- Added updateProfile route
  };
  