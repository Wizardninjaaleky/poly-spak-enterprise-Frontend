// API Configuration
// Use environment variable if available, otherwise default to localhost
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/auth-v2/login`,
  REGISTER: `${API_BASE_URL}/api/auth-v2/register`,
  
  // Settings
  SETTINGS: `${API_BASE_URL}/api/settings`,
  
  // Hero Slides
  HERO_SLIDES: `${API_BASE_URL}/api/hero-slides`,
  
  // Products
  PRODUCTS: `${API_BASE_URL}/api/products`,
  FEATURED_PRODUCTS: `${API_BASE_URL}/api/products/featured`,
};
