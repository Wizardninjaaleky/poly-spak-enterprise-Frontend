'use client';

import { useState, useEffect } from 'react';
import { getProducts, getUsers, getOrders } from '@/lib/api';
import StatCard from './StatCard';

interface Stats {
  products: number;
  users: number;
  orders: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all data in parallel
        const [productsData, usersData, ordersData] = await Promise.all([
          getProducts(),
          getUsers(),
          getOrders(),
        ]);

        setStats({
          products: productsData.count || 0,
          users: usersData.count || 0,
          orders: ordersData.count || 0,
        });
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <StatCard href="/admin/products" value={stats?.products || 0} label="Products" />
        <StatCard href="/admin/users" value={stats?.users || 0} label="Users" />
        <StatCard href="/admin/orders" value={stats?.orders || 0} label="Orders" />
      </div>
    </div>
  );
}