import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import api from '../api/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalProducts: 0, products: [] });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/api/products/summary');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <div>
      <NavBar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link to="/products" className="bg-blue-600 text-white px-3 py-1 rounded">Manage Products</Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-sm">Total Products</h3>
            <div className="text-3xl">{stats.totalProducts}</div>
          </div>
          <div className="bg-white p-4 rounded shadow col-span-2">
            <h3 className="text-sm">Products Trend</h3>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <LineChart data={stats.products || []}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
