'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Categories() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', icon: '' });

  const defaultCategories = [
    { 
      name: 'Seedling Bags', 
      icon: '🌱', 
      description: 'Agricultural seedling bags for nurseries',
      productCount: 8,
      color: 'green'
    },
    { 
      name: 'Electronics', 
      icon: '⚡', 
      description: 'Electronic products and devices',
      productCount: 7,
      color: 'blue'
    },
    { 
      name: 'Services', 
      icon: '🛠️', 
      description: 'Professional services offered',
      productCount: 0,
      color: 'purple'
    },
    { 
      name: 'Agricultural', 
      icon: '🚜', 
      description: 'Agricultural equipment and supplies',
      productCount: 3,
      color: 'lime'
    },
    { 
      name: 'Packaging', 
      icon: '📦', 
      description: 'Packaging materials and bags',
      productCount: 3,
      color: 'orange'
    },
    { 
      name: 'Solar & Lighting', 
      icon: '☀️', 
      description: 'Solar products and lighting solutions',
      productCount: 5,
      color: 'yellow'
    },
    { 
      name: 'Automotive', 
      icon: '🚗', 
      description: 'Automotive accessories and tools',
      productCount: 2,
      color: 'red'
    },
    { 
      name: 'Health & Medical', 
      icon: '⚕️', 
      description: 'Health and medical equipment',
      productCount: 1,
      color: 'pink'
    },
    { 
      name: 'Personal Care & Grooming', 
      icon: '💇', 
      description: 'Personal care products',
      productCount: 1,
      color: 'indigo'
    },
    { 
      name: 'Fertilizers', 
      icon: '🌾', 
      description: 'Agricultural fertilizers',
      productCount: 0,
      color: 'emerald'
    },
    { 
      name: 'Industrial', 
      icon: '🏭', 
      description: 'Industrial supplies and equipment',
      productCount: 0,
      color: 'gray'
    }
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://poly-spak-enterprise-backend-2.onrender.com';
      
      const response = await fetch(`${API_URL}/api/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || data || defaultCategories);
      } else {
        setCategories(defaultCategories);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(defaultCategories);
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://poly-spak-enterprise-backend-2.onrender.com';
    
    try {
      const response = await fetch(`${API_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCategory)
      });
      
      if (response.ok) {
        fetchCategories();
        setShowAddModal(false);
        setNewCategory({ name: '', description: '', icon: '' });
        alert('Category added successfully!');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Manage product categories</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
        >
          + Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 rounded-lg bg-${category.color}-100 flex items-center justify-center text-3xl`}>
                {category.icon}
              </div>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                {category.productCount || 0} products
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{category.description}</p>
            <div className="flex gap-2">
              <button 
                onClick={() => router.push(`/admin/products?category=${encodeURIComponent(category.name)}`)}
                className="flex-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors font-medium text-sm"
              >
                View Products
              </button>
              <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors font-medium text-sm">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Category</h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Home & Garden"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon (emoji)
                </label>
                <input
                  type="text"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="🏡"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Brief description of this category..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                >
                  Add Category
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
