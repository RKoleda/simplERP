import React, { useEffect, useState } from 'react';
import AddProductForm from './AddProductForm';
import { toast } from 'react-toastify';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const handleDelete = (product) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>🗑 <strong>{product.name}</strong> wirklich löschen?</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={async () => {
                const token = localStorage.getItem('token');
                const res = await fetch(`http://localhost:5000/api/products/${product.id}`, {
                  method: 'DELETE',
                  headers: { Authorization: `Bearer ${token}` },
                });

                if (res.ok) {
                  setProducts((prev) => prev.filter((p) => p.id !== product.id));
                  toast.success('Produkt wurde gelöscht!');
                  closeToast();
                } else {
                  toast.error('Löschen fehlgeschlagen!');
                }
              }}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Ja
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-300 px-3 py-1 rounded text-sm"
            >
              Nein
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  const filteredProducts = products.filter((p) => {
    return (
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.unit.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mt-6 mb-2">Lagerbestand</h2>

      {/* 🔍 Suchfeld */}
      <input
        type="text"
        placeholder="Suchen nach Name, SKU, Beschreibung, Einheit..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full border border-gray-300 rounded p-2 text-sm"
      />

      <table className="w-full border text-sm bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Artikel</th>
            <th className="p-2 text-left">SKU</th>
            <th className="p-2 text-left">Beschreibung</th>
            <th className="p-2 text-left">Bestand</th>
            <th className="p-2 text-left">Einheit</th>
            <th className="p-2 text-left">Aktion</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p) => (
            <tr key={p.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.sku}</td>
              <td className="p-2">{p.description}</td>
              <td className={`p-2 ${p.stock < 10 ? 'text-red-600 font-bold' : ''}`}>
                {p.stock}
              </td>
              <td className="p-2">{p.unit}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(p)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Löschen
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddProductForm setProducts={setProducts} />
    </div>
  );
};

export default ProductList;
