import React from 'react';
import Link from 'next/link';

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Unauthorized</h1>
      <p className="text-gray-600 mb-8">You don't have permission to access this page. Please contact an administrator.</p>
      <Link href="/admin/vite_pages/Login" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md">Go to Login</Link>
    </div>
  </div>
);

export default Unauthorized;
