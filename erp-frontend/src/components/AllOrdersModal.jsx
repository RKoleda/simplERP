import React from 'react';

export default function AllOrdersModal({ isOpen, onClose, orders }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Alle Aufträge</h2>
        {orders.map((order) => (
          <div key={order.id} className="border rounded p-2 mb-2">
            <p><strong>Titel:</strong> {order.titel}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Priorität:</strong> {order.prio}</p>
          </div>
        ))}
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-300">Schließen</button>
        </div>
      </div>
    </div>
  );
}
