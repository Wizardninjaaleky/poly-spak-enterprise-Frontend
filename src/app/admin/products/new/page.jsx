'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '@/config/api';

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    weight: '',
    dimensions: '',
    specifications: '',
    images: [],
  });

  const getCategoryInfo = (category) => {
    const categories = {
      'Seedling Bags': { icon: '🌱', color: 'green', description: 'Agricultural seedling bags' },
      'Services': { icon: '🛠️', color: 'blue', description: 'Service offerings' },
      'Electronics': { icon: '⚡', color: 'purple', description: 'Electronic products' },
      'Packaging': { icon: '📦', color: 'orange', description: 'Packaging materials' },
      'Fertilizers': { icon: '🌾', color: 'emerald', description: 'Agricultural fertilizers' },
      'Agricultural': { icon: '🚜', color: 'lime', description: 'Agricultural equipment' },
      'Industrial': { icon: '🏭', color: 'gray', description: 'Industrial supplies' },
    };
    return categories[category] || { icon: '📌', color: 'gray', description: '' };
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setUploadedImages(previews);
  };

  const handleUploadImages = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select images to upload');
      return;
    }

    setIsUploading(true);
    setError('');

    const token = localStorage.getItem('token');
    const formDataUpload = new FormData();

    selectedFiles.forEach(file => {
      formDataUpload.append('images', file);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/products/upload-images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataUpload,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData({ ...formData, images: data.images });
        alert(`${data.count} image(s) uploaded successfully!`);
      } else {
        setError(data.message || 'Failed to upload images');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      setError('An error occurred while uploading images');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (formData.images.length === 0) {
      setError('Please upload at least one product image');
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
      };

      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/products');
      } else {
        setError(data.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      setError('An error occurred while creating the product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeUploadedImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/products"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-1">Create a new product in your catalog</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  placeholder="e.g., Polypropylene Woven Bags"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  placeholder="Describe the product, its features, and uses..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  >
                    <option value="">Select a category</option>
                    <option value="Seedling Bags">🌱 Seedling Bags</option>
                    <option value="Services">🛠️ Services</option>
                    <option value="Electronics">⚡ Electronics</option>
                    <option value="Packaging">📦 Packaging</option>
                    <option value="Fertilizers">🌾 Fertilizers</option>
                    <option value="Agricultural">🚜 Agricultural</option>
                    <option value="Industrial">🏭 Industrial</option>
                  </select>
                  {formData.category && (
                    <div className={`mt-3 p-3 rounded-lg bg-${getCategoryInfo(formData.category).color}-50 border border-${getCategoryInfo(formData.category).color}-200`}>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getCategoryInfo(formData.category).icon}</span>
                        <div>
                          <p className={`font-semibold text-${getCategoryInfo(formData.category).color}-900`}>
                            {formData.category}
                          </p>
                          <p className={`text-xs text-${getCategoryInfo(formData.category).color}-700`}>
                            {getCategoryInfo(formData.category).description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (KES) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight
                  </label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                    placeholder="e.g., 50kg, 25kg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions
                </label>
                <input
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  placeholder="e.g., 60cm x 40cm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specifications
                </label>
                <textarea
                  rows={3}
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  placeholder="Technical specifications, materials, certifications, etc."
                />
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Images</h2>
            
            {/* File Upload Section */}
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
              <div className="text-center">
                <div className="text-4xl mb-3">📸</div>
                <label htmlFor="image-upload" className="cursor-pointer">
                  <span className="text-green-600 font-semibold hover:text-green-700">
                    Choose images from your device
                  </span>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG, GIF, WEBP (Max 5MB per image, up to 10 images)
                </p>
              </div>

              {/* Preview Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {selectedFiles.length} file(s) selected
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {uploadedImages.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleUploadImages}
                    disabled={isUploading}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isUploading ? 'Uploading...' : '⬆️ Upload Images to Server'}
                  </button>
                </div>
              )}
            </div>

            {/* Show Uploaded Images */}
            {formData.images.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-3">✅ Uploaded Images ({formData.images.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {formData.images.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded border-2 border-green-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeUploadedImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Link
              href="/admin/products"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
