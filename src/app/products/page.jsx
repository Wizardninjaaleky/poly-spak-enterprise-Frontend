"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProducts();
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    
    // Set search term from URL if present
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
    
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://poly-spak-enterprise-backend-2.onrender.com/api/products');
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      setProducts(data.data || data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const newCart = [...cart];
    const existingItem = newCart.find(item => item._id === product._id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      newCart.push({ ...product, quantity: 1 });
    }
    
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    alert('Added to cart!');
  };

  let filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    let matchesPrice = true;
    if (priceRange === 'under1000') matchesPrice = product.price < 1000;
    if (priceRange === '1000-5000') matchesPrice = product.price >= 1000 && product.price <= 5000;
    if (priceRange === 'over5000') matchesPrice = product.price > 5000;
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sorting
  if (sortBy === 'price-low') filteredProducts.sort((a, b) => a.price - b.price);
  if (sortBy === 'price-high') filteredProducts.sort((a, b) => b.price - a.price);
  if (sortBy === 'name') filteredProducts.sort((a, b) => a.name.localeCompare(b.name));

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-green-700 text-white text-xs py-2">
        <div className="max-w-[1600px] mx-auto px-6 flex justify-between items-center">
          <span>📞 Call: +254 742 312306</span>
          <span>🚚 Delivery Done Countrywide</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="text-2xl font-bold text-green-700 whitespace-nowrap">
              Polyspack
            </Link>

            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button className="absolute right-0 top-0 h-full px-6 bg-green-600 text-white rounded-r-lg hover:bg-green-700">
                  🔍
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-green-700 font-semibold">
                      Welcome, {user.firstName || user.name || user.email}! 👋
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      localStorage.removeItem('userData');
                      setUser(null);
                      router.push('/login');
                    }}
                    className="hidden md:inline-block px-4 py-2 text-red-600 hover:text-red-700 font-semibold border border-red-600 rounded-lg hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="hidden md:inline-block px-4 py-2 text-green-600 hover:text-green-700 font-semibold border border-green-600 rounded-lg hover:bg-green-50 transition">
                    Login
                  </Link>
                  <Link href="/register" className="hidden md:inline-block px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                    Sign Up
                  </Link>
                </>
              )}
              <Link href="/profile" className="flex items-center gap-2 text-gray-700 hover:text-green-600">
                <span className="text-2xl">👤</span>
                <div className="hidden lg:block text-sm">
                  <div className="font-semibold">{user ? 'Profile' : 'Account'}</div>
                </div>
              </Link>
              <Link href="/cart" className="flex items-center gap-2 text-gray-700 hover:text-green-600 relative">
                <span className="text-2xl">🛒</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
                <div className="hidden md:block text-sm">
                  <div className="font-semibold">Cart ({cart.length})</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-[1600px] mx-auto px-6 py-3">
          <div className="text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-semibold">Products</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Filters</h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="mr-2 text-green-600"
                      />
                      <span className="text-sm text-gray-700">
                        {cat === 'all' ? 'All Products' : cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === 'all'}
                      onChange={() => setPriceRange('all')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">All Prices</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === 'under1000'}
                      onChange={() => setPriceRange('under1000')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Under KSh 1,000</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === '1000-5000'}
                      onChange={() => setPriceRange('1000-5000')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">KSh 1,000 - 5,000</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === 'over5000'}
                      onChange={() => setPriceRange('over5000')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Over KSh 5,000</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="bg-white rounded-lg p-4 mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products found
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <div className="text-4xl mb-4">⏳</div>
                <div className="text-gray-600">Loading products...</div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setPriceRange('all');
                  }}
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition border group">
                    <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex items-center justify-center">
                      {product.images?.[0] ? (
                        <>
                          <Image
                            src={product.images[0].startsWith('http') ? product.images[0] : `https://poly-spak-enterprise-backend-2.onrender.com${product.images[0]}`}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition duration-300"
                            unoptimized
                          />
                        </>
                      ) : null}
                      {/* Always show product icon as fallback/overlay */}
                      <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20 pointer-events-none">
                        {product.name.toLowerCase().includes('solar') ? '☀️' : 
                         product.name.toLowerCase().includes('jump') ? '🔋' :
                         product.name.toLowerCase().includes('shaver') || product.name.toLowerCase().includes('trimmer') ? '✂️' :
                         product.name.toLowerCase().includes('blood') || product.name.toLowerCase().includes('medical') ? '🩺' :
                         product.name.toLowerCase().includes('bag') ? '🎒' :
                         product.name.toLowerCase().includes('shade') ? '🌿' :
                         product.name.toLowerCase().includes('garbage') ? '🗑️' :
                         product.name.toLowerCase().includes('dumbbell') ? '💪' :
                         '📦'}
                      </div>
                      {product.stock < 20 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          Low Stock
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm h-10">
                        {product.name}
                      </h3>
                      <div className="text-xl font-bold text-gray-900 mb-3">
                        KSh {product.price?.toLocaleString()}
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold text-sm transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
