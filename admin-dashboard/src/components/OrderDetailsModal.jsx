import React from 'react';

export default function OrderDetailsModal({ order, isOpen, onClose }) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Order Details #{order._id.slice(-8)}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div className="space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Order ID:</span> {order._id}</p>
                  <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
                  <p><span className="font-medium">Status:</span>
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </p>
                  <p><span className="font-medium">Total:</span> ${order.total || 0}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {order.customerName || 'N/A'}</p>
                  <p><span className="font-medium">Email:</span> {order.customerEmail || 'N/A'}</p>
                  <p><span className="font-medium">Phone:</span> {order.customerPhone || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Shipping Address</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Items</h3>
              <div className="space-y-3">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <img
                          src={item.image || '/placeholder-product.jpg'}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg mr-4"
                          onError={(e) => { e.target.src = '/placeholder-product.jpg'; }}
                        />
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${item.price}</p>
                        <p className="text-sm text-gray-600">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No items found in this order.</p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount:</span>
                <span className="text-2xl font-bold text-green-600">${order.total || 0}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
