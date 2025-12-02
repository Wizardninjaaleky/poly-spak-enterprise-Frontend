"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AboutPage() {
  const [settings, setSettings] = useState({
    logo: '',
    contactPhone: '+254 742 312306',
    contactEmail: 'polyspackenterprise@gmail.com'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('https://poly-spak-enterprise-backend-2.onrender.com/api/settings');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-green-700 text-white text-xs py-2">
        <div className="max-w-[1600px] mx-auto px-6 flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {settings.logo && (
              <img 
                src={settings.logo} 
                alt="Polyspack Logo" 
                className="h-5 w-5 object-contain"
              />
            )}
            <span>📞 Call: {settings.contactPhone}</span>
          </div>
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-200"></span>
            </span>
            <span className="font-semibold">Open 24/7 - Order Anytime!</span>
          </span>
          <span>🚚 Delivery Done Countrywide</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              {settings.logo && (
                <img 
                  src={settings.logo} 
                  alt="Polyspack Enterprises" 
                  className="h-12 w-12 object-contain"
                />
              )}
              <span className="text-2xl font-bold text-green-700">Polyspack Enterprises</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-700 hover:text-green-600 font-medium">Home</Link>
              <Link href="/products" className="text-gray-700 hover:text-green-600 font-medium">Products</Link>
              <Link href="/about" className="text-green-600 font-semibold border-b-2 border-green-600">About Us</Link>
              <Link href="/contact" className="text-gray-700 hover:text-green-600 font-medium">Contact</Link>
            </nav>

            <Link 
              href="/cart"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all font-semibold"
            >
              🛒 Cart
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Polyspack Enterprises</h1>
          <p className="text-xl opacity-90">Your trusted partner for quality agricultural supplies and electronics across Kenya</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Our Story */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="bg-white rounded-xl shadow-sm border p-8 space-y-4 text-gray-700 leading-relaxed">
            <p>
              Polyspack Enterprises is a leading supplier of agricultural products and electronics in Kenya. 
              Founded with a vision to support Kenya's agricultural sector and provide quality electronic solutions, 
              we have grown to become a trusted name among farmers, nurseries, and businesses nationwide.
            </p>
            <p>
              Our journey began with a simple mission: to provide high-quality seedling bags and nursery supplies 
              to support Kenya's agricultural growth. Over time, we expanded our offerings to include solar lighting, 
              electronics, and professional services, becoming a one-stop solution for our customers' diverse needs.
            </p>
            <p>
              Today, we serve hundreds of satisfied customers across Kenya, from small-scale farmers to large 
              agricultural enterprises, delivering products that meet international quality standards while 
              remaining affordable and accessible.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-sm border p-8">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To empower Kenya's agricultural sector and businesses with high-quality, affordable products 
                and exceptional service. We strive to be the most reliable partner for farmers, nurseries, 
                and enterprises seeking innovative solutions for growth and sustainability.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-sm border p-8">
              <div className="text-4xl mb-4">👁️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To be the leading supplier of agricultural and electronic solutions across East Africa, 
                recognized for our commitment to quality, innovation, customer satisfaction, and 
                contribution to sustainable agricultural practices.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">✅</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Quality First</h4>
              <p className="text-gray-600 text-sm">
                We source only the highest quality products from verified suppliers, ensuring every item meets strict standards.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">🤝</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Customer Trust</h4>
              <p className="text-gray-600 text-sm">
                Building long-term relationships through transparency, reliability, and exceptional customer service.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">🚀</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Innovation</h4>
              <p className="text-gray-600 text-sm">
                Continuously improving our offerings and adopting new technologies to better serve our customers.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">💰</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Fair Pricing</h4>
              <p className="text-gray-600 text-sm">
                Competitive prices without compromising quality, making our products accessible to all businesses.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">🌍</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Sustainability</h4>
              <p className="text-gray-600 text-sm">
                Promoting eco-friendly products and practices that support environmental conservation.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">⚡</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Fast Delivery</h4>
              <p className="text-gray-600 text-sm">
                Nationwide delivery across Kenya with efficient logistics to get products to you on time.
              </p>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="text-5xl mb-4">🌱</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Agricultural Supplies</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>✓ Seedling bags (various sizes)</li>
                <li>✓ Nursery pots and containers</li>
                <li>✓ Tree planting bags</li>
                <li>✓ Biodegradable options available</li>
                <li>✓ Bulk orders for farms and nurseries</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="text-5xl mb-4">💡</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Electronics & Solar</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>✓ Solar LED lights</li>
                <li>✓ Portable lighting solutions</li>
                <li>✓ Electronic accessories</li>
                <li>✓ Power banks and chargers</li>
                <li>✓ Energy-efficient products</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="text-5xl mb-4">🔧</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Professional Services</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>✓ Product consultation</li>
                <li>✓ Custom bulk orders</li>
                <li>✓ Delivery coordination</li>
                <li>✓ After-sales support</li>
                <li>✓ Product recommendations</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-2xl p-10">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Polyspack?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="text-3xl">🏆</div>
              <div>
                <h4 className="font-bold text-lg mb-2">Proven Track Record</h4>
                <p className="text-sm opacity-90">Years of experience serving Kenya's agricultural and business sectors with excellence.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">📦</div>
              <div>
                <h4 className="font-bold text-lg mb-2">Wide Product Range</h4>
                <p className="text-sm opacity-90">From seedling bags to electronics, we offer diverse solutions under one roof.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">🚚</div>
              <div>
                <h4 className="font-bold text-lg mb-2">Nationwide Delivery</h4>
                <p className="text-sm opacity-90">We deliver to all regions of Kenya, ensuring you get what you need, where you need it.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">💳</div>
              <div>
                <h4 className="font-bold text-lg mb-2">Flexible Payment</h4>
                <p className="text-sm opacity-90">M-PESA, bank transfer, and cash on delivery options available for your convenience.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">👥</div>
              <div>
                <h4 className="font-bold text-lg mb-2">Expert Support</h4>
                <p className="text-sm opacity-90">Our knowledgeable team is always ready to assist with product selection and inquiries.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">💯</div>
              <div>
                <h4 className="font-bold text-lg mb-2">Quality Guarantee</h4>
                <p className="text-sm opacity-90">All products undergo quality checks to ensure they meet our high standards.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-white rounded-xl shadow-lg border p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Work With Us?</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Join hundreds of satisfied customers who trust Polyspack for their agricultural and electronic needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-full hover:shadow-xl transition-all font-semibold text-lg"
            >
              Browse Products
            </Link>
            <Link 
              href="/contact"
              className="bg-white border-2 border-green-600 text-green-600 px-8 py-4 rounded-full hover:bg-green-50 transition-all font-semibold text-lg"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12 mt-12">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase">Need Help?</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/track" className="hover:text-white">Track Your Order</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase">About Polyspack</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/products" className="hover:text-white">Our Products</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>📞 {settings.contactPhone}</li>
                <li>✉️ {settings.contactEmail}</li>
                <li>📍 Nairobi, Kenya</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase">Payment Methods</h4>
              <div className="flex flex-wrap gap-2">
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold text-gray-800">M-PESA</div>
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold text-gray-800">Bank</div>
                <div className="bg-white px-3 py-1 rounded text-xs font-semibold text-gray-800">Cash</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 text-sm">© 2025 Polyspack Enterprises. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
