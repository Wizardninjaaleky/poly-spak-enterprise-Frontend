'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSlidesManagementPage() {
  const router = useRouter();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [newSlide, setNewSlide] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    buttonText: 'Shop Now',
    buttonLink: '/products',
    order: 1,
    isActive: true
  });

  useEffect(() => {
    checkAuth();
    fetchSlides();
  }, []);

  const checkAuth = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      router.push('/admin/login');
    }
  };

  const fetchSlides = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/hero-slides');
      const data = await response.json();
      if (data.success) {
        setSlides(data.slides || []);
      }
    } catch (error) {
      console.error('Error fetching slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlide = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/hero-slides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newSlide)
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Slide added successfully!' });
        setNewSlide({
          title: '',
          subtitle: '',
          imageUrl: '',
          buttonText: 'Shop Now',
          buttonLink: '/products',
          order: slides.length + 1,
          isActive: true
        });
        fetchSlides();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to add slide' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error adding slide' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlide = async (slideId) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/hero-slides/${slideId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Slide deleted successfully!' });
        fetchSlides();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to delete slide' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting slide' });
    }
  };

  const handleToggleActive = async (slideId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/hero-slides/${slideId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Slide status updated!' });
        fetchSlides();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating slide' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Hero Slides Management</h1>
          <p className="text-gray-600 mt-2">Manage carousel slides for the homepage</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Add New Slide Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Slide</h2>
          <form onSubmit={handleAddSlide} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={newSlide.title}
                  onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="e.g., Quality Products & Services"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle *
                </label>
                <input
                  type="text"
                  required
                  value={newSlide.subtitle}
                  onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="e.g., Seedling bags, electronics, and more"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL *
              </label>
              <input
                type="url"
                required
                value={newSlide.imageUrl}
                onChange={(e) => setNewSlide({ ...newSlide, imageUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 1920x600px, Max size: 2MB
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  value={newSlide.buttonText}
                  onChange={(e) => setNewSlide({ ...newSlide, buttonText: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Link
                </label>
                <input
                  type="text"
                  value={newSlide.buttonLink}
                  onChange={(e) => setNewSlide({ ...newSlide, buttonLink: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={newSlide.order}
                  onChange={(e) => setNewSlide({ ...newSlide, order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={newSlide.isActive}
                onChange={(e) => setNewSlide({ ...newSlide, isActive: e.target.checked })}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Active (show on homepage)
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {saving ? 'Adding...' : 'Add Slide'}
            </button>
          </form>
        </div>

        {/* Existing Slides */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Existing Slides ({slides.length})</h2>
          
          {slides.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No slides yet. Add your first slide above!</p>
          ) : (
            <div className="space-y-4">
              {slides.map((slide) => (
                <div key={slide._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    {/* Image Preview */}
                    <div className="flex-shrink-0 w-48 h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={slide.imageUrl}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder.png';
                          e.target.alt = 'Image not found';
                        }}
                      />
                    </div>

                    {/* Slide Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{slide.title}</h3>
                          <p className="text-gray-600 text-sm">{slide.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            slide.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {slide.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            Order: {slide.order}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-500 mb-3">
                        <span className="mr-4">Button: {slide.buttonText}</span>
                        <span>Link: {slide.buttonLink}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleActive(slide._id, slide.isActive)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                            slide.isActive 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {slide.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteSlide(slide._id)}
                          className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
