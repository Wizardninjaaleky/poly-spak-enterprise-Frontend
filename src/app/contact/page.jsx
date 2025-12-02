"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ContactPage() {
  const [settings, setSettings] = useState({
    logo: '',
    contactPhone: '+254 742 312306',
    contactEmail: 'polyspackenterprise@gmail.com'
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Here you would typically send to your backend API
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStatus({
        type: 'success',
        message: 'Thank you for contacting us! We will get back to you within 24 hours.'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Sorry, there was an error sending your message. Please try calling us directly.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
              <Link href="/about" className="text-gray-700 hover:text-green-600 font-medium">About Us</Link>
              <Link href="/contact" className="text-green-600 font-semibold border-b-2 border-green-600">Contact</Link>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-xl opacity-90">We're here to help! Reach out to us with any questions or concerns.</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            
            {status.message && (
              <div className={`mb-6 p-4 rounded-lg ${
                status.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  placeholder="+254 XXX XXX XXX"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Select a subject</option>
                  <option value="product-inquiry">Product Inquiry</option>
                  <option value="bulk-order">Bulk Order / Quotation</option>
                  <option value="delivery">Delivery & Shipping</option>
                  <option value="payment">Payment Issues</option>
                  <option value="technical-support">Technical Support</option>
                  <option value="partnership">Business Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            
            {/* Contact Cards */}
            <div className="bg-white rounded-xl shadow-lg border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">📞</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                    <p className="text-gray-600">{settings.contactPhone}</p>
                    <p className="text-sm text-gray-500 mt-1">Available 24/7</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-3xl">✉️</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600">{settings.contactEmail}</p>
                    <p className="text-sm text-gray-500 mt-1">We reply within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-3xl">📍</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Location</h4>
                    <p className="text-gray-600">Nairobi, Kenya</p>
                    <p className="text-sm text-gray-500 mt-1">Serving all of Kenya</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-3xl">🕐</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Business Hours</h4>
                    <p className="text-gray-600">Open 24/7 for orders</p>
                    <p className="text-sm text-gray-500 mt-1">Support available round the clock</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-sm border p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/products" className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2">
                    <span>→</span> Browse Products
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2">
                    <span>→</span> About Us
                  </Link>
                </li>
                <li>
                  <Link href="/track" className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2">
                    <span>→</span> Track Your Order
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-xl shadow-lg border p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Follow Us</h3>
              <p className="text-gray-600 mb-4 text-sm">Stay updated with our latest products and offers</p>
              <div className="flex gap-4">
                <a href="#" className="text-4xl hover:scale-110 transition-transform">📘</a>
                <a href="#" className="text-4xl hover:scale-110 transition-transform">📷</a>
                <a href="#" className="text-4xl hover:scale-110 transition-transform">🐦</a>
                <a href="#" className="text-4xl hover:scale-110 transition-transform">📞</a>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-sm border p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Methods We Accept</h3>
              <div className="flex flex-wrap gap-3">
                <div className="bg-white px-4 py-2 rounded-lg border-2 border-green-500 font-semibold text-gray-800 flex items-center gap-2">
                  <span>📱</span> M-PESA
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border-2 border-blue-500 font-semibold text-gray-800 flex items-center gap-2">
                  <span>🏦</span> Bank Transfer
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border-2 border-gray-500 font-semibold text-gray-800 flex items-center gap-2">
                  <span>💵</span> Cash on Delivery
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-16 bg-white rounded-xl shadow-lg border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">How long does delivery take?</h4>
              <p className="text-gray-600 text-sm">Delivery typically takes 1-3 business days within Nairobi and 3-7 days for upcountry locations, depending on your area.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Do you offer bulk discounts?</h4>
              <p className="text-gray-600 text-sm">Yes! We offer competitive discounts for bulk orders. Contact us with your requirements for a custom quotation.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-600 text-sm">We accept M-PESA, bank transfers, and cash on delivery for your convenience.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Can I return a product?</h4>
              <p className="text-gray-600 text-sm">Yes, we have a return policy for defective products. Contact us within 7 days of delivery for assistance.</p>
            </div>
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
