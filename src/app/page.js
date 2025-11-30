"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchFeaturedProducts();
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('https://poly-spak-enterprise-backend-2.onrender.com/api/products');
      const data = await response.json();
      setFeaturedProducts((data.products || []).slice(0, 8));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const categories = [
    { name: 'Seedling Bags', icon: '🌱', color: 'bg-green-100' },
    { name: 'Electronics', icon: '⚡', color: 'bg-blue-100' },
    { name: 'Services', icon: '🔧', color: 'bg-purple-100' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-green-700 text-white text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span>📞 Call: +254 742 312306</span>
          <span>🚚 Free Delivery on Orders Over KSh 5,000</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-green-700 whitespace-nowrap">
              Polyspack
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products, brands and categories..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button className="absolute right-0 top-0 h-full px-6 bg-green-600 text-white rounded-r-lg hover:bg-green-700">
                  🔍
                </button>
              </div>
            </div>

            {/* Account & Cart */}
            <div className="flex items-center gap-4">
              <Link href="/profile" className="flex items-center gap-2 text-gray-700 hover:text-green-600">
                <span className="text-2xl">👤</span>
                <div className="hidden md:block text-sm">
                  <div className="text-xs text-gray-500">Hello</div>
                  <div className="font-semibold">Profile</div>
                </div>
              </Link>
              <Link href="/cart" className="flex items-center gap-2 text-gray-700 hover:text-green-600 relative">
                <span className="text-2xl">🛒</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
                <div className="hidden md:block text-sm">
                  <div className="text-xs text-gray-500">Cart</div>
                  <div className="font-semibold">{cart.length} items</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Categories Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/products?category=${cat.name}`}
                className={`${cat.color} p-6 rounded-lg text-center hover:shadow-lg transition-all transform hover:scale-105`}
              >
                <div className="text-5xl mb-3">{cat.icon}</div>
                <div className="text-lg font-bold text-gray-800">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Quality Products & Services
              </h1>
              <p className="text-xl mb-6 text-green-100">
                Seedling bags, electronics, and professional services for your needs!
              </p>
              <Link
                href="/products"
                className="inline-block bg-white text-green-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
              >
                Shop Now →
              </Link>
            </div>
            <div className="text-6xl text-center">
              🌱⚡🔧
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link href="/products" className="text-green-600 hover:text-green-700 font-semibold">
            See All →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredProducts.map((product) => (
            <Link
              key={product._id}
              href={`/products/${product._id}`}
              className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition border"
            >
              <div className="relative h-48 bg-gray-100">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-4xl">📦</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">
                  {product.name}
                </h3>
                <div className="text-xl font-bold text-gray-900 mb-1">
                  KSh {product.price?.toLocaleString()}
                </div>
                {product.stock < 20 && (
                  <div className="text-xs text-red-600">Only {product.stock} left!</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white border-y py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="font-bold text-gray-900 mb-1">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Nationwide shipping</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💳</div>
              <h3 className="font-bold text-gray-900 mb-1">Secure Payment</h3>
              <p className="text-sm text-gray-600">M-Pesa & Card accepted</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-bold text-gray-900 mb-1">100% Authentic</h3>
              <p className="text-sm text-gray-600">Genuine products only</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📞</div>
              <h3 className="font-bold text-gray-900 mb-1">24/7 Support</h3>
              <p className="text-sm text-gray-600">Always here to help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* Need Help */}
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase">Need Help?</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/track" className="hover:text-white">Track Your Order</Link></li>
                <li><Link href="/help" className="hover:text-white">Chat with us</Link></li>
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              </ul>
            </div>

            {/* About Polyspack */}
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase">About Polyspack</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About us</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms and Conditions</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Notice</Link></li>
                <li><Link href="/cookies" className="hover:text-white">Cookies Notice</Link></li>
              </ul>
            </div>

            {/* Useful Links */}
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase">Useful Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/track" className="hover:text-white">Track Your Order</Link></li>
                <li><Link href="/shipping" className="hover:text-white">Shipping and Delivery</Link></li>
                <li><Link href="/returns" className="hover:text-white">Return Policy</Link></li>
                <li><Link href="/how-to-order" className="hover:text-white">How to Order</Link></li>
              </ul>
            </div>

            {/* Join Us */}
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase">Join Us On</h4>
              <div className="flex gap-4 mb-6">
                <a href="#" className="text-2xl hover:text-white">📘</a>
                <a href="#" className="text-2xl hover:text-white">📷</a>
                <a href="#" className="text-2xl hover:text-white">🐦</a>
                <a href="#" className="text-2xl hover:text-white">▶️</a>
              </div>
              <h4 className="text-white font-bold mb-3 text-sm uppercase">Payment Methods</h4>
              <div className="flex flex-wrap gap-2">
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold text-gray-800">M-PESA</div>
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold text-gray-800">Bank</div>
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold text-gray-800">Cash</div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
              <p className="text-gray-400">© 2025 Polyspack Enterprises</p>
              <div className="flex gap-4">
                <span className="text-gray-400">📞 +254 742 312306</span>
                <span className="text-gray-400">✉️ info@polyspack.co.ke</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
