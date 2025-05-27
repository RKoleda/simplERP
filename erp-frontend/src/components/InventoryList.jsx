import { useState } from 'react';


const InventoryList = ({ items, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = items
    .filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 10); // Maximal 10 Artikel anzeigen

  return (
    <div className="space-y-2 max-w-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Lagerbestand</h2>
        <button
          onClick={onEdit.showAll}
          className="bg-purple-600 text-white text-sm px-3 py-1.5 rounded hover:bg-purple-700"
        >
          📋 Alle Artikel anzeigen
        </button>
      </div>

      <input
        type="text"
        placeholder="Suche nach Artikel"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border rounded p-1 w-full text-sm"
      />

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">Keine Artikel gefunden.</p>
      ) : (
        <ul className="space-y-1">
          {filtered.map(item => (
            <li
              key={item.id}
              className="p-2 border rounded text-sm flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-600">{item.quantity} Stück</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit.edit(item)}
                  className="text-blue-600 hover:underline"
                >
                  Bearbeiten
                </button>
                <button
                  onClick={() => onEdit.delete(item.id)}
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

export default InventoryList;
