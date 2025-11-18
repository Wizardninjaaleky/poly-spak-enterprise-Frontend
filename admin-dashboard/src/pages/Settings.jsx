import React, { useState } from 'react';
import { KeyIcon, ServerIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [apiStatus, setApiStatus] = useState(null);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await api.put('/admin/change-password', {
        currentPassword,
        newPassword,
      });

      setSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const checkApiStatus = async () => {
    try {
      const response = await api.get('/health');
      setApiStatus({
        status: 'online',
        message: 'API is running successfully',
        timestamp: new Date().toLocaleString(),
      });
    } catch (err) {
      setApiStatus({
        status: 'offline',
        message: 'API is not responding',
        timestamp: new Date().toLocaleString(),
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Change Password */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <KeyIcon className="h-6 w-6 text-gray-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* API Status */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <ServerIcon className="h-6 w-6 text-gray-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">API Status Monitor</h2>
          </div>

          <div className="space-y-4">
            <button
              onClick={checkApiStatus}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Check API Status
            </button>

            {apiStatus && (
              <div className={`p-4 rounded-md ${
                apiStatus.status === 'online'
                  ? 'bg-green-100 border border-green-400 text-green-700'
                  : 'bg-red-100 border border-red-400 text-red-700'
              }`}>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    apiStatus.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="font-medium capitalize">{apiStatus.status}</span>
                </div>
                <p className="mt-1 text-sm">{apiStatus.message}</p>
                <p className="mt-1 text-xs text-gray-600">
                  Last checked: {apiStatus.timestamp}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">System Information</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>API Base URL:</strong> https://poly-spak-enterprise-backend-2.onrender.com/api</p>
              <p><strong>Frontend:</strong> React + Vite</p>
              <p><strong>Backend:</strong> Node.js + Express</p>
              <p><strong>Database:</strong> MongoDB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
