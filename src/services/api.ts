import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://poly-spak-ecommerce.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),

  register: (userData: { name: string; email: string; password: string; phone: string }) =>
    api.post('/auth/register', userData),

  logout: () => api.post('/auth/logout'),

  getProfile: () => api.get('/auth/profile'),

  updateProfile: (userData: any) => api.put('/auth/profile', userData),

  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
};

// Products API
export const productsAPI = {
  getProducts: (params?: any) => api.get('/products', { params }),

  getProduct: (id: string) => api.get(`/products/${id}`),

  createProduct: (productData: FormData) => api.post('/products', productData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  updateProduct: (id: string, productData: FormData) => api.put(`/products/${id}`, productData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  deleteProduct: (id: string) => api.delete(`/products/${id}`),

  getCategories: () => api.get('/categories'),

  createCategory: (categoryData: any) => api.post('/categories', categoryData),

  updateCategory: (id: string, categoryData: any) => api.put(`/categories/${id}`, categoryData),

  deleteCategory: (id: string) => api.delete(`/categories/${id}`),
};

// Orders API
export const ordersAPI = {
  getOrders: (params?: any) => api.get('/orders', { params }),

  getOrder: (id: string) => api.get(`/orders/${id}`),

  createOrder: (orderData: any) => api.post('/orders', orderData),

  updateOrder: (id: string, orderData: any) => api.put(`/orders/${id}`, orderData),

  cancelOrder: (id: string) => api.put(`/orders/${id}/cancel`),

  getOrderStatus: (id: string) => api.get(`/orders/${id}/status`),
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),

  getUsers: (params?: any) => api.get('/admin/users', { params }),

  updateUser: (id: string, userData: any) => api.put(`/admin/users/${id}`, userData),

  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),

  getAllOrders: (params?: any) => api.get('/admin/orders', { params }),

  updateOrderStatus: (id: string, status: string) => api.put(`/admin/orders/${id}/status`, { status }),

  getFlashSales: () => api.get('/admin/flash-sales'),

  createFlashSale: (flashSaleData: any) => api.post('/admin/flash-sales', flashSaleData),

  updateFlashSale: (id: string, flashSaleData: any) => api.put(`/admin/flash-sales/${id}`, flashSaleData),

  deleteFlashSale: (id: string) => api.delete(`/admin/flash-sales/${id}`),

  getCoupons: () => api.get('/admin/coupons'),

  createCoupon: (couponData: any) => api.post('/admin/coupons', couponData),

  updateCoupon: (id: string, couponData: any) => api.put(`/admin/coupons/${id}`, couponData),

  deleteCoupon: (id: string) => api.delete(`/admin/coupons/${id}`),
};

// Payment API
export const paymentAPI = {
  submitPayment: (paymentData: { orderId: string | null; amount: number; phoneNumber: string; mpesaCode: string; recaptchaToken: string }) =>
    api.post('/payments/submit', paymentData),

  getOrderPayment: (orderId: string) => api.get(`/payments/order/${orderId}`),

  getPaymentHistory: () => api.get('/payments/history'),

  verifyPayment: (orderId: string, transactionCode: string) =>
    api.post(`/payments/verify/${orderId}`, { transactionCode }),

  getPayments: (params?: any) => api.get('/payments', { params }),

  getPaymentStats: () => api.get('/payments/stats'),
};

// Services API
export const servicesAPI = {
  requestService: (serviceData: any) => api.post('/services/request', serviceData),

  getServiceRequests: () => api.get('/services/requests'),

  getServiceRequest: (id: string) => api.get(`/services/requests/${id}`),

  updateServiceRequest: (id: string, updateData: any) => api.put(`/services/requests/${id}`, updateData),
};

// Email API
export const emailAPI = {
  sendContactMessage: (messageData: any) => api.post('/contact', messageData),

  subscribeNewsletter: (email: string) => api.post('/newsletter/subscribe', { email }),
};

export default api;
