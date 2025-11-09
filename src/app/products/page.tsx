'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  salePrice?: number;
  images: string[];
  sku: string;
  stockQty: number;
  attributes: Record<string, string | number | boolean | undefined>;
  description?: string;
}

const ProductsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || 'all');
  const [sortBy, setSortBy] = useState('name');

  // Mock data - replace with API call
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        title: 'Premium Seedling Bags - 100 Pack',
        slug: 'premium-seedling-bags-100-pack',
        category: 'Seedling Bags',
        price: 2500,
        salePrice: 2200,
        images: ['/placeholder-seedling.jpg'],
        sku: 'SB-100-PREM',
        stockQty: 50,
        attributes: { size: 'Medium', material: 'Biodegradable' },
        description: 'High-quality seedling bags perfect for nursery operations.'
      },
      {
        id: '2',
        title: 'Solar-Powered LED Light',
        slug: 'solar-powered-led-light',
        category: 'Electronics',
        price: 1500,
        images: ['/placeholder-electronics.jpg'],
        sku: 'EL-SOLAR-LED',
        stockQty: 25,
        attributes: { power: '5W', battery: '2000mAh' },
        description: 'Energy-efficient solar powered LED lighting solution.'
      },
      {
        id: '3',
        title: 'Agricultural Consulting Service',
        slug: 'agricultural-consulting-service',
        category: 'Services',
        price: 5000,
        images: ['/placeholder-service.jpg'],
        sku: 'SVC-AGRI-CONSULT',
        stockQty: 10,
        attributes: { duration: 'Full Day', type: 'On-site' },
        description: 'Expert agricultural consulting for optimal farm management.'
      },
      {
        id: '4',
        title: 'Biodegradable Seedling Trays',
        slug: 'biodegradable-seedling-trays',
        category: 'Seedling Bags',
        price: 1800,
        images: ['/placeholder-seedling.jpg'],
        sku: 'SB-TRAY-BIO',
        stockQty: 30,
        attributes: { size: 'Large', material: 'Biodegradable' },
        description: 'Eco-friendly seedling trays for sustainable farming.'
      },
      {
        id: '5',
        title: 'Wireless Weather Station',
        slug: 'wireless-weather-station',
        category: 'Electronics',
        price: 3500,
        salePrice: 3200,
        images: ['/placeholder-electronics.jpg'],
        sku: 'EL-WEATHER-STN',
        stockQty: 15,
        attributes: { range: '100m', sensors: 'Temperature, Humidity' },
        description: 'Complete weather monitoring solution for farms.'
      },
      {
        id: '6',
        title: 'Farm Equipment Maintenance Service',
        slug: 'farm-equipment-maintenance-service',
        category: 'Services',
        price: 7500,
        images: ['/placeholder-service.jpg'],
        sku: 'SVC-EQUIP-MAINT',
        stockQty: 5,
        attributes: { duration: 'Half Day', type: 'On-site' },
        description: 'Professional maintenance and repair services for farm equipment.'
      }
    ];

    setProducts(mockProducts);
    setLoading(false);
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = products;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.title.localeCompare(b.title);
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm, sortBy]);

  const categories = ['all', 'Seedling Bags', 'Electronics', 'Services'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="mt-2 text-gray-600">
                Discover our wide range of products and services
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                href="/products"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                View All Products
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Products
                </label>
                <input
                  type="text"
                  placeholder="Search by name, description, or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                {selectedCategory !== 'all' && ` in ${selectedCategory}`}
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-5.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
