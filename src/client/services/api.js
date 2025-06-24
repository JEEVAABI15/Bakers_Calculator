// API service for frontend (JavaScript version)
let API_BASE_URL = 'http://localhost:3001/api';
if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
  API_BASE_URL = import.meta.env.VITE_API_URL;
}

// Auth token management
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Base API request function
const apiRequest = async (
  endpoint,
  options = {}
) => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        removeAuthToken();
        window.location.href = '/login';
        throw new Error('Authentication required');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await apiRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(response.token);
    return response;
  },

  register: async (name, email, password) => {
    const response = await apiRequest('/users/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    return response;
  },

  logout: () => {
    removeAuthToken();
  },

  isAuthenticated: () => {
    return !!getAuthToken();
  },
};

// Bills API
export const billsAPI = {
  getAll: () => apiRequest('/bills'),
  
  getById: (id) => apiRequest(`/bills/${id}`),
  
  create: (billData) => apiRequest('/bills', {
    method: 'POST',
    body: JSON.stringify(billData),
  }),
  
  update: (id, billData) => apiRequest(`/bills/${id}`, {
    method: 'PUT',
    body: JSON.stringify(billData),
  }),
  
  delete: (id) => apiRequest(`/bills/${id}`, {
    method: 'DELETE',
  }),
};

// Products API
export const productsAPI = {
  getAll: () => apiRequest('/products'),
  
  getById: (id) => apiRequest(`/products/${id}`),
  
  search: (query, category, minPrice, maxPrice) => {
    const params = new URLSearchParams({ q: query });
    if (category) params.append('category', category);
    if (minPrice) params.append('minPrice', String(minPrice));
    if (maxPrice) params.append('maxPrice', String(maxPrice));
    return apiRequest(`/products/search?${params}`);
  },
  
  create: (productData) => apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),
  
  update: (id, productData) => apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  }),
  
  delete: (id) => apiRequest(`/products/${id}`, {
    method: 'DELETE',
  }),
};

// Inventory API
export const inventoryAPI = {
  getAll: () => apiRequest('/inventory'),
  
  getById: (id) => apiRequest(`/inventory/${id}`),
  
  getLowStock: (threshold) => {
    const params = threshold ? `?threshold=${threshold}` : '';
    return apiRequest(`/inventory/low-stock${params}`);
  },
  
  search: (query) => apiRequest(`/inventory/search?q=${encodeURIComponent(query)}`),
  
  getTotalValue: () => apiRequest('/inventory/total-value'),
  
  create: (itemData) => apiRequest('/inventory', {
    method: 'POST',
    body: JSON.stringify(itemData),
  }),
  
  update: (id, itemData) => apiRequest(`/inventory/${id}`, {
    method: 'PUT',
    body: JSON.stringify(itemData),
  }),
  
  delete: (id) => apiRequest(`/inventory/${id}`, {
    method: 'DELETE',
  }),
};

// Profile API
export const profileAPI = {
  getProfile: () => apiRequest('/users/me'),
  updateProfile: (profileData) => apiRequest('/users/me', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),
};

export default {
  auth: authAPI,
  bills: billsAPI,
  products: productsAPI,
  inventory: inventoryAPI,
  profile: profileAPI,
}; 