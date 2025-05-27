import { useState } from 'react';

const OrderList = ({ orders, customers, onDelete, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = orders
    .filter(o =>
      o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customers.find(c => c.id === o.customerId)?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 10); // Maximal 10 Aufträge anzeigen

  const getCustomerName = (id) => customers.find(c => c.id === id)?.name || 'Unbekannter Kunde';

  return (
    <div className="space-y-2 max-w-lg">
      <h2 className="text-lg font-semibold">Aufträge</h2>

      <input
        type="text"
        placeholder="Suche nach Auftrag oder Kunde"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border rounded p-1 w-full text-sm"
      />

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">Keine Aufträge gefunden.</p>
      ) : (
        <ul className="space-y-1">
          {filtered.map(order => (
            <li
              key={order.id}
              className="p-2 border rounded text-sm flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{order.title}</p>
                <p className="text-gray-600">{getCustomerName(order.customerId)}</p>
                <p className="text-gray-600">Status: {order.status}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onUpdate.edit(order)}
                  className="text-blue-600 hover:underline"
                >
                  Bearbeiten
                </button>
                <button
                  onClick={() => onDelete(order.id)}
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

export default OrderList;
