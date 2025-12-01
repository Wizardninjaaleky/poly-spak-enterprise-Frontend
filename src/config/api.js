// API Configuration
// Use environment variable if available, otherwise use production backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://poly-spak-enterprise-backend-2.onrender.com';

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
