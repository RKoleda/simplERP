import { useState } from 'react';
import { toast } from 'react-toastify';

export default function AddCustomerModal({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async () => {
    if (!name || !email || !phone) {
      toast.error('Bitte alle Felder ausfüllen!');
      return;
    }

    const newCustomer = { name, email, phone };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newCustomer),
      });

      if (res.ok) {
        onAdd(await res.json());
        toast.success('✅ Kunde hinzugefügt!');
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
        <h2 className="text-lg font-bold mb-4">➕ Neuen Kunden hinzufügen</h2>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full mb-2 p-2 border rounded" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-Mail" className="w-full mb-2 p-2 border rounded" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telefon" className="w-full mb-2 p-2 border rounded" />
        <div className="flex justify-end mt-4 space-x-2">
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-300">Abbrechen</button>
          <button onClick={handleSubmit} className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Speichern</button>
        </div>
      </div>
    </div>
  );
}
