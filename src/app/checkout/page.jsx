"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState(1); // 1: Details, 2: Payment Instructions
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const delivery = subtotal > 5000 ? 0 : 300;
  const total = subtotal + delivery;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order
      const orderData = {
        items: cart.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
        },
        totalAmount: total,
        paymentMethod: paymentMethod,
        customerEmail: formData.email,
        notes: formData.notes,
      };

      const response = await fetch('https://poly-spak-enterprise-backend-2.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setStep(2); // Move to payment instructions
      } else {
        alert('Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Link href="/products" className="text-green-600 hover:text-green-700 font-semibold">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-green-700">
              Polyspack
            </Link>
            <div className="text-sm text-gray-600">
              Secure Checkout 🔒
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {step === 1 ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Information</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="+254 700 000 000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Street address, P.O. Box, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City/Town *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Nairobi"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Any special delivery instructions..."
                    />
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="payment"
                          value="mpesa"
                          checked={paymentMethod === 'mpesa'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-green-600"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">M-PESA</div>
                          <div className="text-sm text-gray-600">Pay via M-PESA mobile money</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="payment"
                          value="bank"
                          checked={paymentMethod === 'bank'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-green-600"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">Bank Transfer</div>
                          <div className="text-sm text-gray-600">Direct bank deposit</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="payment"
                          value="cash"
                          checked={paymentMethod === 'cash'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-green-600"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">Cash on Delivery</div>
                          <div className="text-sm text-gray-600">Pay when you receive</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold text-lg disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Continue to Payment'}
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

                <div className="space-y-3 mb-4 pb-4 border-b">
                  {cart.map((item) => (
                    <div key={item._id} className="flex gap-3">
                      <div className="text-sm text-gray-600">
                        {item.quantity}x
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">{item.name}</div>
                        <div className="text-sm font-semibold text-gray-900">
                          KSh {(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-4 pb-4 border-b">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span className="font-semibold">KSh {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery:</span>
                    <span className="font-semibold">
                      {delivery === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `KSh ${delivery.toLocaleString()}`
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total:</span>
                  <span className="text-green-600">KSh {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Payment Instructions */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Your order has been received and is being processed.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-left">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Payment Instructions</h3>

                {paymentMethod === 'mpesa' && (
                  <div className="space-y-3 text-sm">
                    <p className="font-semibold text-gray-900">M-PESA Payment Details:</p>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>Go to M-PESA menu on your phone</li>
                      <li>Select "Lipa na M-PESA"</li>
                      <li>Select "Pay Bill"</li>
                      <li>Enter Business Number: <span className="font-bold">123456</span></li>
                      <li>Enter Account Number: <span className="font-bold">Your Phone Number</span></li>
                      <li>Enter Amount: <span className="font-bold text-green-600">KSh {total.toLocaleString()}</span></li>
                      <li>Enter your M-PESA PIN and confirm</li>
                      <li>You will receive an M-PESA confirmation message</li>
                      <li className="text-red-600 font-semibold">Send the M-PESA confirmation code to +254 700 000 000 via WhatsApp or SMS</li>
                    </ol>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div className="space-y-3 text-sm">
                    <p className="font-semibold text-gray-900">Bank Transfer Details:</p>
                    <div className="bg-white p-4 rounded border space-y-2">
                      <div><span className="font-semibold">Bank:</span> Equity Bank</div>
                      <div><span className="font-semibold">Account Name:</span> Polyspack Enterprises Ltd</div>
                      <div><span className="font-semibold">Account Number:</span> 0123456789</div>
                      <div><span className="font-semibold">Branch:</span> Nairobi</div>
                      <div><span className="font-semibold">Amount:</span> <span className="text-green-600 font-bold">KSh {total.toLocaleString()}</span></div>
                    </div>
                    <p className="text-red-600 font-semibold mt-4">
                      After payment, send transaction slip/receipt to info@polyspack.co.ke or WhatsApp +254 700 000 000
                    </p>
                  </div>
                )}

                {paymentMethod === 'cash' && (
                  <div className="space-y-3 text-sm">
                    <p className="font-semibold text-gray-900">Cash on Delivery:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Prepare exact amount: <span className="font-bold text-green-600">KSh {total.toLocaleString()}</span></li>
                      <li>Our delivery agent will contact you before delivery</li>
                      <li>Payment will be collected upon delivery</li>
                      <li>Please have cash ready to avoid delays</li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-sm text-left">
                <p className="font-semibold text-gray-900 mb-2">⚠️ Important:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Your order will be confirmed once admin verifies your payment</li>
                  <li>You will receive a confirmation call/SMS within 24 hours</li>
                  <li>For urgent orders, contact us at +254 700 000 000</li>
                </ul>
              </div>

              <div className="flex gap-4 justify-center">
                <Link
                  href="/products"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
