/**
 * Centralized API helper for Admin Portal
 * Ensures proper URL resolution, HttpOnly cookie credentials, and Authorization headers across environments.
 */

export const getBackendUrl = () => {
  if (typeof window === 'undefined') return '';
  const hostname = window.location.hostname;
  // Local development fallback
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    if (window.location.port !== '5000') {
      return `http://${hostname}:5000`;
    }
  }
  // Production environment (uses relative path /api with Nginx reverse proxy)
  return '';
};

export const adminFetch = async (endpoint, options = {}) => {
  const backendUrl = getBackendUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith('http') ? endpoint : `${backendUrl}${cleanEndpoint}`;

  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('msit_token') : null;
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    'Accept': 'application/json',
    ...(options.headers || {})
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include'
  });
};
