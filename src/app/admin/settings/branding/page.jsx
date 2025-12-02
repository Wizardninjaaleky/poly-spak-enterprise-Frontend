"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BrandingSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [heroBannerFile, setHeroBannerFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);
  const [heroBannerPreview, setHeroBannerPreview] = useState(null);
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
      const maxSize = type === 'heroBanner' ? 5 * 1024 * 1024 : 2 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`File size must be less than ${type === 'heroBanner' ? '5MB' : '2MB'}`);
        return;
      }

      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        if (type === 'logo') {
          setLogoFile(file);
          setLogoPreview(base64String);
        } else if (type === 'heroBanner') {
          setHeroBannerFile(file);
          setHeroBannerPreview(base64String);
        } else {
          setFaviconFile(file);
          setFaviconPreview(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (type) => {
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      
      let base64Data;
      if (type === 'logo' && logoPreview) {
        base64Data = logoPreview;
      } else if (type === 'favicon' && faviconPreview) {
        base64Data = faviconPreview;
      } else if (type === 'heroBanner' && heroBannerPreview) {
        base64Data = heroBannerPreview;
      } else {
        alert('Please select a file first');
        setUploading(false);
        return;
      }
      
      // Update settings with base64 image
      const updateData = {};
      updateData[type] = base64Data;

      const response = await fetch(`${API_BASE_URL}/api/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        const typeName = type === 'logo' ? 'Logo' : type === 'favicon' ? 'Favicon' : 'Hero Banner';
        alert(`${typeName} uploaded successfully!`);
        fetchSettings();
        
        // Clear file states
        if (type === 'logo') {
          setLogoFile(null);
          setLogoPreview(null);
        } else if (type === 'favicon') {
          setFaviconFile(null);
          setFaviconPreview(null);
        } else {
          setHeroBannerFile(null);
          setHeroBannerPreview(null);
        }
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Branding Settings</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your website logo and favicon</p>
            </div>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Settings Navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <nav className="flex border-b">
            <Link
              href="/admin/settings"
              className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              General Settings
            </Link>
            <Link
              href="/admin/settings/branding"
              className="px-6 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600"
            >
              Branding
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

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

      {/* Hero Banner Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Homepage Hero Banner</h2>
        <p className="text-sm text-gray-600 mb-4">Upload a banner image for the agriculture/farming section (Alibaba-style hero)</p>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Current Banner */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Current Hero Banner</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center bg-gray-50 h-64">
              {settings?.heroBanner ? (
                <img
                  src={settings.heroBanner}
                  alt="Current Hero Banner"
                  className="max-h-full max-w-full object-cover rounded"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <svg className="mx-auto h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>No hero banner uploaded</p>
                </div>
              )}
            </div>
            {settings?.heroBanner && (
              <button
                onClick={() => handleDelete('heroBanner')}
                className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold"
              >
                Delete Hero Banner
              </button>
            )}
          </div>

          {/* Upload New Banner */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Upload New Hero Banner</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center bg-gray-50 h-64">
              {heroBannerPreview ? (
                <img
                  src={heroBannerPreview}
                  alt="Preview"
                  className="max-h-full max-w-full object-cover rounded"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <svg className="mx-auto h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p>Select image to preview</p>
                  <p className="text-xs mt-1">Recommended: 1920x600px landscape</p>
                </div>
              )}
            </div>
            <div className="mt-3 space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'heroBanner')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
              <p className="text-sm text-gray-600">Max size: 5MB | Recommended: 1920x600px JPG/PNG (agriculture/farming scene)</p>
              {heroBannerFile && (
                <button
                  onClick={() => handleUpload('heroBanner')}
                  disabled={uploading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Save Hero Banner'}
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
            <li>• Hero Banner: Use 1920x600px landscape image (agriculture/farming theme)</li>
            <li>• Logo/Favicon: Max 2MB | Hero Banner: Max 5MB</li>
            <li>• Changes will be reflected immediately across the website</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
