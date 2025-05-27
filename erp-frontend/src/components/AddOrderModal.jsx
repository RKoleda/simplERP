import { useState } from 'react';
import { toast } from 'react-toastify';

export default function AddOrderModal({ isOpen, onClose, onAdd }) {
  const [titel, setTitel] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async () => {
    if (!titel || !status) {
      toast.error('Bitte alle Felder ausfüllen!');
      return;
    }

    const newOrder = { titel, status, prio: 'mittel' };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newOrder),
      });

      if (res.ok) {
        onAdd(await res.json());
        toast.success('✅ Auftrag hinzugefügt!');
        onClose();
      } else {
        toast.error('❌ Fehler beim Hinzufügen!');
      }
    } catch {
      toast.error('❌ Serverfehler!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">➕ Neuen Auftrag hinzufügen</h2>
        <input value={titel} onChange={(e) => setTitel(e.target.value)} placeholder="Titel" className="w-full mb-2 p-2 border rounded" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" className="w-full mb-2 p-2 border rounded" />
        <div className="flex justify-end mt-4 space-x-2">
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-300">Abbrechen</button>
          <button onClick={handleSubmit} className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700">Speichern</button>
        </div>
      </div>
    </div>
  );
}
