"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BrandingSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://poly-spak-enterprise-backend-2.onrender.com';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.role !== 'admin') {
      router.push('/admin/login');
      return;
    }
    
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/settings`);
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }

      if (type === 'logo') {
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
      } else {
        setFaviconFile(file);
        setFaviconPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleUpload = async (type) => {
    const file = type === 'logo' ? logoFile : faviconFile;
    if (!file) return;

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch(`${API_BASE_URL}/api/settings/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert(`${type === 'logo' ? 'Logo' : 'Favicon'} uploaded successfully!`);
        fetchSettings();
        if (type === 'logo') {
          setLogoFile(null);
          setLogoPreview(null);
        } else {
          setFaviconFile(null);
          setFaviconPreview(null);
        }
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (type) => {
    if (!confirm(`Are you sure you want to delete the ${type}?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/settings/${type}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert(`${type === 'logo' ? 'Logo' : 'Favicon'} deleted successfully!`);
        fetchSettings();
      } else {
        alert('Failed to delete');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Branding Settings</h1>
        <p className="text-gray-600">Manage your website logo and favicon</p>
      </div>

      {/* Logo Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Website Logo</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Logo */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Current Logo</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center bg-gray-50 h-48">
              {settings?.logo ? (
                <img
                  src={`${API_BASE_URL}${settings.logo}`}
                  alt="Current Logo"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>No logo uploaded</p>
                </div>
              )}
            </div>
            {settings?.logo && (
              <button
                onClick={() => handleDelete('logo')}
                className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold"
              >
                Delete Logo
              </button>
            )}
          </div>

          {/* Upload New Logo */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Upload New Logo</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center bg-gray-50 h-48">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Preview"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p>Select image to preview</p>
                </div>
              )}
            </div>
            <div className="mt-3 space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'logo')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-sm text-gray-600">Max size: 2MB | Recommended: PNG with transparent background</p>
              {logoFile && (
                <button
                  onClick={() => handleUpload('logo')}
                  disabled={uploading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload Logo'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Favicon Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Website Favicon</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Favicon */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Current Favicon</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center bg-gray-50 h-32">
              {settings?.favicon ? (
                <img
                  src={`${API_BASE_URL}${settings.favicon}`}
                  alt="Current Favicon"
                  className="h-16 w-16 object-contain"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <svg className="mx-auto h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">No favicon</p>
                </div>
              )}
            </div>
            {settings?.favicon && (
              <button
                onClick={() => handleDelete('favicon')}
                className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold"
              >
                Delete Favicon
              </button>
            )}
          </div>

          {/* Upload New Favicon */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Upload New Favicon</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center bg-gray-50 h-32">
              {faviconPreview ? (
                <img
                  src={faviconPreview}
                  alt="Preview"
                  className="h-16 w-16 object-contain"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <svg className="mx-auto h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm">Select image</p>
                </div>
              )}
            </div>
            <div className="mt-3 space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'favicon')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-sm text-gray-600">Max size: 2MB | Recommended: 32x32px or 64x64px PNG/ICO</p>
              {faviconFile && (
                <button
                  onClick={() => handleUpload('favicon')}
                  disabled={uploading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload Favicon'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">📝 Branding Guidelines</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Logo: Use PNG format with transparent background for best results</li>
          <li>• Logo: Recommended dimensions: 200-400px width</li>
          <li>• Favicon: Use 32x32px or 64x64px square image</li>
          <li>• Favicon: ICO or PNG format recommended</li>
          <li>• All images must be under 2MB in size</li>
          <li>• Changes will be reflected immediately across the website</li>
        </ul>
      </div>
    </div>
  );
}
