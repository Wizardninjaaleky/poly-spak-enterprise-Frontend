'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CustomSolutionsSuccessPage() {
  const searchParams = useSearchParams();
  const quoteId = searchParams.get('id');
  const [quoteDetails, setQuoteDetails] = useState(null);

  useEffect(() => {
    // Optional: Fetch quote details for display
    if (quoteId) {
      // You could fetch basic quote info here
      setQuoteDetails({ id: quoteId });
    }
  }, [quoteId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-12 text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-6"
          >
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Quote Request Received!
          </h1>

          {/* Quote ID */}
          {quoteId && (
            <div className="inline-block mb-6 px-6 py-2 bg-blue-100 rounded-full">
              <span className="text-sm font-medium text-blue-800">
                Reference ID: <span className="font-mono">{quoteId}</span>
              </span>
            </div>
          )}

          {/* Success Message */}
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Thank you for your custom solutions request! Our packaging specialists are
            reviewing your requirements and will send you a detailed quote within{' '}
            <strong>24 hours</strong>.
          </p>

          {/* What Happens Next */}
          <div className="bg-gray-50 rounded-lg p-8 mb-8 text-left">
            <h2 className="text-2xl font-bold mb-6 text-center">What Happens Next?</h2>
            
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email Confirmation (Immediate)</h3>
                  <p className="text-gray-600">
                    You'll receive a confirmation email with your request details and reference
                    ID. Check your inbox (and spam folder).
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Expert Review (Within 2 Hours)</h3>
                  <p className="text-gray-600">
                    Our technical team will analyze your specifications and technical drawings
                    to understand your unique needs.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Detailed Quote (Within 24 Hours)</h3>
                  <p className="text-gray-600">
                    You'll receive a comprehensive quote including pricing, timeline, technical
                    specifications, and next steps.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Consultation Call (Optional)</h3>
                  <p className="text-gray-600">
                    We'll schedule a call to discuss the quote, answer questions, and refine
                    the design if needed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-lg mb-2">Need Immediate Assistance?</h3>
            <p className="text-gray-700 mb-4">
              Our sales team is available during business hours
            </p>
            <div className="space-y-2">
              <a
                href="tel:+254700000000"
                className="flex items-center justify-center text-blue-600 font-semibold hover:text-blue-700"
              >
                <span className="text-2xl mr-2">📞</span>
                +254 700 000 000
              </a>
              <a
                href="mailto:sales@polyspackenterprises.co.ke"
                className="flex items-center justify-center text-blue-600 font-semibold hover:text-blue-700"
              >
                <span className="text-2xl mr-2">✉️</span>
                sales@polyspackenterprises.co.ke
              </a>
              <a
                href="https://wa.me/254700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center text-blue-600 font-semibold hover:text-blue-700"
              >
                <span className="text-2xl mr-2">💬</span>
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/products"
              className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition shadow-lg"
            >
              Browse Our Products
            </Link>
            
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/about"
                className="block border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Learn About Us
              </Link>
              <Link
                href="/blog"
                className="block border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Read Our Blog
              </Link>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              Join 500+ satisfied businesses who trust Polyspack
            </p>
            <div className="flex justify-center items-center space-x-8 opacity-70">
              <div className="text-xs text-gray-500">KEBS Certified</div>
              <div className="text-xs text-gray-500">ISO 9001:2015</div>
              <div className="text-xs text-gray-500">Made in Kenya</div>
            </div>
          </div>
        </motion.div>

        {/* Additional Resources */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Link
            href="/case-studies"
            className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition"
          >
            <div className="text-3xl mb-2">📊</div>
            <div className="font-semibold mb-1">Case Studies</div>
            <div className="text-sm text-gray-600">See how we've helped others</div>
          </Link>

          <Link
            href="/resources"
            className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition"
          >
            <div className="text-3xl mb-2">📥</div>
            <div className="font-semibold mb-1">Download Resources</div>
            <div className="text-sm text-gray-600">Product catalogs and guides</div>
          </Link>

          <Link
            href="/factory-tour"
            className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition"
          >
            <div className="text-3xl mb-2">🏭</div>
            <div className="font-semibold mb-1">Virtual Tour</div>
            <div className="text-sm text-gray-600">See our manufacturing process</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
