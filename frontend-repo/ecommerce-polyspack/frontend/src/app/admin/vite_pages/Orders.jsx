"use client";

import React, { useState, useEffect } from 'react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    setTimeout(() => {
      setOrders([
        { id: '12350', customer: 'John Doe', email: 'john@example.com', total: 3200, status: 'pending', date: 'Dec 20, 2024', items: 3 },
        { id: '12349', customer: 'Jane Smith', email: 'jane@example.com', total: 1800, status: 'completed', date: 'Dec 20, 2024', items: 2 },
        { id: '12348', customer: 'Alice Johnson', email: 'alice@example.com', total: 2500, status: 'processing', date: 'Dec 19, 2024', items: 4 },
        { id: '12347', customer: 'Bob Wilson', email: 'bob@example.com', total: 4200, status: 'shipped', date: 'Dec 18, 2024', items: 5 },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const updateStatus = (id, newStatus) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600 mt-1">Track and manage customer orders</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">Order #{order.id}</h3>
                  <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-700 font-medium">{order.customer}</p>
                <p className="text-sm text-gray-600">{order.email}</p>
                <p className="text-sm text-gray-600 mt-2">{order.date} • {order.items} items</p>
              </div>
              <div className="flex flex-col justify-between items-end">
                <p className="text-2xl font-bold text-gray-900">KSh {order.total.toLocaleString()}</p>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm font-medium">
                View Details
              </button>
              <button className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors text-sm font-medium">
                Print Invoice
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
