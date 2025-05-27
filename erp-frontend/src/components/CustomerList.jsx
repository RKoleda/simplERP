import { useState } from 'react';

const CustomerList = ({ customers, onSelect, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = customers
    .filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 10); // Maximal 10 Kunden anzeigen

  return (
    <div className="space-y-2 max-w-lg">
      <h2 className="text-lg font-semibold">Kunden</h2>

      <input
        type="text"
        placeholder="Suche nach Name oder E-Mail"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border rounded p-1 w-full text-sm"
      />

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">Keine Kunden gefunden.</p>
      ) : (
        <ul className="space-y-1">
          {filtered.map(c => (
            <li
              key={c.id}
              className="p-2 border rounded text-sm flex justify-between items-center"
            >
              <div
                onClick={() => onSelect(c)}
                className="cursor-pointer hover:underline"
              >
                {c.name} – {c.email}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit.edit(c)}
                  className="text-blue-600 hover:underline"
                >
                  Bearbeiten
                </button>
                <button
                  onClick={() => onEdit.delete(c.id)}
                  className="text-red-600 hover:underline"
                >
                  Löschen
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomerList;
