'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardCard from '@/components/admin/DashboardCard';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0,
    totalOrders: 0,
    todayOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalUsers: 0,
    newUsersToday: 0,
    activeUsers: 0,
    returningCustomers: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    pageViews: 0,
    productViews: 0,
    conversionRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Sample chart data
  const salesData = [
    { name: 'Jan', sales: 4000, orders: 24 },
    { name: 'Feb', sales: 3000, orders: 18 },
    { name: 'Mar', sales: 5000, orders: 32 },
    { name: 'Apr', sales: 7800, orders: 45 },
    { name: 'May', sales: 8900, orders: 52 },
    { name: 'Jun', sales: 10200, orders: 61 },
    { name: 'Jul', sales: 12000, orders: 70 },
  ];

  const categoryData = [
    { name: 'Solar Products', value: 35, color: '#10b981' },
    { name: 'Automotive', value: 25, color: '#3b82f6' },
    { name: 'Seedling Bags', value: 20, color: '#8b5cf6' },
    { name: 'Medical', value: 12, color: '#f59e0b' },
    { name: 'Others', value: 8, color: '#6b7280' },
  ];

  const topProducts = [
    { name: 'JSOT Solar Light 50W', sales: 156, revenue: 'KSh 748,800' },
    { name: 'Jump Starter Premium', sales: 89, revenue: 'KSh 845,411' },
    { name: 'Blood Pressure Monitor', sales: 67, revenue: 'KSh 194,300' },
    { name: 'Seedling Bags 8×14×14', sales: 45, revenue: 'KSh 720,000' },
    { name: 'Shade Net 90%', sales: 34, revenue: 'KSh 918,000' },
  ];

  const recentOrders = [
    { id: '#ORD-1245', customer: 'John Doe', amount: 'KSh 15,000', status: 'Pending', time: '5 min ago' },
    { id: '#ORD-1244', customer: 'Jane Smith', amount: 'KSh 8,499', status: 'Processing', time: '12 min ago' },
    { id: '#ORD-1243', customer: 'Bob Johnson', amount: 'KSh 27,000', status: 'Completed', time: '1 hour ago' },
    { id: '#ORD-1242', customer: 'Alice Brown', amount: 'KSh 4,800', status: 'Completed', time: '2 hours ago' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');

    if (!token || !userData) {
      router.push('/admin/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    
    if (parsedUser.role !== 'admin' && parsedUser.role !== 'sales') {
      router.push('/admin/login');
      return;
    }

    setUser(parsedUser);
    fetchStats(token);
  }, [router]);

  const fetchStats = async (token) => {
    try {
      // Fetch orders
      const ordersRes = await fetch('https://poly-spak-enterprise-backend-2.onrender.com/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ordersData = await ordersRes.json();
      const orders = ordersData.data || [];

      // Fetch users
      const usersRes = await fetch('https://poly-spak-enterprise-backend-2.onrender.com/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersData = await usersRes.json();
      const users = usersData.data || usersData.users || [];

      // Fetch products
      const productsRes = await fetch('https://poly-spak-enterprise-backend-2.onrender.com/api/products');
      const productsData = await productsRes.json();
      const products = productsData.data || [];

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const today = new Date().toDateString();
      const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
      const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
      const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'delivered').length;

      const lowStock = products.filter(p => (p.stockQuantity || 0) < 20).length;

      setStats({
        totalRevenue,
        todayRevenue,
        weekRevenue: totalRevenue * 0.15,
        monthRevenue: totalRevenue * 0.4,
        totalOrders: orders.length,
        todayOrders: todayOrders.length,
        pendingOrders,
        completedOrders,
        cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
        totalUsers: users.length,
        newUsersToday: users.filter(u => new Date(u.createdAt).toDateString() === today).length,
        activeUsers: users.filter(u => u.isActive !== false).length,
        returningCustomers: Math.floor(users.length * 0.35),
        totalProducts: products.length,
        lowStockProducts: lowStock,
        pageViews: 12450,
        productViews: 8920,
        conversionRate: 3.2,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <AdminLayout
      user={user}
      title="Dashboard Overview"
      breadcrumbs={[{ label: 'Home', href: '/admin/dashboard' }, { label: 'Dashboard' }]}
    >
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardCard
          icon="💰"
          title="Total Revenue"
          value={`KSh ${(stats.totalRevenue / 1000).toFixed(1)}K`}
          trend={{ direction: 'up', value: '+12.5%', label: 'vs last month' }}
          color="green"
          onClick={() => router.push('/admin/reports')}
        />
        <DashboardCard
          icon="📦"
          title="Total Orders"
          value={stats.totalOrders}
          trend={{ direction: 'up', value: `+${stats.todayOrders}`, label: 'today' }}
          color="blue"
          onClick={() => router.push('/admin/orders')}
        />
        <DashboardCard
          icon="👥"
          title="Total Users"
          value={stats.totalUsers}
          trend={{ direction: 'up', value: `+${stats.newUsersToday}`, label: 'new today' }}
          color="purple"
          onClick={() => router.push('/admin/users')}
        />
        <DashboardCard
          icon="🛍️"
          title="Products"
          value={stats.totalProducts}
          trend={{ direction: 'down', value: `${stats.lowStockProducts} low stock`, label: '' }}
          color="orange"
          onClick={() => router.push('/admin/products')}
        />
      </div>

      {/* Detailed Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-gray-600 text-sm font-medium mb-1">Today's Revenue</div>
          <div className="text-2xl font-bold text-gray-900">
            KSh {stats.todayRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-green-600 mt-2">↑ {stats.todayOrders} orders</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-gray-600 text-sm font-medium mb-1">This Week</div>
          <div className="text-2xl font-bold text-gray-900">
            KSh {stats.weekRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-blue-600 mt-2">↑ +8.2% vs last week</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-gray-600 text-sm font-medium mb-1">This Month</div>
          <div className="text-2xl font-bold text-gray-900">
            KSh {stats.monthRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-purple-600 mt-2">↑ +15.3% vs last month</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500">{product.sales} units sold</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">{product.revenue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <a href="/admin/orders" className="text-sm text-green-600 hover:text-green-700 font-medium">
              View All →
            </a>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{order.id}</div>
                  <div className="text-sm text-gray-500">{order.customer} • {order.time}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{order.amount}</div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-gray-600 text-sm font-medium mb-1">Pending Orders</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-gray-600 text-sm font-medium mb-1">Completed Orders</div>
          <div className="text-2xl font-bold text-green-600">{stats.completedOrders}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-gray-600 text-sm font-medium mb-1">Active Users</div>
          <div className="text-2xl font-bold text-blue-600">{stats.activeUsers}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-gray-600 text-sm font-medium mb-1">Conversion Rate</div>
          <div className="text-2xl font-bold text-purple-600">{stats.conversionRate}%</div>
        </div>
      </div>
    </AdminLayout>
  );
}
