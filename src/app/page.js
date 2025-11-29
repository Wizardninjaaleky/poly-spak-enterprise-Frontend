"use client";

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-green-800 mb-6">
            Polyspack Enterprises
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Your trusted partner for quality agricultural products and solutions. 
            Browse our catalog and find everything you need for your farming success.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/products"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition shadow-lg"
            >
              Browse Products
            </Link>
            <Link 
              href="/login"
              className="bg-white hover:bg-gray-50 text-green-700 px-8 py-4 rounded-lg text-lg font-semibold transition shadow-lg border-2 border-green-600"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="text-4xl mb-4">🌾</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Products</h3>
            <p className="text-gray-600">Premium agricultural supplies for optimal yields</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Quick and reliable shipping across Kenya</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Prices</h3>
            <p className="text-gray-600">Competitive pricing for all your farming needs</p>
          </div>
        </div>

        {/* Admin Link */}
        <div className="mt-16 text-center">
          <Link 
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
