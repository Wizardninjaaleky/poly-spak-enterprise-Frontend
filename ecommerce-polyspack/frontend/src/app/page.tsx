import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

export const metadata: Metadata = {
  title: 'Polyspack Enterprises - Seedling Bags, Electronics & Services',
  description: 'Your trusted partner for seedling bags, electronics, and professional services. Countrywide delivery across Kenya.',
  keywords: 'seedling bags, electronics, services, Kenya, delivery, Polyspack',
};

export default function HomePage() {
  // Mock data for demonstration - will be replaced with API calls
  const featuredProducts = [
    {
      id: '1',
      title: 'Premium Seedling Bags - 100 Pack',
      slug: 'premium-seedling-bags-100-pack',
      category: 'Seedling Bags',
      price: 2500,
      salePrice: 2200,
      images: ['/placeholder-seedling.jpg'],
      sku: 'SB-100-PREM',
      stockQty: 50,
      attributes: { size: 'Medium', material: 'Biodegradable' },
      description: 'High-quality seedling bags perfect for nursery operations.'
    },
    {
      id: '2',
      title: 'Solar-Powered LED Light',
      slug: 'solar-powered-led-light',
      category: 'Electronics',
      price: 1500,
      images: ['/placeholder-electronics.jpg'],
      sku: 'EL-SOLAR-LED',
      stockQty: 25,
      attributes: { power: '5W', battery: '2000mAh' },
      description: 'Energy-efficient solar powered LED lighting solution.'
    },
    {
      id: '3',
      title: 'Agricultural Consulting Service',
      slug: 'agricultural-consulting-service',
      category: 'Services',
      price: 5000,
      images: ['/placeholder-service.jpg'],
      sku: 'SVC-AGRI-CONSULT',
      stockQty: 10,
      attributes: { duration: 'Full Day', type: 'On-site' },
      description: 'Expert agricultural consulting for optimal farm management.'
    }
  ];

  const categories = [
    {
      name: 'Seedling Bags',
      image: '/placeholder-seedling.jpg',
      description: 'High-quality biodegradable seedling bags for nurseries',
      productCount: 25
    },
    {
      name: 'Electronics',
      image: '/placeholder-electronics.jpg',
      description: 'Energy-efficient electronic solutions',
      productCount: 18
    },
    {
      name: 'Services',
      image: '/placeholder-service.jpg',
      description: 'Professional agricultural and technical services',
      productCount: 12
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 bg-white/10 rounded-full animate-bounce" style={{animationDelay: '2s', animationDuration: '3.5s'}}></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-bounce" style={{animationDelay: '0.5s', animationDuration: '4.5s'}}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 typing-animation">
                Welcome to Polyspack Enterprises
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-fade-in-up opacity-0" style={{animationDelay: '4s', animationFillMode: 'forwards'}}>
                Your trusted partner for <span className="font-semibold text-yellow-200">seedling bags</span>, <span className="font-semibold text-yellow-200">electronics</span>, and <span className="font-semibold text-yellow-200">professional services</span>.
                Quality products with countrywide delivery across Kenya.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up opacity-0" style={{animationDelay: '4.5s', animationFillMode: 'forwards'}}>
                <span className="text-yellow-200 font-semibold">Shop Now</span>
                <span className="text-yellow-200 font-semibold">Explore Categories</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up opacity-0" style={{animationDelay: '5s', animationFillMode: 'forwards'}}>
              <Link
                href="/products"
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-pulse"
              >
                Shop Now
              </Link>
              <Link
                href="#categories"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Explore Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in-up">Our Categories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              Discover our wide range of products and services designed to meet your agricultural and technical needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group animate-fade-in-up"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <div className="relative h-48">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors duration-300">
                      <div className="text-center text-white">
                        <h3 className="text-2xl font-bold mb-2 animate-pulse">{category.name}</h3>
                        <p className="text-sm opacity-90">{category.productCount} Products</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-center">{category.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in-up">Featured Products</h2>
            <p className="text-lg text-gray-600 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              Check out our most popular products and services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className="animate-fade-in-up" style={{animationDelay: `${index * 0.2}s`}}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
            <Link
              href="/products"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-pulse"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in-up">Why Choose Polyspack?</h2>
            <p className="text-lg text-gray-600 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              We're committed to providing exceptional products and services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ),
                title: 'Quality Products',
                description: 'Premium quality seedling bags and electronics that meet international standards.',
                delay: '0s'
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                ),
                title: 'Countrywide Delivery',
                description: 'Fast and reliable delivery services across all counties in Kenya.',
                delay: '0.2s'
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Expert Services',
                description: 'Professional agricultural consulting and technical support services.',
                delay: '0.4s'
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                ),
                title: 'Secure Payments',
                description: 'Safe and secure payment processing with M-PESA integration.',
                delay: '0.6s'
              }
            ].map((item, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{animationDelay: item.delay}}>
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce" style={{animationDelay: item.delay, animationDuration: '2s'}}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 animate-fade-in-up">Ready to Get Started?</h2>
          <p className="text-xl mb-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Contact us today for your seedling bags, electronics, and service needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <Link
              href="/contact"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-pulse"
            >
              Contact Us
            </Link>
            <Link
              href="/products"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
