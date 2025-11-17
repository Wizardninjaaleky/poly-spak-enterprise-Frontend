import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import api from '../api/api';
import { Link } from 'react-router-dom';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get('/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/api/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) { console.error(err); }
  };

  const toggle = async (p) => {
    try {
      await api.put(`/api/products/${p._id}`, { available: !p.available });
      load();
    } catch (err) { console.error(err); }
  };

  if (loading) return <div><NavBar /><div className="p-6">Loading...</div></div>;

  return (
    <div>
      <NavBar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Products</h1>
          <Link to="/products/new" className="bg-green-600 text-white px-3 py-1 rounded">Add Product</Link>
        </div>

        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Category</th>
              <th className="p-2">Price</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Available</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} className="border-b">
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.category}</td>
                <td className="p-2">{p.price}</td>
                <td className="p-2">{p.quantity}</td>
                <td className="p-2">
                  <button onClick={() => toggle(p)} className={`px-3 py-1 rounded ${p.available ? 'bg-green-200' : 'bg-red-200'}`}>
                    {p.available ? 'Yes' : 'No'}
                  </button>
                </td>
                <td className="p-2">
                  <Link to={`/products/${p._id}`} className="mr-2 text-blue-600">Edit</Link>
                  <button onClick={() => remove(p._id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
