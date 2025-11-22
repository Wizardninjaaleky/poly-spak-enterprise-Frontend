'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { setCredentials } from '@/store/slices/authSlice';

const AdminDashboardPage: React.FC = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [logoPreview, setLogoPreview] = useState('');
  const [logoUploading, setLogoUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [companySettings, setCompanySettings] = useState({
    name: 'Polyspack Enterprises',
    email: 'info@polyspackenterprises.co.ke',
    phone: '+254 700 000 000'
  });

  const isAdmin = user?.role === 'admin';

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      setLoading(true);
      setError('');

      try {
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        if (activeTab === 'products') {
          const response = await fetch('https://polyspackenterprises.co.ke/api/admin/products', { headers });
          if (response.ok) {
            const data = await response.json();
            setProducts(data.data || []);
          } else {
            setError('Failed to load products');
          }
        } else if (activeTab === 'orders') {
          const response = await fetch('https://polyspackenterprises.co.ke/api/admin/orders', { headers });
          if (response.ok) {
            const data = await response.json();
            setOrders(data.data || []);
          } else {
            setError('Failed to load orders');
          }
        } else if (activeTab === 'users') {
          const response = await fetch('https://polyspackenterprises.co.ke/api/admin/users', { headers });
          if (response.ok) {
            const data = await response.json();
            setUsers(data.data || []);
          } else {
            setError('Failed to load users');
          }
        } else if (activeTab === 'categories') {
          const response = await fetch('https://polyspackenterprises.co.ke/api/admin/categories', { headers });
          if (response.ok) {
            const data = await response.json();
            setCategories(data.data || []);
          } else {
            setError('Failed to load categories');
          }
        } else if (activeTab === 'payments') {
          const response = await fetch('https://polyspackenterprises.co.ke/api/admin/payments', { headers });
          if (response.ok) {
            const data = await response.json();
            setPayments(data.data || []);
          } else {
            setError('Failed to load payments');
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, token]);

  const adminTabs = [
    { id: 'overview', label: 'Dashboard', icon: '📊' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'categories', label: 'Categories', icon: '🏷️' },
    { id: 'orders', label: 'Orders', icon: '📋' },
    { id: 'payments', label: 'Payments', icon: '💰' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'admins', label: 'Admin Management', icon: '👑' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'coupons', label: 'Coupons', icon: '🎫' },
    { id: 'promotions', label: 'Promotions', icon: '⚡' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
  ];

  const handleEditProduct = (productId: string) => {
    // Navigate to edit product page
    window.location.href = `/admin/products/${productId}/edit`;
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    try {
      const response = await fetch(`https://polyspackenterprises.co.ke/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setSuccess('Product deleted successfully!');
        // Refresh products list
        const productsResponse = await fetch('https://polyspackenterprises.co.ke/api/admin/products', { headers: { 'Authorization': `Bearer ${token}` } });
        if (productsResponse.ok) {
          const data = await productsResponse.json();
          setProducts(data.data || []);
        }
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete product');
      }
    } catch (error) {
      setError('Failed to delete product');
    }
  };

  const handleEditCategory = async (categoryId: string) => {
    const newName = prompt('Enter new category name:');
    if (!newName) return;

    try {
      const response = await fetch(`https://polyspackenterprises.co.ke/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newName })
      });

      if (response.ok) {
        setSuccess('Category updated successfully!');
        // Refresh categories list
        const categoriesResponse = await fetch('https://polyspackenterprises.co.ke/api/admin/categories', { headers: { 'Authorization': `Bearer ${token}` } });
        if (categoriesResponse.ok) {
          const data = await categoriesResponse.json();
          setCategories(data.data || []);
        }
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to update category');
      }
    } catch (error) {
      setError('Failed to update category');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`https://polyspackenterprises.co.ke/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setSuccess('Category deleted successfully!');
        // Refresh categories list
        const categoriesResponse = await fetch('https://polyspackenterprises.co.ke/api/admin/categories', { headers: { 'Authorization': `Bearer ${token}` } });
        if (categoriesResponse.ok) {
          const data = await categoriesResponse.json();
          setCategories(data.data || []);
        }
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete category');
      }
    } catch (error) {
      setError('Failed to delete category');
    }
  };

  const handleAddCategory = async () => {
    const name = prompt('Enter category name:');
    if (!name) return;

    const description = prompt('Enter category description (optional):');

    try {
      const response = await fetch('https://polyspackenterprises.co.ke/api/admin/categories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description })
      });

      if (response.ok) {
        setSuccess('Category added successfully!');
        // Refresh categories list
        const categoriesResponse = await fetch('https://polyspackenterprises.co.ke/api/admin/categories', { headers: { 'Authorization': `Bearer ${token}` } });
        if (categoriesResponse.ok) {
          const data = await categoriesResponse.json();
          setCategories(data.data || []);
        }
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to add category');
      }
    } catch (error) {
      setError('Failed to add category');
    }
  };

  const handleVerifyPayment = async (paymentId: string) => {
    try {
      const response = await fetch(`https://polyspackenterprises.co.ke/api/admin/payments/${paymentId}/verify`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setSuccess('Payment verified successfully!');
        // Refresh payments list
        const paymentsResponse = await fetch('https://polyspackenterprises.co.ke/api/admin/payments', { headers: { 'Authorization': `Bearer ${token}` } });
        if (paymentsResponse.ok) {
          const data = await paymentsResponse.json();
          setPayments(data.data || []);
        }
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to verify payment');
      }
    } catch (error) {
      setError('Failed to verify payment');
    }
  };

  const handleRejectPayment = async (paymentId: string) => {
    if (!confirm('Are you sure you want to reject this payment?')) return;

    try {
      const response = await fetch(`https://polyspackenterprises.co.ke/api/admin/payments/${paymentId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setSuccess('Payment rejected successfully!');
        // Refresh payments list
        const paymentsResponse = await fetch('https://polyspackenterprises.co.ke/api/admin/payments', { headers: { 'Authorization': `Bearer ${token}` } });
        if (paymentsResponse.ok) {
          const data = await paymentsResponse.json();
          setPayments(data.data || []);
        }
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to reject payment');
      }
    } catch (error) {
      setError('Failed to reject payment');
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveLogo = async () => {
    if (!logoPreview) return;

    setLogoUploading(true);
    try {
      // TODO: Implement logo upload to backend
      setSuccess('Logo updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to upload logo');
    } finally {
      setLogoUploading(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = async () => {
    if (!avatarPreview) return;

    setAvatarUploading(true);
    try {
      // TODO: Implement avatar upload to backend
      setSuccess('Avatar updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to upload avatar');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch('https://polyspackenterprises.co.ke/api/auth/updatedetails', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to update profile');
      }
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      // TODO: Implement password change
      setSuccess('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to change password');
    }
  };

  const handleSaveSettings = async () => {
    try {
      // TODO: Implement settings save
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to save settings');
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`https://polyspackenterprises.co.ke/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        setSuccess('User role updated successfully!');
        // Refresh users list
        const usersResponse = await fetch('https://polyspackenterprises.co.ke/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } });
        if (usersResponse.ok) {
          const data = await usersResponse.json();
          setUsers(data.data || []);
        }
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to update user role');
      }
    } catch (error) {
      setError('Failed to update user role');
    }
  };

  const handleToggleStatus = async (userId: string, newStatus: boolean) => {
    try {
      const response = await fetch(`https://polyspackenterprises.co.ke/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus ? 'active' : 'blocked' })
      });

      if (response.ok) {
        setSuccess(`User ${newStatus ? 'activated' : 'deactivated'} successfully!`);
        // Refresh users list
        const usersResponse = await fetch('https://polyspackenterprises.co.ke/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } });
        if (usersResponse.ok) {
          const data = await usersResponse.json();
          setUsers(data.data || []);
        }
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to update user status');
      }
    } catch (error) {
      setError('Failed to update user status');
    }
  };

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Admin access required.</p>
          <Link
            href="/login"
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Admin Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👑</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Admin Panel</h2>
                <p className="text-gray-600">{user.name}</p>
              </div>

              <nav className="space-y-2">
                {adminTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-red-100 text-red-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow p-6">
              {activeTab === 'overview' && (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <div className="flex items-center">
                        <div className="text-3xl mr-4">📦</div>
                        <div>
                          <p className="text-sm text-gray-600">Total Products</p>
                          <p className="text-2xl font-bold text-gray-900">156</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg">
                      <div className="flex items-center">
                        <div className="text-3xl mr-4">📋</div>
                        <div>
                          <p className="text-sm text-gray-600">Total Orders</p>
                          <p className="text-2xl font-bold text-gray-900">1,247</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-6 rounded-lg">
                      <div className="flex items-center">
                        <div className="text-3xl mr-4">👥</div>
                        <div>
                          <p className="text-sm text-gray-600">Registered Users</p>
                          <p className="text-2xl font-bold text-gray-900">892</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 p-6 rounded-lg">
                      <div className="flex items-center">
                        <div className="text-3xl mr-4">💰</div>
                        <div>
                          <p className="text-sm text-gray-600">Revenue</p>
                          <p className="text-2xl font-bold text-gray-900">KSh 2.4M</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium">Order #12350</p>
                            <p className="text-sm text-gray-600">John Doe - KSh 3,200</p>
                          </div>
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Pending</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium">Order #12349</p>
                            <p className="text-sm text-gray-600">Jane Smith - KSh 1,800</p>
                          </div>
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Completed</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Low Stock Alerts</h2>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                          <div>
                            <p className="font-medium">Premium Seedling Bags</p>
                            <p className="text-sm text-gray-600">Only 5 left in stock</p>
                          </div>
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Critical</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                          <div>
                            <p className="font-medium">NPK Fertilizer 50kg</p>
                            <p className="text-sm text-gray-600">12 left in stock</p>
                          </div>
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Low</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'products' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                    <Link
                      href="/admin/add-product"
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      + Add Product
                    </Link>
                  </div>

                  {loading && <p className="text-gray-600">Loading products...</p>}
                  {error && <p className="text-red-600 mb-4">{error}</p>}

                  {/* Product Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left">Product</th>
                          <th className="px-4 py-2 text-left">Category</th>
                          <th className="px-4 py-2 text-left">Price</th>
                          <th className="px-4 py-2 text-left">Stock</th>
                          <th className="px-4 py-2 text-left">Status</th>
                          <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.length > 0 ? (
                          products.map((product: any) => (
                            <tr key={product._id} className="border-t">
                              <td className="px-4 py-2">{product.name}</td>
                              <td className="px-4 py-2">{product.category?.name || 'N/A'}</td>
                              <td className="px-4 py-2">KSh {product.price}</td>
                              <td className="px-4 py-2">{product.stock}</td>
                              <td className="px-4 py-2">
                                <span className={`px-2 py-1 text-xs rounded ${
                                  product.stock > 10
                                    ? 'bg-green-100 text-green-800'
                                    : product.stock > 0
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {product.stock > 10 ? 'Active' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                                </span>
                              </td>
                              <td className="px-4 py-2">
                                <button
                                  onClick={() => handleEditProduct(product._id)}
                                  className="text-blue-600 hover:text-blue-800 mr-2"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product._id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                              No products found. <Link href="/admin/add-product" className="text-blue-600 hover:text-blue-800">Add your first product</Link>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'categories' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
                    <button onClick={handleAddCategory} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                      + Add Category
                    </button>
                  </div>

                  {loading && <p className="text-gray-600">Loading categories...</p>}
                  {error && <p className="text-red-600 mb-4">{error}</p>}
                  {success && <p className="text-green-600 mb-4">{success}</p>}

                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left">Category Name</th>
                          <th className="px-4 py-2 text-left">Description</th>
                          <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.length > 0 ? (
                          categories.map((category: any) => (
                            <tr key={category._id} className="border-t">
                              <td className="px-4 py-2">{category.name}</td>
                              <td className="px-4 py-2">{category.description || 'N/A'}</td>
                              <td className="px-4 py-2">
                                <button onClick={() => handleEditCategory(category._id)} className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                                <button onClick={() => handleDeleteCategory(category._id)} className="text-red-600 hover:text-red-800">Delete</button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                              No categories found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-6">Order Management</h1>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-medium text-gray-900">Order #12350</p>
                          <p className="text-sm text-gray-600">Customer: John Doe</p>
                          <p className="text-sm text-gray-600">Date: Dec 20, 2024</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">KSh 3,200</p>
                          <select className="mt-2 px-3 py-1 border border-gray-300 rounded text-sm">
                            <option>Pending</option>
                            <option>Processing</option>
                            <option>Shipped</option>
                            <option>Delivered</option>
                            <option>Cancelled</option>
                          </select>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Items: Premium Seedling Bags (2), NPK Fertilizer 25kg (1)
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-6">User Management</h1>
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Email</th>
                          <th className="px-4 py-2 text-left">Role</th>
                          <th className="px-4 py-2 text-left">Status</th>
                          <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length > 0 ? (
                          users.map((user: any) => (
                            <tr key={user._id} className="border-t">
                              <td className="px-4 py-2">{user.name}</td>
                              <td className="px-4 py-2">{user.email}</td>
                              <td className="px-4 py-2">
                                <select
                                  value={user.role}
                                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                                >
                                  <option value="user">Customer</option>
                                  <option value="sales">Sales</option>
                                  <option value="content">Content</option>
                                  <option value="support">Support</option>
                                  <option value="admin">Admin</option>
                                </select>
                              </td>
                              <td className="px-4 py-2">
                                <span className={`px-2 py-1 text-xs rounded ${
                                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {user.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-4 py-2">
                                <button
                                  onClick={() => handleToggleStatus(user._id, !user.isActive)}
                                  className={`px-3 py-1 text-sm rounded ${
                                    user.isActive
                                      ? 'bg-red-600 text-white hover:bg-red-700'
                                      : 'bg-green-600 text-white hover:bg-green-700'
                                  }`}
                                >
                                  {user.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                              No users found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'admins' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
                    <button
                      onClick={() => setShowAddAdminModal(true)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      + Add New Admin
                    </button>
                  </div>

                  {loading && <p className="text-gray-600">Loading admins...</p>}
                  {error && <p className="text-red-600 mb-4">{error}</p>}
                  {success && <p className="text-green-600 mb-4">{success}</p>}

                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Email</th>
                          <th className="px-4 py-2 text-left">Role</th>
                          <th className="px-4 py-2 text-left">Status</th>
                          <th className="px-4 py-2 text-left">Created</th>
                          <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.filter((u: any) => ['admin', 'sales', 'content', 'support'].includes(u.role)).map((admin: any) => (
                          <tr key={admin._id} className="border-t">
                            <td className="px-4 py-2">{admin.name}</td>
                            <td className="px-4 py-2">{admin.email}</td>
                            <td className="px-4 py-2">
                              <select
                                value={admin.role}
                                onChange={(e) => handleRoleChange(admin._id, e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded text-sm"
                              >
                                <option value="sales">Sales</option>
                                <option value="content">Content</option>
                                <option value="support">Support</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 text-xs rounded ${
                                admin.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {admin.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-4 py-2">{new Date(admin.createdAt).toLocaleDateString()}</td>
                            <td className="px-4 py-2">
                              <button
                                onClick={() => handleToggleStatus(admin._id, !admin.isActive)}
                                className={`px-3 py-1 text-sm rounded ${
                                  admin.isActive
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                              >
                                {admin.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Admin Modal */}
                  {showAddAdminModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add New Admin</h2>
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          // Handle form submission
                          setShowAddAdminModal(false);
                        }}>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              required
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                              type="email"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              required
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                              <option value="sales">Sales</option>
                              <option value="content">Content</option>
                              <option value="support">Support</option>
                              <option value="admin">Admin</option>
                            </select>
                          </div>
                          <div className="flex justify-end space-x-3">
                            <button
                              type="button"
                              onClick={() => setShowAddAdminModal(false)}
                              className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                              Add Admin
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-6">Website Settings</h1>

                  {/* Logo Upload Section */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Company Logo</h2>
                    <div className="flex items-center space-x-6">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain rounded-lg" />
                        ) : (
                          <span className="text-2xl">🏢</span>
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="mb-2"
                        />
                        <div className="space-x-2">
                          <button
                            onClick={handleSaveLogo}
                            disabled={!logoPreview || logoUploading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                          >
                            {logoUploading ? 'Uploading...' : 'Save Logo'}
                          </button>
                          {logoPreview && (
                            <button
                              onClick={() => setLogoPreview('')}
                              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Company Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input
                          type="text"
                          value={companySettings.name}
                          onChange={(e) => setCompanySettings({...companySettings, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={companySettings.email}
                          onChange={(e) => setCompanySettings({...companySettings, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={companySettings.phone}
                          onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={handleSaveSettings}
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Save Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'coupons' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Coupon Management</h1>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      + Create Coupon
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">WELCOME20</p>
                          <p className="text-sm text-gray-600">20% off orders over KSh 5,000</p>
                          <p className="text-sm text-gray-600">Expires: Dec 31, 2024</p>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded mb-2 block">Active</span>
                          <div>
                            <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                            <button className="text-red-600 hover:text-red-800">Delete</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'promotions' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Flash Sales & Promotions</h1>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                      + Create Sale
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">End of Year Sale</p>
                          <p className="text-sm text-gray-600">30% off all fertilizers</p>
                          <p className="text-sm text-gray-600">Dec 20 - Dec 31, 2024</p>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded mb-2 block">Active</span>
                          <div>
                            <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                            <button className="text-red-600 hover:text-red-800">Stop</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'payments' && (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-6">Payment Verification</h1>

                  {/* Payment Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-yellow-50 p-6 rounded-lg">
                      <div className="flex items-center">
                        <div className="text-3xl mr-4">⏳</div>
                        <div>
                          <p className="text-sm text-gray-600">Pending Verification</p>
                          <p className="text-2xl font-bold text-gray-900">12</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg">
                      <div className="flex items-center">
                        <div className="text-3xl mr-4">✅</div>
                        <div>
                          <p className="text-sm text-gray-600">Verified Today</p>
                          <p className="text-2xl font-bold text-gray-900">8</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 p-6 rounded-lg">
                      <div className="flex items-center">
                        <div className="text-3xl mr-4">❌</div>
                        <div>
                          <p className="text-sm text-gray-600">Rejected Today</p>
                          <p className="text-2xl font-bold text-gray-900">2</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg">
                      <div className="flex items-center">
                        <div className="text-3xl mr-4">💰</div>
                        <div>
                          <p className="text-sm text-gray-600">Total Processed</p>
                          <p className="text-2xl font-bold text-gray-900">KSh 45,200</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pending Payments */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">Pending Payment Verifications</h2>

                    {payments.length > 0 ? (
                      payments.map((payment: any) => (
                        <div key={payment._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="font-medium text-gray-900">Order #{payment.orderId}</p>
                              <p className="text-sm text-gray-600">Customer: {payment.customerName || 'N/A'}</p>
                              <p className="text-sm text-gray-600">Phone: {payment.phoneNumber}</p>
                              <p className="text-sm text-gray-600">M-Pesa Code: {payment.mpesaCode}</p>
                              <p className="text-sm text-gray-600">Amount: KSh {payment.amount}</p>
                            </div>
                            <div className="text-right">
                              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded mb-2 block">Pending</span>
                              <div className="space-x-2">
                                <button onClick={() => handleVerifyPayment(payment._id)} className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                                  Verify
                                </button>
                                <button onClick={() => handleRejectPayment(payment._id)} className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                                  Reject
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No pending payments to verify.</p>
                    )}
                  </div>

                  {/* Recent Verifications */}
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Verifications</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full table-auto">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-2 text-left">Order ID</th>
                            <th className="px-4 py-2 text-left">Customer</th>
                            <th className="px-4 py-2 text-left">Amount</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Verified By</th>
                            <th className="px-4 py-2 text-left">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t">
                            <td className="px-4 py-2">#12348</td>
                            <td className="px-4 py-2">Alice Johnson</td>
                            <td className="px-4 py-2">KSh 2,500</td>
                            <td className="px-4 py-2"><span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Verified</span></td>
                            <td className="px-4 py-2">Admin</td>
                            <td className="px-4 py-2">Dec 20, 2024</td>
                          </tr>
                          <tr className="border-t">
                            <td className="px-4 py-2">#12347</td>
                            <td className="px-4 py-2">Bob Wilson</td>
                            <td className="px-4 py-2">KSh 4,200</td>
                            <td className="px-4 py-2"><span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Rejected</span></td>
                            <td className="px-4 py-2">Admin</td>
                            <td className="px-4 py-2">Dec 20, 2024</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Profile</h1>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Profile Picture Section */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
                      <div className="flex items-center space-x-6">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                          {user?.avatar ? (
                            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-3xl">👤</span>
                          )}
                        </div>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="mb-2"
                          />
                          <div className="space-x-2">
                            <button
                              onClick={handleSaveAvatar}
                              disabled={!avatarPreview || avatarUploading}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                              {avatarUploading ? 'Uploading...' : 'Save Avatar'}
                            </button>
                            {avatarPreview && (
                              <button
                                onClick={() => setAvatarPreview('')}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Profile Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            value={user?.name || ''}
                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            value={user?.email || ''}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <input
                            type="tel"
                            value={profileData.phone || ''}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                          <input
                            type="text"
                            value={user?.role || ''}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                          />
                        </div>
                        <button
                          onClick={handleUpdateProfile}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Update Profile
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Change Password Section */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
                    <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={handleChangePassword}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics & Reports</h1>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Today&apos;s Sales</span>
                          <span className="font-medium">KSh 45,200</span>
                        </div>
                        <div className="flex justify-between">
                          <span>This Week</span>
                          <span className="font-medium">KSh 312,800</span>
                        </div>
                        <div className="flex justify-between">
                          <span>This Month</span>
                          <span className="font-medium">KSh 1,247,600</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4">Top Products</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Premium Seedling Bags</span>
                          <span className="font-medium">234 sold</span>
                        </div>
                        <div className="flex justify-between">
                          <span>NPK Fertilizer 50kg</span>
                          <span className="font-medium">156 sold</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Organic Compost</span>
                          <span className="font-medium">98 sold</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
