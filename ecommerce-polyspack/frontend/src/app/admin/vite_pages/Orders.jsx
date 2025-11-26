import React, { useState, useEffect } from 'react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // TODO: fetch orders
    setLoading(false);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    // TODO: call API to update order status
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Orders</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>#{order._id?.slice(-8)}</td>
                <td>{order.user?.name || 'N/A'}</td>
                <td>${order.total?.toFixed(2) || '0.00'}</td>
                <td>
                  <select value={order.status || 'Pending'} onChange={(e) => handleStatusChange(order._id, e.target.value)} className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td><button onClick={() => { setSelectedOrder(order); setShowModal(true); }}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && !loading && <div className="text-center py-12"><p className="text-gray-500">No orders found.</p></div>}

      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-11/12 md:w-3/4 lg:w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h3>Order Details - #{selectedOrder._id?.slice(-8)}</h3>
              <button onClick={() => setShowModal(false)}>×</button>
            </div>
            <div>
              <h4>Customer Information</h4>
              <p>Name: {selectedOrder.user?.name || 'N/A'}</p>
              <p>Email: {selectedOrder.user?.email || 'N/A'}</p>
            </div>
            <div>
              <h4>Items</h4>
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <div>{item.product?.name || 'Unknown'}</div>
                  <div>Qty: {item.quantity}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
