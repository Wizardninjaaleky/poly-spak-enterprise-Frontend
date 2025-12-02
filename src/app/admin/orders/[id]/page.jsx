'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'https://poly-spak-enterprise-backend-2.onrender.com';

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
    if (params?.id) {
      fetchOrderDetails(token, params.id);
    }
  }, [router, params]);

  const fetchOrderDetails = async (token, orderId) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setOrder(data.data || data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/orders/${order._id}/status`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrder({ ...order, status: newStatus });
        alert('Order status updated!');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const printInvoice = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <AdminLayout user={user}>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
          <Link href="/admin/orders" className="text-green-600 hover:underline mt-4 inline-block">
            ← Back to Orders
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const statusTimeline = [
    { status: 'pending', label: 'Order Placed', completed: true },
    { status: 'processing', label: 'Processing', completed: ['processing', 'completed', 'delivered'].includes(order.status) },
    { status: 'completed', label: 'Completed', completed: ['completed', 'delivered'].includes(order.status) },
    { status: 'delivered', label: 'Delivered', completed: order.status === 'delivered' },
  ];

  return (
    <AdminLayout
      user={user}
      title={`Order #${order.orderNumber || order._id.slice(-8)}`}
      breadcrumbs={[
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Orders', href: '/admin/orders' },
        { label: `#${order.orderNumber || order._id.slice(-8)}` }
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h3>
            <div className="relative">
              <div className="flex justify-between items-center">
                {statusTimeline.map((step, idx) => (
                  <div key={step.status} className="flex-1 relative">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                          step.completed
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {step.completed ? '✓' : idx + 1}
                      </div>
                      <div className={`mt-2 text-xs font-medium text-center ${
                        step.completed ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {step.label}
                      </div>
                    </div>
                    {idx < statusTimeline.length - 1 && (
                      <div
                        className={`absolute top-5 left-1/2 w-full h-0.5 ${
                          statusTimeline[idx + 1].completed ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                        style={{ transform: 'translateY(-50%)' }}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Order Status
              </label>
              <select
                value={order.status}
                onChange={(e) => updateStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                    📦
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.productId?.name || item.name}</div>
                    <div className="text-sm text-gray-500">SKU: {item.productId?.sku || 'N/A'}</div>
                    <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      KSh {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      @ KSh {(item.price || 0).toLocaleString()} each
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">KSh {(order.totalAmount || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">KSh 0</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span className="text-green-600">KSh {(order.totalAmount || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-500">Address:</span>
                <p className="font-medium">{order.shippingAddress?.street || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">City:</span>
                <p className="font-medium">{order.shippingAddress?.city || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Postal Code:</span>
                <p className="font-medium">{order.shippingAddress?.postalCode || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Country:</span>
                <p className="font-medium">{order.shippingAddress?.country || 'Kenya'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Name</span>
                <p className="font-medium">{order.userId?.name || 'Guest Customer'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Email</span>
                <p className="font-medium">{order.userId?.email || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Phone</span>
                <p className="font-medium">{order.userId?.phone || order.phone || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Customer Since</span>
                <p className="font-medium">
                  {order.userId?.createdAt
                    ? new Date(order.userId.createdAt).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Method</span>
                <p className="font-medium uppercase">{order.paymentMethod || 'M-PESA'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Status</span>
                <p className={`font-medium ${
                  order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {order.paymentStatus || 'Pending'}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Transaction ID</span>
                <p className="font-medium">{order.transactionId || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Order Date</span>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Order Time</span>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleTimeString('en-US')}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Order ID</span>
                <p className="font-medium font-mono text-xs">{order._id}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={printInvoice}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <span>🖨️</span> Print Invoice
            </button>
            <Link
              href="/admin/orders"
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
            >
              ← Back to Orders
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
