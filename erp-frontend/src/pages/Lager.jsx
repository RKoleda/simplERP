import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Lager() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newName, setNewName] = useState('');
  const [newSKU, setNewSKU] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStock, setNewStock] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(await res.json());
    } catch (err) {
      toast.error('Fehler beim Laden der Lagerdaten');
    }
  };

  const handleAdd = async () => {
    if (!newName || !newSKU || !newStock || !newUnit) {
      toast.error('Bitte alle Felder ausfüllen');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: newName,
          sku: newSKU,
          description: newDescription,
          stock: parseInt(newStock),
          unit: newUnit,
        }),
      });
      const data = await res.json();
      setProducts((prev) => [data.product, ...prev]);
      setNewName('');
      setNewSKU('');
      setNewDescription('');
      setNewStock('');
      setNewUnit('');
      toast.success('Artikel hinzugefügt');
    } catch {
      toast.error('Fehler beim Hinzufügen');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Artikel gelöscht');
    } catch {
      toast.error('Fehler beim Löschen');
    }
  };

  const handleEdit = async () => {
    if (!editItem.name || !editItem.sku || !editItem.stock || !editItem.unit) {
      toast.error('Bitte alle Felder ausfüllen');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/products/${editItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editItem),
      });
      const data = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === data.product.id ? data.product : p)));
      setEditItem(null);
      toast.success('Artikel aktualisiert');
    } catch {
      toast.error('Fehler beim Bearbeiten');
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Lagerübersicht', 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['Name', 'SKU', 'Beschreibung', 'Bestand', 'Einheit']],
      body: products.map((p) => [p.name, p.sku, p.description, p.stock, p.unit]),
    });
    doc.save('lager.pdf');
    toast.success('📄 PDF exportiert!');
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">📦 Lagerverwaltung</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Suche..."
          className="p-2 border rounded w-64"
        />
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Artikelname"
          className="p-2 border rounded"
        />
        <input
          value={newSKU}
          onChange={(e) => setNewSKU(e.target.value)}
          placeholder="SKU"
          className="p-2 border rounded w-24"
        />
        <input
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Beschreibung"
          className="p-2 border rounded w-48"
        />
        <input
          value={newStock}
          onChange={(e) => setNewStock(e.target.value)}
          placeholder="Bestand"
          type="number"
          className="p-2 border rounded w-24"
        />
        <input
          value={newUnit}
          onChange={(e) => setNewUnit(e.target.value)}
          placeholder="Einheit"
          className="p-2 border rounded w-24"
        />
        <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          ➕ Hinzufügen
        </button>
        <button onClick={exportPDF} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          📄 PDF Export
        </button>
      </div>

      <div className="space-y-2">
        {filteredProducts.map((p) => (
          <div key={p.id} className="border p-2 rounded flex justify-between items-center flex-wrap">
            {editItem?.id === p.id ? (
              <>
                <input
                  value={editItem.name}
                  onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                  className="border p-1 rounded w-48"
                />
                <input
                  value={editItem.sku}
                  onChange={(e) => setEditItem({ ...editItem, sku: e.target.value })}
                  className="border p-1 rounded w-24"
                />
                <input
                  value={editItem.description}
                  onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                  className="border p-1 rounded w-48"
                />
                <input
                  value={editItem.stock}
                  type="number"
                  onChange={(e) => setEditItem({ ...editItem, stock: e.target.value })}
                  className="border p-1 rounded w-20"
                />
                <input
                  value={editItem.unit}
                  onChange={(e) => setEditItem({ ...editItem, unit: e.target.value })}
                  className="border p-1 rounded w-20"
                />
                <button onClick={handleEdit} className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                  Speichern
                </button>
                <button onClick={() => setEditItem(null)} className="text-xs bg-gray-400 text-white px-2 py-1 rounded">
                  Abbrechen
                </button>
              </>
            ) : (
              <>
                <span className="w-48">{p.name}</span>
                <span className="w-24">SKU: {p.sku}</span>
                <span className="w-48">{p.description}</span>
                <span className="w-20">Bestand: {p.stock}</span>
                <span className="w-20">{p.unit}</span>
                <div className="flex gap-2">
                  <button onClick={() => setEditItem(p)} className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                    Bearbeiten
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">
                    Löschen
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
