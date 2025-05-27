import React from 'react';

export default function AllInventoryModal({ isOpen, onClose, products }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Alle Artikel</h2>
        {products.map((p) => (
          <div key={p.id} className="border rounded p-2 mb-2">
            <p><strong>Name:</strong> {p.name}</p>
            <p><strong>Bestand:</strong> {p.stock}</p>
          </div>
        ))}
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-300">Schließen</button>
        </div>
      </div>
    </div>
  );
}
