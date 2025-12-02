"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  const updateQuantity = (productId, change) => {
    const newCart = cart.map(item => {
      if (item._id === productId) {
        const newQuantity = Math.max(1, Math.min(item.stock, item.quantity + change));
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeItem = (productId) => {
    const newCart = cart.filter(item => item._id !== productId);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const delivery = subtotal > 5000 ? 0 : 300;
  const total = subtotal + delivery;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-green-700 text-white text-xs py-2">
        <div className="max-w-[1600px] mx-auto px-6 flex justify-between items-center">
          <span>📞 Call: +254 742 312306</span>
          <span>🚚 Delivery Done Countrywide</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-green-700">
              Polyspack
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/products" className="text-gray-700 hover:text-green-600 font-medium">
                Continue Shopping
              </Link>
              <Link href="/login" className="hidden md:inline-block px-4 py-2 text-green-600 hover:text-green-700 font-semibold border border-green-600 rounded-lg hover:bg-green-50 transition">
                Login
              </Link>
              <Link href="/register" className="hidden md:inline-block px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                Sign Up
              </Link>
              <Link href="/profile" className="flex items-center gap-2 text-gray-700 hover:text-green-600">
                <span className="text-2xl">👤</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-[1600px] mx-auto px-6 py-3">
          <div className="text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-semibold">Shopping Cart</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {cart.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Browse our products and add items to your cart</p>
            <Link
              href="/products"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <h2 className="text-xl font-bold text-gray-900">
                    Shopping Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
                  </h2>
                </div>
                
                <div className="divide-y">
                  {cart.map((item) => (
                    <div key={item._id} className="p-6 flex gap-4">
                      <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded">
                        {item.images?.[0] ? (
                          <Image
                            src={item.images[0]}
                            alt={item.name}
                            fill
                            className="object-cover rounded"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-3xl">📦</div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">In Stock</p>
                        <div className="text-lg font-bold text-gray-900">
                          KSh {item.price?.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeItem(item._id)}
                          className="text-red-600 hover:text-red-700 text-sm font-semibold"
                        >
                          Remove
                        </button>
                        
                        <div className="flex items-center gap-2 border rounded">
                          <button
                            onClick={() => updateQuantity(item._id, -1)}
                            className="px-3 py-1 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="px-3 py-1 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, 1)}
                            className="px-3 py-1 hover:bg-gray-100"
                            disabled={item.quantity >= item.stock}
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="text-lg font-bold text-green-600">
                          KSh {(item.price * item.quantity)?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-4 pb-4 border-b">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span className="font-semibold">KSh {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 mb-3">
                    <span>Delivery:</span>
                    <span>
                      {delivery === 0 ? (
                        <span className="text-gray-600">Calculated at checkout</span>
                      ) : (
                        `KSh ${delivery.toLocaleString()}`
                      )}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                  <span>Total:</span>
                  <span className="text-green-600">KSh {total.toLocaleString()}</span>
                </div>
                
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold text-lg mb-3"
                >
                  Proceed to Checkout
                </button>
                
                <Link
                  href="/products"
                  className="block text-center text-green-600 hover:text-green-700 font-semibold"
                >
                  Continue Shopping
                </Link>
                
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="text-2xl">🔒</span>
                    <div>
                      <div className="font-semibold text-gray-900">Secure Checkout</div>
                      <div>Your information is protected</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
