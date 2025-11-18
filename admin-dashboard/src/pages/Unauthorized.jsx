import React from 'react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Unauthorized</h1>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this page. Please contact an administrator.
        </p>
        <a
          href="/login"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
};

export default Unauthorized;
