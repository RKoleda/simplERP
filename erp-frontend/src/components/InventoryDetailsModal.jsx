import React from 'react';

export default function InventoryDetailsModal({ isOpen, onClose, item }) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Artikeldetails</h2>
        <p><strong>Name:</strong> {item.name}</p>
        <p><strong>Bestand:</strong> {item.stock}</p>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-300">Schließen</button>
        </div>
      </div>
    </div>
  );
}
