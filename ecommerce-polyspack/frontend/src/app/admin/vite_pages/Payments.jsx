import React, { useState, useEffect } from 'react';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => { setLoading(false); }, []);

  const handleVerifyPayment = async (orderId, action) => {
    // TODO: call API
    setPayments(prev => prev.map(p => p.orderId?._id === orderId ? { ...p, paymentStatus: action === 'confirm' ? 'Confirmed' : 'Rejected' } : p));
    setShowRejectModal(false);
    setRejectionReason('');
    setSelectedPayment(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Payments</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>M-Pesa Code</th>
              <th>Phone Number</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment._id}>
                <td>#{payment.orderId?.orderNumber || payment.orderId?._id?.slice(-8) || 'N/A'}</td>
                <td>{payment.userId?.name || 'N/A'}</td>
                <td>${payment.amount?.toFixed(2) || '0.00'}</td>
                <td>{payment.mpesaCode}</td>
                <td>{payment.phoneNumber}</td>
                <td><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.paymentStatus)}`}>{payment.paymentStatus}</span></td>
                <td>{new Date(payment.timestamp).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => { setSelectedPayment(payment); setShowModal(true); }}>View</button>
                  {payment.paymentStatus === 'Pending' && (
                    <>
                      <button onClick={() => handleVerifyPayment(payment.orderId._id, 'confirm')}>Confirm</button>
                      <button onClick={() => { setSelectedPayment(payment); setShowRejectModal(true); }}>Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payments.length === 0 && !loading && <div className="text-center py-12"><p className="text-gray-500">No payments found.</p></div>}

      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-11/12 md:w-3/4 lg:w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h3>Payment Details - Order #{selectedPayment.orderId?.orderNumber || selectedPayment.orderId?._id?.slice(-8)}</h3>
              <button onClick={() => setShowModal(false)}>×</button>
            </div>
            <div>
              <h4>Customer Information</h4>
              <p>Name: {selectedPayment.userId?.name || 'N/A'}</p>
              <p>Email: {selectedPayment.userId?.email || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-11/12 md:w-3/4 lg:w-1/2">
            <h3>Reject Payment - Order #{selectedPayment.orderId?.orderNumber || selectedPayment.orderId?._id?.slice(-8)}</h3>
            <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} rows={4} className="w-full" />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
              <button onClick={() => handleVerifyPayment(selectedPayment.orderId._id, 'reject')} className="px-4 py-2 bg-red-600 text-white rounded">Reject Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
