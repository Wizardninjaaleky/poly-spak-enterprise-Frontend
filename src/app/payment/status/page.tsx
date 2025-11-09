'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { ordersAPI } from '@/services/api';

interface OrderItem {
  productId: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  qty: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  shippingAmount: number;
  discountAmount: number;
  items: OrderItem[];
  delivery: {
    type: string;
    address?: {
      street: string;
      city: string;
      county: string;
      town: string;
      country: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

const PaymentStatusPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);

  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not logged in or no orderId
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!orderId) {
      router.push('/cart');
      return;
    }
  }, [user, orderId, router]);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        setLoading(true);
        const response = await ordersAPI.getOrder(orderId);
        setOrder(response.data.data);
      } catch (err: unknown) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment status...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Order not found.'}</p>
          <Link
            href="/cart"
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
          >
            Back to Cart
          </Link>
        </div>
      </div>
    );
  }

  const getStatusInfo = () => {
    switch (order.paymentStatus as string) {
      case 'confirmed':
        return {
          icon: '✅',
          title: 'Payment Confirmed!',
          message: 'Your payment has been successfully verified and your order is being processed.',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'rejected':
        return {
          icon: '❌',
          title: 'Payment Rejected',
          message: 'Your payment could not be verified. Please check your details and try again.',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'awaiting':
      default:
        return {
          icon: '⏳',
          title: 'Payment Under Review',
          message: 'Your payment is being verified. This usually takes 5-10 minutes.',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`rounded-lg shadow p-8 text-center ${statusInfo.bgColor} border ${statusInfo.borderColor}`}>
          <div className="text-6xl mb-4">{statusInfo.icon}</div>
          <h1 className={`text-3xl font-bold mb-4 ${statusInfo.color}`}>{statusInfo.title}</h1>
          <p className="text-gray-700 mb-6">{statusInfo.message}</p>

          {/* Order Details */}
          <div className="bg-white rounded-lg p-6 mb-6 text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-lg text-green-600">KSh {order.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className={`px-2 py-1 text-xs rounded ${
                  (order.paymentStatus as string) === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : (order.paymentStatus as string) === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.paymentStatus === 'confirmed' ? 'Confirmed' :
                   order.paymentStatus === 'rejected' ? 'Rejected' : 'Awaiting Verification'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Status:</span>
                <span className={`px-2 py-1 text-xs rounded ${
                  (order.status as string) === 'processing'
                    ? 'bg-blue-100 text-blue-800'
                    : (order.status as string) === 'shipped'
                    ? 'bg-purple-100 text-purple-800'
                    : (order.status as string) === 'delivered'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              href={`/orders/${orderId}`}
              className="block w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              View Order Details
            </Link>

            {order.paymentStatus === 'rejected' && (
              <Link
                href={`/payment?orderId=${orderId}`}
                className="block w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Payment Again
              </Link>
            )}

            <Link
              href="/products"
              className="block w-full bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Additional Information */}
          {order.paymentStatus === 'awaiting' && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="text-sm font-medium text-blue-800 mb-2">What happens next?</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Our system will verify your M-Pesa payment</li>
                <li>• You&apos;ll receive an email confirmation once verified</li>
                <li>• Processing usually takes 5-10 minutes</li>
                <li>• You can check this page anytime for updates</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusPage;
