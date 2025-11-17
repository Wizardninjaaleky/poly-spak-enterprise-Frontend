import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import api from '../api/api';

export default function AddEditProduct() {
  const { id } = useParams();
  const edit = Boolean(id);
  const [form, setForm] = useState({ name:'', description:'', price:0, quantity:0, category:'', imageUrl:'', available:true });
  const navigate = useNavigate();

  useEffect(() => {
    if (!edit) return;
    (async () => {
      try {
        const res = await api.get(`/api/products/${id}`);
        setForm(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load product');
      }
    })();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (edit) {
        await api.put(`/api/products/${id}`, form);
      } else {
        await api.post('/api/products', form);
      }
      navigate('/products');
    } catch (err) {
      console.error(err);
      alert('Save failed');
    }
  };

  return (
    <div>
      <NavBar />
      <div className="p-6">
        <h1 className="text-2xl mb-4">{edit ? 'Edit' : 'Add'} Product</h1>
        <form onSubmit={submit} className="bg-white p-6 rounded shadow max-w-xl">
          <label className="block mb-2">Name</label>
          <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="w-full p-2 border mb-3" required />
          <label className="block mb-2">Description</label>
          <textarea value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} className="w-full p-2 border mb-3" />
          <label className="block mb-2">Category</label>
          <input value={form.category} onChange={(e)=>setForm({...form, category:e.target.value})} className="w-full p-2 border mb-3" />
          <div className="grid grid-cols-3 gap-3 mb-3">
            <input type="number" value={form.price} onChange={(e)=>setForm({...form, price:parseFloat(e.target.value)})} placeholder="Price" className="p-2 border" />
            <input type="number" value={form.quantity} onChange={(e)=>setForm({...form, quantity:parseInt(e.target.value)})} placeholder="Quantity" className="p-2 border" />
            <select value={form.available} onChange={(e)=>setForm({...form, available: e.target.value === 'true'})} className="p-2 border">
              <option value="true">Available</option>
              <option value="false">Not available</option>
            </select>
          </div>
          <label className="block mb-2">Image URL</label>
          <input value={form.imageUrl} onChange={(e)=>setForm({...form, imageUrl:e.target.value})} className="w-full p-2 border mb-3" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">{edit ? 'Update' : 'Create'}</button>
        </form>
      </div>
    </div>
  );
}
