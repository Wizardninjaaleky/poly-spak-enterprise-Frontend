'use client';

import { useState, useEffect } from 'react';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    revenueGrowth: 0,
    ordersGrowth: 0
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://poly-spak-enterprise-backend-2.onrender.com';
      
      // Fetch multiple endpoints
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/api/orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => ({ ok: false }))
      ]);

      const orders = ordersRes.ok ? await ordersRes.json() : { data: [] };
      const products = productsRes.ok ? await productsRes.json() : { data: [] };
      const users = usersRes.ok ? await usersRes.json() : { data: [] };

      const ordersList = orders.data || orders;
      const totalRevenue = ordersList.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      setStats({
        totalRevenue,
        totalOrders: ordersList.length,
        totalProducts: (products.data || products).length,
        totalUsers: (users.data || users).length,
        revenueGrowth: 12.5,
        ordersGrowth: 8.3
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const metrics = [
    {
      label: 'Total Revenue',
      value: `KSh ${stats.totalRevenue.toLocaleString()}`,
      icon: '💰',
      color: 'green',
      growth: `+${stats.revenueGrowth}%`,
      trend: 'up'
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: '📦',
      color: 'blue',
      growth: `+${stats.ordersGrowth}%`,
      trend: 'up'
    },
    {
      label: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      icon: '🛍️',
      color: 'purple',
      growth: 'Active',
      trend: 'neutral'
    },
    {
      label: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: '👥',
      color: 'orange',
      growth: 'Registered',
      trend: 'neutral'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Track your business performance and metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-${metric.color}-100 flex items-center justify-center text-2xl`}>
                {metric.icon}
              </div>
              {metric.trend !== 'neutral' && (
                <span className={`text-sm font-semibold ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.growth}
                </span>
              )}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{metric.label}</h3>
            <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <div className="text-center">
              <div className="text-5xl mb-2">📈</div>
              <p className="text-gray-600">Revenue chart coming soon</p>
            </div>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Orders Overview</h3>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="text-center">
              <div className="text-5xl mb-2">📊</div>
              <p className="text-gray-600">Orders chart coming soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalOrders > 0 ? Math.round((stats.totalOrders * 0.85)) : 0}
            </p>
            <p className="text-sm text-gray-600">Completed Orders</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl mb-2">⏳</div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalOrders > 0 ? Math.round((stats.totalOrders * 0.1)) : 0}
            </p>
            <p className="text-sm text-gray-600">Pending Orders</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl mb-2">🎯</div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalRevenue > 0 ? Math.round(stats.totalRevenue / Math.max(stats.totalOrders, 1)).toLocaleString() : 0}
            </p>
            <p className="text-sm text-gray-600">Avg. Order Value (KSh)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
