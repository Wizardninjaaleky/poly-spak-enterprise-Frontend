'use client';

import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const menuItems = [
    { href: '/admin', label: '📊 Dashboard' },
    { href: '/admin/products', label: '🛒 Products' },
    { href: '/admin/orders', label: '📦 Orders' },
    { href: '/admin/users', label: '👥 Users' },
    { href: '/admin/promos', label: '🏷️ Promotions' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 260, background: '#0f172a', color: '#fff', padding: 20 }}>
        <h2 style={{ fontSize: 18, marginBottom: 20 }}>Polyspack Admin</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {menuItems.map((item) => (
              <li key={item.href} style={{ marginBottom: 10 }}>
                <Link href={item.href}>
                  <a style={{ color: '#cbd5e1', textDecoration: 'none', display: 'block', padding: '8px 12px', borderRadius: 4, transition: 'background 0.2s' }}
                     onMouseEnter={(e) => e.currentTarget.style.background = '#1e293b'}
                     onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    {item.label}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main style={{ flex: 1, background: '#f8fafc', padding: 24 }}>
        <header style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>Admin Dashboard</h1>
          <div style={{ color: '#6b7280' }}>
            Admin • <strong>{user?.name || 'Polyspack'}</strong>
          </div>
        </header>

        <section>{children}</section>
      </main>
    </div>
  );
};

export default AdminLayout;
