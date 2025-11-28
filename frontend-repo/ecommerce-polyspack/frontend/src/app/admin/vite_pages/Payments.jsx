"use client";

import React, { useState, useEffect } from 'react';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, verified: 0, rejected: 0, total: 0 });

  useEffect(() => {
    setTimeout(() => {
      setStats({ pending: 12, verified: 8, rejected: 2, total: 45200 });
      setPayments([
        { id: '12350', customer: 'John Doe', phone: '+254712345678', mpesaCode: 'QWE1X2Y3Z4', amount: 3200, status: 'pending', date: 'Dec 20, 2024' },
        { id: '12349', customer: 'Jane Smith', phone: '+254798765432', mpesaCode: 'ABC5D6E7F8', amount: 1800, status: 'pending', date: 'Dec 20, 2024' },
        { id: '12348', customer: 'Alice Johnson', phone: '+254756123456', mpesaCode: 'XYZ9A0B1C2', amount: 2500, status: 'verified', date: 'Dec 20, 2024' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const verifyPayment = (id) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status: 'verified' } : p));
    setStats({ ...stats, pending: stats.pending - 1, verified: stats.verified + 1 });
  };

  const rejectPayment = (id) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
    setStats({ ...stats, pending: stats.pending - 1, rejected: stats.rejected + 1 });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payment Verification</h1>
        <p className="text-gray-600 mt-1">Verify M-Pesa payments and transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-yellow-50 p-6 rounded-xl"><div className="text-3xl mb-2">⏳</div><p className="text-sm text-gray-600">Pending</p><p className="text-3xl font-bold">{stats.pending}</p></div>
        <div className="bg-green-50 p-6 rounded-xl"><div className="text-3xl mb-2">✅</div><p className="text-sm text-gray-600">Verified Today</p><p className="text-3xl font-bold">{stats.verified}</p></div>
        <div className="bg-red-50 p-6 rounded-xl"><div className="text-3xl mb-2">❌</div><p className="text-sm text-gray-600">Rejected Today</p><p className="text-3xl font-bold">{stats.rejected}</p></div>
        <div className="bg-blue-50 p-6 rounded-xl"><div className="text-3xl mb-2">💰</div><p className="text-sm text-gray-600">Total Processed</p><p className="text-3xl font-bold">KSh {stats.total.toLocaleString()}</p></div>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {payments.filter(p => p.status === 'pending').map((payment) => (
          <div key={payment.id} className="bg-white rounded-xl shadow-sm border-2 border-yellow-200 p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Order #{payment.id}</h3>
                <p className="text-gray-700"><strong>Customer:</strong> {payment.customer}</p>
                <p className="text-gray-700"><strong>Phone:</strong> {payment.phone}</p>
                <p className="text-gray-700"><strong>M-Pesa Code:</strong> <span className="font-mono bg-gray-100 px-2 py-1 rounded">{payment.mpesaCode}</span></p>
                <p className="text-gray-700"><strong>Amount:</strong> KSh {payment.amount.toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => verifyPayment(payment.id)} className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">✓ Verify</button>
                <button onClick={() => rejectPayment(payment.id)} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">✗ Reject</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Payments;
