"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const trackOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await fetch(
        `https://poly-spak-enterprise-backend-2.onrender.com/api/orders/track?orderId=${orderId}&phone=${phoneNumber}`
      );
      
      const data = await response.json();
      
      if (response.ok && data.order) {
        setOrder(data.order);
      } else {
        setError(data.message || 'Order not found');
      }
    } catch (err) {
      setError('Failed to track order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-700 text-white text-xs py-2">
        <div className="max-w-[1600px] mx-auto px-6 flex justify-between items-center">
          <span>📞 Call: +254 742 312306</span>
          <span>🚚 Track Your Order</span>
        </div>
      </div>

      <header className="bg-white shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-green-700">
              Polyspack
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/products" className="text-gray-700 hover:text-green-600 font-medium">
                Products
              </Link>
              <Link href="/login" className="hidden md:inline-block px-4 py-2 text-green-600 hover:text-green-700 font-semibold border border-green-600 rounded-lg hover:bg-green-50 transition">
                Login
              </Link>
              <Link href="/register" className="hidden md:inline-block px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">📦</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
            <p className="text-gray-600">Enter your order details to track your delivery</p>
          </div>

          <form onSubmit={trackOrder} className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order ID *
              </label>
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., ORD-123456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="+254 742 312306"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </form>

          {order && (
            <div className="border-t pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Details</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <div className="text-sm text-gray-600">Order ID</div>
                    <div className="font-semibold text-gray-900">{order._id}</div>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Order Date</div>
                    <div className="font-semibold text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Total Amount</div>
                    <div className="font-semibold text-green-600 text-lg">
                      KSh {order.totalAmount?.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-2">Delivery Address</div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-semibold text-gray-900">{order.shippingAddress?.name}</div>
                    <div className="text-gray-700">{order.shippingAddress?.phone}</div>
                    <div className="text-gray-700">
                      {order.shippingAddress?.address}, {order.shippingAddress?.city}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-2">Order Items</div>
                  <div className="space-y-2">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <div>
                          <div className="font-semibold text-gray-900">{item.product?.name || 'Product'}</div>
                          <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                        </div>
                        <div className="font-semibold text-gray-900">
                          KSh {(item.price * item.quantity)?.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {order.trackingNumber && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Tracking Number</div>
                    <div className="font-mono font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {order.trackingNumber}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
