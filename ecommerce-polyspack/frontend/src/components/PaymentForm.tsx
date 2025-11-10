'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { paymentAPI, ordersAPI } from '@/services/api';
import ReCAPTCHA from 'react-google-recaptcha';

interface PaymentFormData {
  phoneNumber: string;
  mpesaCode: string;
}

interface Order {
  orderNumber: string;
  totalAmount: number;
  paymentStatus: string;
}

const PaymentForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);

  const orderId = searchParams.get('orderId');

  const [formData, setFormData] = useState<PaymentFormData>({
    phoneNumber: '',
    mpesaCode: ''
  });

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

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
      } catch (error) {
        console.error('Error fetching order:', error);
        alert('Error loading order details. Please try again.');
        router.push('/cart');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    if (!recaptchaToken) {
      alert('Please complete the reCAPTCHA verification.');
      return;
    }

    setSubmitting(true);

    try {
      const paymentData = {
        orderId,
        amount: order.totalAmount,
        phoneNumber: formData.phoneNumber,
        mpesaCode: formData.mpesaCode,
        recaptchaToken
      };

      const response = await paymentAPI.submitPayment(paymentData);

      if (response.data.success) {
        // Redirect to payment status page
        router.push(`/payment/status?orderId=${orderId}`);
      } else {
        alert(response.data.message || 'Payment submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment submission error:', error);
      const errorMessage = (error as unknown as { response?: { data?: { message?: string } } }).response?.data?.message || 'An error occurred. Please try again.';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
      // Reset reCAPTCHA
      setRecaptchaToken(null);
      recaptchaRef.current?.reset();
    }
  };

  const onRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.push('/cart')}
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
            <p className="text-gray-600">Submit your M-Pesa payment details for verification</p>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
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
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 text-xs rounded ${
                  order.paymentStatus === 'awaiting'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {order.paymentStatus === 'awaiting' ? 'Awaiting Payment' : order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Payment Instructions</h3>
            <div className="text-sm text-green-700 space-y-3">
              <div>
                <p className="font-medium mb-2">M-Pesa Paybill Details:</p>
                <p><strong>Paybill Number:</strong> 522533</p>
                <p><strong>Account Number:</strong> 8011202</p>
              </div>
              <div>
                <p className="font-medium mb-2">Steps to complete payment:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Open your M-Pesa menu on your phone</li>
                  <li>Select{"\u201C"}Lipa na M-Pesa{"\u201D"}</li>
                  <li>Choose{"\u201C"}Pay Bill{"\u201D"}</li>
                  <li>Enter Paybill Number: <strong>522533</strong></li>
                  <li>Enter Account Number: <strong>8011202</strong></li>
                  <li>Enter the exact amount: <strong>KSh {order.totalAmount.toLocaleString()}</strong></li>
                  <li>Enter your M-Pesa PIN and confirm</li>
                  <li>You will receive a confirmation SMS with the transaction code</li>
                </ol>
              </div>
              <p className="text-xs text-gray-600 mt-4">
                <strong>Important:</strong> Make sure to pay the exact amount shown above. Any discrepancy may delay verification.
              </p>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number Used for Payment
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="e.g., +254712345678 or 0712345678"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">Enter the phone number you used to make the M-Pesa payment</p>
            </div>

            <div>
              <label htmlFor="mpesaCode" className="block text-sm font-medium text-gray-700 mb-2">
                M-Pesa Transaction Code
              </label>
              <input
                type="text"
                id="mpesaCode"
                name="mpesaCode"
                required
                value={formData.mpesaCode}
                onChange={handleInputChange}
                placeholder='e.g., QWE1X2Y3Z4'
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 uppercase"
                maxLength={15}
              />
              <p className="text-xs text-gray-500 mt-1">Enter the transaction code from your M-Pesa confirmation SMS</p>
            </div>

            {/* reCAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
                onChange={onRecaptchaChange}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting Payment...
                </>
              ) : (
                'Submit Payment for Verification'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push(`/orders/${orderId}`)}
              className="text-sm text-green-600 hover:text-green-500"
            >
              ← Back to Order Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
