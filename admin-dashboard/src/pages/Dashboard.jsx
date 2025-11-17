import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import api from '../api/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    productsByCategory: [],
    monthlyRevenue: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load all dashboard data in parallel
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          api.get('/api/products'),
          api.get('/api/orders'),
          api.get('/api/admin/users')
        ]);

        const products = productsRes.data || [];
        const orders = ordersRes.data || [];
        const users = usersRes.data || [];

        // Calculate statistics
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

        // Products by category
        const categoryCount = {};
        products.forEach(product => {
          categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
        });
        const productsByCategory = Object.entries(categoryCount).map(([category, count]) => ({
          category,
          count
        }));

        // Monthly revenue (mock data for now - you can implement real monthly data)
        const monthlyRevenue = [
          { month: 'Jan', revenue: 1200 },
          { month: 'Feb', revenue: 1900 },
          { month: 'Mar', revenue: 800 },
          { month: 'Apr', revenue: 2400 },
          { month: 'May', revenue: 1800 },
          { month: 'Jun', revenue: totalRevenue }
        ];

        // Top products by stock (you can modify this logic)
        const topProducts = products
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5)
          .map(product => ({
            name: product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name,
            stock: product.quantity,
            price: product.price
          }));

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalUsers: users.length,
          totalRevenue,
          recentOrders: orders.slice(0, 5),
          productsByCategory,
          monthlyRevenue,
          topProducts
        });
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div>
        <NavBar />
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Manage Products
            </Link>
            <Link to="/orders" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              View Orders
            </Link>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <i className="fas fa-box text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm font-medium">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <i className="fas fa-shopping-cart text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <i className="fas fa-users text-yellow-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <i className="fas fa-dollar-sign text-purple-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={stats.monthlyRevenue}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    strokeWidth={3}
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Products by Category */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Products by Category</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={stats.productsByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {stats.productsByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {stats.recentOrders.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No orders yet. Start selling to see orders here!
                </div>
              ) : (
                stats.recentOrders.map(order => (
                  <div key={order._id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Order #{order._id.slice(-8)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.customerName || 'Customer'} • {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          ${order.total || 0}
                        </p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t">
              <Link to="/orders" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View all orders →
              </Link>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Top Products by Stock</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {stats.topProducts.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No products available.
                </div>
              ) : (
                stats.topProducts.map((product, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">${product.price}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.stock > 10 ? 'bg-green-100 text-green-800' :
                          product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.stock} in stock
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t">
              <Link to="/products" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Manage products →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
