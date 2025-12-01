'use client';

import { useRouter } from 'next/navigation';
import AdminSidebar from './Sidebar';
import AdminTopBar from './TopBar';

export default function AdminLayout({ children, user, title, breadcrumbs }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
    router.push('/admin/login');
  };

  // Mock notifications - in production, fetch from API
  const notifications = [
    {
      title: 'New Order',
      message: 'Order #1245 placed by John Doe',
      time: '2 minutes ago',
      read: false,
    },
    {
      title: 'Low Stock Alert',
      message: 'JSOT Solar Light 50W has only 3 units left',
      time: '15 minutes ago',
      read: false,
    },
    {
      title: 'Payment Received',
      message: 'Payment of KSh 15,000 confirmed',
      time: '1 hour ago',
      read: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar onLogout={handleLogout} />
      <AdminTopBar user={user} notifications={notifications} />

      {/* Main Content */}
      <main className="ml-64 mt-16 p-6">
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <nav className="mb-4 text-sm text-gray-600">
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx}>
                {idx > 0 && <span className="mx-2">›</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-green-600">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-gray-900 font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Page Title */}
        {title && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
        )}

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}
