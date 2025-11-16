import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Polyspack Enterprises',
  description: 'Learn about how Polyspack Enterprises protects your privacy and handles your personal information.',
};

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose max-w-none">
        <p className="mb-4">At Polyspack Enterprises, we are committed to protecting your privacy and ensuring the security of your personal information. This privacy policy explains how we collect, use, and safeguard your information.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
        <p className="mb-4">We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include your name, email address, phone number, shipping address, and payment information.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>To process and fulfill your orders</li>
          <li>To communicate with you about your orders and our services</li>
          <li>To provide customer support</li>
          <li>To send you marketing communications (with your consent)</li>
          <li>To improve our website and services</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-3">3. Information Sharing</h2>
        <p className="mb-4">We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with trusted third parties who assist us in operating our website, conducting our business, or servicing you.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">4. Data Security</h2>
        <p className="mb-4">We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">5. Cookies</h2>
        <p className="mb-4">We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">6. Your Rights</h2>
        <p className="mb-4">You have the right to access, update, or delete your personal information. You may also opt out of marketing communications at any time.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">7. Children&apos;s Privacy</h2>
        <p className="mb-4">Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">8. Changes to This Policy</h2>
        <p className="mb-4">We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">9. Contact Us</h2>
        <p className="mb-4">If you have any questions about this privacy policy, please contact us at privacy@polyspackenterprises.co.ke</p>
      </div>
    </div>
  );
}
