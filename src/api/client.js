const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

/**
 * Fetch wrapper for API calls
 * @param {string} endpoint - API endpoint relative to base path
 * @param {object} options - Request options (method, body, headers, etc.)
 */
const client = async (endpoint, { body, ...customConfig } = {}) => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // Parse response
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    if (response.ok) {
      return data;
    } else {
      return Promise.reject(data.message || 'Telah terjadi kesalahan pada server.');
    }
  } catch (error) {
    console.error('API client request failure:', error);
    return Promise.reject(error.message || 'Koneksi ke server terputus.');
  }
};

// Helper methods
export const api = {
  get: (endpoint, config = {}) => client(endpoint, { ...config, method: 'GET' }),
  post: (endpoint, body, config = {}) => client(endpoint, { ...config, method: 'POST', body }),
  put: (endpoint, body, config = {}) => client(endpoint, { ...config, method: 'PUT', body }),
  delete: (endpoint, config = {}) => client(endpoint, { ...config, method: 'DELETE' }),
};

export default api;
