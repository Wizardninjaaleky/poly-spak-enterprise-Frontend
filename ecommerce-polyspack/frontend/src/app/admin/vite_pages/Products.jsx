import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { setLoading(false); }, []);

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    // TODO: delete via API
    setProducts(prev => prev.filter(p => p._id !== productId));
  };

  const filteredProducts = products.filter(product => (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (product.category || '').toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <Link href="/admin/vite_pages/AddEditProduct" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md">+ Add Product</Link>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product._id}>
                <td>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10"><img className="h-10 w-10 rounded-full object-cover" src={product.images?.[0] || '/placeholder-product.jpg'} alt={product.name} /></div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                    </div>
                  </div>
                </td>
                <td><span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{product.category}</span></td>
                <td className="text-sm text-gray-900">${product.price}</td>
                <td><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{product.stock}</span></td>
                <td className="text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link href={`/admin/vite_pages/Products/${product._id}`} className="text-blue-600">View</Link>
                    <Link href={`/admin/vite_pages/AddEditProduct?id=${product._id}`} className="text-indigo-600">Edit</Link>
                    <button onClick={() => handleDelete(product._id)} className="text-red-600">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && !loading && <div className="text-center py-12"><p className="text-gray-500">No products found.</p></div>}
    </div>
  );
};

export default Products;
