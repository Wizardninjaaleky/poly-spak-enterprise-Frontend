import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="font-bold text-lg">Admin Dashboard</div>
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/')} className="px-3 py-1">Home</button>
        <button onClick={() => navigate('/products')} className="px-3 py-1">Products</button>
        <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
      </div>
    </nav>
  );
}
