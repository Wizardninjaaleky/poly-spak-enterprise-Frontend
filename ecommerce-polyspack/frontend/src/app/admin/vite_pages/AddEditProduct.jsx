import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Adapted from Vite app - using Next.js client navigation

const AddEditProduct = ({ params }) => {
  const id = params?.id;
  const router = useRouter();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    if (isEditing) {
      // TODO: fetch product by id using frontend API service
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    setLoading(true);

    try {
      // Minimal placeholder: append local object URLs until backend upload is wired
      const urls = files.map(f => URL.createObjectURL(f));
      setImageUrls(prev => [...prev, ...urls]);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err) {
      setError('Failed to upload images');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImages);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const productData = { ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock), images: imageUrls };
      // TODO: call API endpoints
      router.push('/admin');
    } catch (err) {
      setError('Failed to save product');
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name *</label>
            <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category *</label>
            <input type="text" id="category" name="category" required value={formData.category} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
          <textarea id="description" name="description" required rows={4} value={formData.description} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price *</label>
            <input type="number" id="price" name="price" required min="0" step="0.01" value={formData.price} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock *</label>
            <input type="number" id="stock" name="stock" required min="0" value={formData.stock} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-500" />
          {loading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}

          {imageUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img src={url} alt={`Product ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => router.push('/admin')} className="px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md">{loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}</button>
        </div>
      </form>
    </div>
  );
};

export default AddEditProduct;
