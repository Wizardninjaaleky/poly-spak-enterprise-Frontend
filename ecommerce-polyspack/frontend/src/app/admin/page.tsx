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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    { id: 'orders', label: 'Orders', icon: '📋' },
    { id: 'payments', label: 'Payments', icon: '💰' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'coupons', label: 'Coupons', icon: '🎫' },
    { id: 'promotions', label: 'Promotions', icon: '⚡' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
  ];

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
                    <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                      + Add Product
                    </button>
                  </div>

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
                        <tr className="border-t">
                          <td className="px-4 py-2">Premium Seedling Bags</td>
                          <td className="px-4 py-2">Seedlings</td>
                          <td className="px-4 py-2">KSh 220</td>
                          <td className="px-4 py-2">45</td>
                          <td className="px-4 py-2"><span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Active</span></td>
                          <td className="px-4 py-2">
                            <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                            <button className="text-red-600 hover:text-red-800">Delete</button>
                          </td>
                        </tr>
                        <tr className="border-t">
                          <td className="px-4 py-2">NPK Fertilizer 50kg</td>
                          <td className="px-4 py-2">Fertilizers</td>
                          <td className="px-4 py-2">KSh 3,500</td>
                          <td className="px-4 py-2">12</td>
                          <td className="px-4 py-2"><span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Low Stock</span></td>
                          <td className="px-4 py-2">
                            <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                            <button className="text-red-600 hover:text-red-800">Delete</button>
                          </td>
                        </tr>
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
                        <tr className="border-t">
                          <td className="px-4 py-2">John Doe</td>
                          <td className="px-4 py-2">john@example.com</td>
                          <td className="px-4 py-2">Customer</td>
                          <td className="px-4 py-2"><span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Active</span></td>
                          <td className="px-4 py-2">
                            <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                            <button className="text-red-600 hover:text-red-800">Deactivate</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
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

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-medium text-gray-900">Order #12350</p>
                          <p className="text-sm text-gray-600">Customer: John Doe</p>
                          <p className="text-sm text-gray-600">Phone: +254712345678</p>
                          <p className="text-sm text-gray-600">M-Pesa Code: QWE1X2Y3Z4</p>
                          <p className="text-sm text-gray-600">Amount: KSh 3,200</p>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded mb-2 block">Pending</span>
                          <div className="space-x-2">
                            <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                              Verify
                            </button>
                            <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-medium text-gray-900">Order #12349</p>
                          <p className="text-sm text-gray-600">Customer: Jane Smith</p>
                          <p className="text-sm text-gray-600">Phone: +254798765432</p>
                          <p className="text-sm text-gray-600">M-Pesa Code: ABC5D6E7F8</p>
                          <p className="text-sm text-gray-600">Amount: KSh 1,800</p>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded mb-2 block">Pending</span>
                          <div className="space-x-2">
                            <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                              Verify
                            </button>
                            <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
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
