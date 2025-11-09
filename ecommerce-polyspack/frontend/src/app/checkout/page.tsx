'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { clearCart } from '@/store/slices/cartSlice';
import { ordersAPI } from '@/services/api';

interface CheckoutFormData {
  deliveryType: 'delivery' | 'pickup';
  address: {
    street: string;
    city: string;
    county: string;
    town: string;
    country: string;
  };
  paymentMethod: 'mpesa' | 'card';
  notes: string;
  couponCode: string;
}

const CheckoutPage: React.FC = () => {
  const { items, total } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const totalAmount = total;

  const [formData, setFormData] = useState<CheckoutFormData>({
    deliveryType: 'delivery',
    address: {
      street: '',
      city: '',
      county: '',
      town: '',
      country: 'Kenya'
    },
    paymentMethod: 'mpesa',
    notes: '',
    couponCode: ''
  });

  const [loading, setLoading] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(totalAmount);

  // Redirect if cart is empty or user not logged in
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
    if (!user) {
      router.push('/login');
    }
  }, [items, user, router]);

  // Calculate final total when discount changes
  useEffect(() => {
    setFinalTotal(total - couponDiscount);
  }, [total, couponDiscount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CheckoutFormData] as Record<string, unknown>),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleApplyCoupon = async () => {
    if (!formData.couponCode.trim()) return;

    try {
      // Mock coupon validation - replace with actual API call
      if (formData.couponCode.toUpperCase() === 'SAVE10') {
        setCouponDiscount(total * 0.1); // 10% discount
        alert('Coupon applied successfully!');
      } else {
        alert('Invalid coupon code');
        setCouponDiscount(0);
      }
    } catch (error) {
      alert('Error applying coupon');
      setCouponDiscount(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          qty: item.quantity,
          price: item.salePrice || item.price
        })),
        totalAmount: finalTotal,
        shippingAmount: formData.deliveryType === 'delivery' ? 500 : 0, // Mock shipping cost
        discountAmount: couponDiscount,
        delivery: {
          type: formData.deliveryType,
          address: formData.deliveryType === 'delivery' ? formData.address : null
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      };

      // Create order via API
      const response = await ordersAPI.createOrder(orderData);

      if (response.data.success) {
        // Clear cart and redirect to payment submission page
        dispatch(clearCart());
        router.push(`/payment?orderId=${response.data.data._id}`);
      } else {
        alert('Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 || !user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Delivery Options */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Options</h2>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="delivery"
                      name="deliveryType"
                      type="radio"
                      value="delivery"
                      checked={formData.deliveryType === 'delivery'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <label htmlFor="delivery" className="ml-3 block text-sm font-medium text-gray-700">
                      <span className="font-semibold">Home Delivery</span> - KSh 500 (2-3 business days)
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="pickup"
                      name="deliveryType"
                      type="radio"
                      value="pickup"
                      checked={formData.deliveryType === 'pickup'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <label htmlFor="pickup" className="ml-3 block text-sm font-medium text-gray-700">
                      <span className="font-semibold">Store Pickup</span> - Free (Same day)
                    </label>
                  </div>
                </div>

                {/* Delivery Address */}
                {formData.deliveryType === 'delivery' && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Delivery Address</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                          Street Address
                        </label>
                        <input
                          type="text"
                          id="address.street"
                          name="address.street"
                          required
                          value={formData.address.street}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          id="address.city"
                          name="address.city"
                          required
                          value={formData.address.city}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="address.county" className="block text-sm font-medium text-gray-700">
                          County
                        </label>
                        <input
                          type="text"
                          id="address.county"
                          name="address.county"
                          required
                          value={formData.address.county}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="address.town" className="block text-sm font-medium text-gray-700">
                          Town
                        </label>
                        <input
                          type="text"
                          id="address.town"
                          name="address.town"
                          required
                          value={formData.address.town}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="mpesa"
                      name="paymentMethod"
                      type="radio"
                      value="mpesa"
                      checked={formData.paymentMethod === 'mpesa'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <label htmlFor="mpesa" className="ml-3 block text-sm font-medium text-gray-700">
                      <span className="font-semibold">M-Pesa</span> - Pay with your mobile money
                    </label>
                  </div>

                  {/* Payment Instructions for M-Pesa */}
                  {formData.paymentMethod === 'mpesa' && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                      <h3 className="text-sm font-medium text-green-800 mb-2">Payment Instructions:</h3>
                      <div className="text-sm text-green-700 space-y-2">
                        <p><strong>M-Pesa Paybill Details:</strong></p>
                        <p>Paybill Number: <span className="font-semibold">522533</span></p>
                        <p>Account Number: <span className="font-semibold">8011202</span></p>
                        <div className="mt-3">
                          <p className="font-medium mb-2">Follow these steps to complete your payment:</p>
                          <ol className="list-decimal list-inside space-y-1 text-xs">
                            <li>Open your M-Pesa menu on your phone</li>
                            <li>Select &ldquo;Lipa na M-Pesa&rdquo;</li>
                            <li>Choose &ldquo;Pay Bill&rdquo;</li>
                            <li>Enter Paybill Number: <strong>522533</strong></li>
                            <li>Enter Account Number: <strong>8011202</strong></li>
                            <li>Enter the exact amount to pay</li>
                            <li>Enter your M-Pesa PIN and confirm</li>
                            <li>You will receive a confirmation SMS with the transaction code</li>
                          </ol>
                        </div>
                        <p className="mt-3 text-xs text-gray-600">
                          After making the payment, paste the M-Pesa transaction code below to verify your payment.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center">
                    <input
                      id="card"
                      name="paymentMethod"
                      type="radio"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <label htmlFor="card" className="ml-3 block text-sm font-medium text-gray-700">
                      <span className="font-semibold">Card Payment</span> - Visa, Mastercard, etc.
                    </label>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Notes (Optional)</h2>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any special instructions for your order..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      KSh {((item.salePrice || item.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>KSh {total.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>KSh {formData.deliveryType === 'delivery' ? '500' : '0'}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-KSh {couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>KSh {(finalTotal + (formData.deliveryType === 'delivery' ? 500 : 0)).toLocaleString()}</span>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <label htmlFor="couponCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="couponCode"
                    name="couponCode"
                    value={formData.couponCode}
                    onChange={handleInputChange}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-r-md hover:bg-gray-200 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  `Complete Order - KSh ${(finalTotal + (formData.deliveryType === 'delivery' ? 500 : 0)).toLocaleString()}`
                )}
              </button>

              <div className="mt-4 text-center">
                <Link href="/cart" className="text-sm text-green-600 hover:text-green-500">
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
