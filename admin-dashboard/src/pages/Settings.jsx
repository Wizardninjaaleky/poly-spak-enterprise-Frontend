import React from 'react';
import NavBar from '../components/NavBar';

export default function Settings() {
  return (
    <div>
      <NavBar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center text-gray-500">
            <i className="fas fa-cog text-4xl mb-4 text-gray-300"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Panel</h3>
            <p>Settings functionality is coming soon. This will include:</p>
            <ul className="mt-4 text-left max-w-md mx-auto space-y-2">
              <li className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-2"></i>
                Website configuration
              </li>
              <li className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-2"></i>
                Email settings
              </li>
              <li className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-2"></i>
                Payment gateway configuration
              </li>
              <li className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-2"></i>
                User permissions
              </li>
              <li className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-2"></i>
                System maintenance
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
