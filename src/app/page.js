"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import TypingAnimation from '@/components/TypingAnimation';
import { API_ENDPOINTS, API_BASE_URL } from '@/config/api';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [settings, setSettings] = useState({
    logo: '',
    contactPhone: '+254 742 312306',
    contactEmail: 'polyspackenterprise@gmail.com'
  });

  useEffect(() => {
    fetchFeaturedProducts();
    fetchHeroSlides();
    fetchSettings();
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (heroSlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000); // Change slide every 5 seconds
      return () => clearInterval(interval);
    }
  }, [heroSlides.length]);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PRODUCTS);
      const data = await response.json();
      setFeaturedProducts((data.data || data.products || []).slice(0, 8));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchHeroSlides = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.HERO_SLIDES}/active`);
      const data = await response.json();
      if (data.success && data.slides.length > 0) {
        setHeroSlides(data.slides);
      } else {
        // Default slide if none exist
        setHeroSlides([{
          title: 'Quality Products & Services',
          subtitle: 'Seedling bags, electronics, and professional services for your needs!',
          buttonText: 'Shop Now',
          buttonLink: '/products',
          imageUrl: ''
        }]);
      }
    } catch (error) {
      console.error('Error fetching hero slides:', error);
      setHeroSlides([{
        title: 'Quality Products & Services',
        subtitle: 'Seedling bags, electronics, and professional services for your needs!',
        buttonText: 'Shop Now',
        buttonLink: '/products',
        imageUrl: ''
      }]);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.SETTINGS);
      const data = await response.json();
      if (data.success && data.data) {
        setSettings({
          logo: data.data.logo || '',
          contactPhone: data.data.contactPhone || '+254 742 312306',
          contactEmail: data.data.contactEmail || 'polyspackenterprise@gmail.com'
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
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
        <div className="max-w-[1600px] mx-auto px-6 flex justify-between items-center flex-wrap gap-2">
          <span>📞 Call: +254 742 312306</span>
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-200"></span>
            </span>
            <span className="font-semibold">Open 24/7 - Order Anytime!</span>
          </span>
          <span>🚚 Free Delivery on Orders Over KSh 5,000</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              {settings.logo && (
                <img 
                  src={settings.logo} 
                  alt="Polyspack Enterprises" 
                  className="h-10 object-contain"
                />
              )}
              <TypingAnimation text="Polyspack Enterprises" speed={150} className="text-2xl font-bold text-green-700 whitespace-nowrap" />
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
              <Link href="/login" className="hidden md:inline-block px-4 py-2 text-green-600 hover:text-green-700 font-semibold border border-green-600 rounded-lg hover:bg-green-50 transition">
                Login
              </Link>
              <Link href="/register" className="hidden md:inline-block px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                Sign Up
              </Link>
              <Link href="/profile" className="flex items-center gap-2 text-gray-700 hover:text-green-600">
                <span className="text-2xl">👤</span>
                <div className="hidden lg:block text-sm">
                  <div className="text-xs text-gray-500">Hello</div>
                  <div className="font-semibold">Profile</div>
                </div>
              </Link>
              <Link href="/cart" className="group flex items-center gap-2 text-gray-700 hover:text-green-600 relative transition-colors">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🛒</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse-slow">
                    {cart.length}
                  </span>
                )}
                <div className="hidden md:block text-sm">
                  <div className="text-xs text-gray-500 group-hover:text-green-600 transition-colors">Cart</div>
                  <div className="font-semibold">{cart.length} items</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Categories Carousel - Full Width */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="relative h-[400px] md:h-[500px]">
          {categories.map((cat, index) => (
            <div
              key={cat.name}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === (currentSlide % categories.length) ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Background Pattern/Image */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-900/95 to-green-800/90"></div>
              <div className="absolute inset-0" style={{
                backgroundImage: cat.name === 'Seedling Bags' 
                  ? 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                  : cat.name === 'Electronics'
                  ? 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.05" fill-rule="evenodd"%3E%3Cpath d="M0 40L40 0H20L0 20M40 40V20L20 40"/%3E%3C/g%3E%3C/svg%3E")'
                  : 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.05" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3C/g%3E%3C/svg%3E")'
              }}></div>
              
              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="w-full max-w-[1600px] mx-auto px-6">
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left: Text Content */}
                    <div className="text-white space-y-6 animate-fade-in-up">
                      <div className="inline-block">
                        <div className={`inline-flex items-center gap-3 ${cat.color} bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/30`}>
                          <span className="text-6xl">{cat.icon}</span>
                          <span className="text-2xl font-bold text-white">{cat.name}</span>
                        </div>
                      </div>
                      
                      <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                        {cat.name === 'Seedling Bags' && 'Premium Quality Seedling Bags'}
                        {cat.name === 'Electronics' && 'Latest Electronics & Gadgets'}
                        {cat.name === 'Services' && 'Professional Services'}
                      </h2>
                      
                      <p className="text-xl md:text-2xl text-green-50 leading-relaxed">
                        {cat.name === 'Seedling Bags' && 'Durable, eco-friendly bags for your nursery and farming needs. Various sizes available.'}
                        {cat.name === 'Electronics' && 'High-quality electronic products and accessories for home and office use.'}
                        {cat.name === 'Services' && 'Expert solutions tailored to your business requirements and technical needs.'}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 pt-4">
                        <Link
                          href={`/products?category=${cat.name}`}
                          className="group inline-flex items-center gap-3 bg-white text-green-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-50 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                        >
                          <span>Shop {cat.name}</span>
                          <span className="text-2xl group-hover:translate-x-2 transition-transform duration-300">→</span>
                        </Link>
                        <Link
                          href="/products"
                          className="inline-flex items-center gap-3 border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                        >
                          View All Products
                        </Link>
                      </div>
                    </div>

                    {/* Right: Visual Element */}
                    <div className="hidden md:flex justify-center items-center animate-fade-in-up animation-delay-300">
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="relative text-[180px] animate-float">
                          {cat.icon}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + categories.length) % categories.length)}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-4 rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Previous category"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % categories.length)}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-4 rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Next category"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {categories.map((cat, index) => (
            <button
              key={cat.name}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === (currentSlide % categories.length)
                  ? 'bg-white w-12 h-3'
                  : 'bg-white/50 hover:bg-white/75 w-3 h-3'
              }`}
              aria-label={`Go to ${cat.name}`}
            />
          ))}
        </div>
      </div>

      {/* Hero Banner Carousel */}
      <div className="relative bg-gradient-to-r from-green-600 to-green-800 text-white overflow-hidden">
        {/* Slides Container */}
        <div className="relative h-[500px] md:h-[600px]">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Background Image */}
              {slide.imageUrl && (
                <div className="absolute inset-0">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-green-800/70"></div>
                </div>
              )}
              
              {/* Content */}
              <div className="relative z-10 max-w-[1600px] mx-auto px-6 h-full flex items-center">
                <div className="grid md:grid-cols-2 gap-8 items-center w-full">
                  <div className="animate-fade-in-up">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-slide-in-left">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-6 text-green-50 animate-slide-in-left animation-delay-200">
                      {slide.subtitle}
                    </p>
                    <div className="flex items-center gap-4 mb-6 animate-slide-in-left animation-delay-300">
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-200"></span>
                        </span>
                        <span className="text-sm font-semibold">Available 24/7</span>
                      </div>
                    </div>
                    <Link
                      href={slide.buttonLink}
                      className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-white to-green-50 text-green-700 px-8 py-4 rounded-lg font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-pulse-slow"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-green-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">{slide.buttonText}</span>
                      <span className="relative z-10 text-2xl group-hover:translate-x-2 transition-transform duration-300">→</span>
                      <span className="absolute inset-0 border-2 border-white/50 rounded-lg opacity-0 group-hover:opacity-100 animate-pulse-border"></span>
                    </Link>
                  </div>
                  <div className="hidden md:flex justify-center items-center gap-4 animate-fade-in-up animation-delay-300">
                    <div className="text-6xl animate-bounce-slow">🌱</div>
                    <div className="text-6xl animate-bounce-slow" style={{ animationDelay: '0.5s' }}>⚡</div>
                    <div className="text-6xl animate-bounce-slow" style={{ animationDelay: '1s' }}>🔧</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {heroSlides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Next slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {heroSlides.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Featured Products */}
      <div className="max-w-[1600px] mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-6 animate-fade-in-up">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link href="/products" className="group text-green-600 hover:text-green-700 font-semibold flex items-center gap-1 transition-all">
            See All 
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {featuredProducts.map((product, index) => (
            <Link
              key={product._id}
              href={`/products/${product._id}`}
              className="group bg-white rounded-lg overflow-hidden border card-hover animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-4xl group-hover:scale-110 transition-transform duration-300">📦</div>
                )}
                {product.stock < 20 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold animate-pulse-slow">
                    Low Stock
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm group-hover:text-green-600 transition-colors">
                  {product.name}
                </h3>
                <div className="text-xl font-bold text-gray-900 mb-1">
                  KSh {product.price?.toLocaleString()}
                </div>
                {product.stock < 20 && (
                  <div className="text-xs text-red-600 font-semibold">Only {product.stock} left!</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-green-50 to-white border-y py-12">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in-up">
              <div className="text-4xl mb-3 animate-float">🚚</div>
              <h3 className="font-bold text-gray-900 mb-1">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Nationwide shipping</p>
            </div>
            <div className="text-center animate-fade-in-up animation-delay-200">
              <div className="text-4xl mb-3 animate-float" style={{ animationDelay: '0.5s' }}>💳</div>
              <h3 className="font-bold text-gray-900 mb-1">Secure Payment</h3>
              <p className="text-sm text-gray-600">M-Pesa & Card accepted</p>
            </div>
            <div className="text-center animate-fade-in-up animation-delay-300">
              <div className="text-4xl mb-3 animate-float" style={{ animationDelay: '1s' }}>🔒</div>
              <h3 className="font-bold text-gray-900 mb-1">100% Authentic</h3>
              <p className="text-sm text-gray-600">Genuine products only</p>
            </div>
            <div className="text-center animate-fade-in-up animation-delay-400">
              <div className="text-4xl mb-3 animate-float" style={{ animationDelay: '1.5s' }}>📞</div>
              <h3 className="font-bold text-gray-900 mb-1">24/7 Support</h3>
              <p className="text-sm text-gray-600">Always here to help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="max-w-[1600px] mx-auto px-6">
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
                <span className="text-gray-400">📞 {settings.contactPhone}</span>
                <span className="text-gray-400">✉️ {settings.contactEmail}</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
