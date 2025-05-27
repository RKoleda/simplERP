import React from 'react';

export default function AllCRMModal({ isOpen, onClose, leads }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Alle CRM-Einträge</h2>
        {leads.map((l) => (
          <div key={l.id} className="border rounded p-2 mb-2">
            <p><strong>Name:</strong> {l.name}</p>
            <p><strong>Email:</strong> {l.email}</p>
            <p><strong>Grund:</strong> {l.reason}</p>
            <p><strong>Priorität:</strong> {l.prio}</p>
          </div>
        ))}
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-300">Schließen</button>
        </div>
      </div>
    </div>
  );
}
