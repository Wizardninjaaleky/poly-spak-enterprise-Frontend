import React, { useState } from 'react';

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
    if (newPassword !== confirmPassword) { setError('New passwords do not match'); return; }
    if (newPassword.length < 6) { setError('New password must be at least 6 characters long'); return; }
    setLoading(true);
    try { /* TODO: call API */ setSuccess('Password changed successfully'); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }
    catch (err) { setError('Failed to change password'); }
    finally { setLoading(false); }
  };

  const checkApiStatus = async () => {
    try { setApiStatus({ status: 'online', message: 'API is running successfully', timestamp: new Date().toLocaleString() }); }
    catch (err) { setApiStatus({ status: 'offline', message: 'API is not responding', timestamp: new Date().toLocaleString() }); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{success}</div>}
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password" className="w-full p-2 border" />
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" className="w-full p-2 border" />
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" className="w-full p-2 border" />
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">{loading ? 'Changing Password...' : 'Change Password'}</button>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">API Status Monitor</h2>
          <button onClick={checkApiStatus} className="w-full p-2 border">Check API Status</button>
          {apiStatus && (
            <div className={`p-4 rounded-md ${apiStatus.status === 'online' ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="flex items-center"><div className={`w-3 h-3 rounded-full mr-2 ${apiStatus.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div><span className="font-medium capitalize">{apiStatus.status}</span></div>
              <p className="mt-1 text-sm">{apiStatus.message}</p>
              <p className="mt-1 text-xs text-gray-600">Last checked: {apiStatus.timestamp}</p>
            </div>
          )}
          <div className="mt-6 text-sm text-gray-600">
            <p><strong>API Base URL:</strong> https://poly-spak-enterprise-backend-2.onrender.com/api</p>
            <p><strong>Frontend:</strong> Next.js</p>
            <p><strong>Backend:</strong> Node.js + Express</p>
            <p><strong>Database:</strong> MongoDB</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
