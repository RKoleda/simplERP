import { useState } from 'react';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function CRM() {
  const generateMockCustomers = () => {
    const dummyNames = ['Max Müller', 'Sophie Meier', 'Tom Schneider', 'Anna Schulz', 'Lukas Becker', 'Lea Wagner', 'Paul Hoffmann', 'Mia Fischer', 'Tim Weber', 'Julia Koch', 'Jonas Klein', 'Lisa Braun', 'Felix Schröder', 'Emma Hartmann', 'Noah Lange', 'Marie Schäfer', 'Ben Krüger', 'Laura Richter', 'Elias Vogel', 'Hannah Bauer'];
    return dummyNames.map((name, index) => ({
      id: index,
      name,
      email: `kunde${index + 1}@example.com`,
    }));
  };

  const generateMockContacts = (customers) => {
    const dummyGruende = ['Rechnung', 'Beschwerde', 'Rückruf', 'Support-Anfrage', 'Produktinfo', 'Sonstiges'];
    return Array.from({ length: 20 }, (_, i) => {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      return {
        id: Date.now() + i,
        name: customer.name,
        email: customer.email,
        grund: dummyGruende[Math.floor(Math.random() * dummyGruende.length)],
        notiz: 'Dies ist eine zufällige Kunden-Notiz.',
      };
    });
  };

  const [customers] = useState(() => generateMockCustomers());
  const [contacts, setContacts] = useState(() => generateMockContacts(generateMockCustomers()));
  const [form, setForm] = useState({
    customerId: '',
    email: '',
    grund: '',
    notiz: '',
  });
  const [filterGrund, setFilterGrund] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const kontaktGruende = ['Rechnung', 'Beschwerde', 'Rückruf', 'Support-Anfrage', 'Produktinfo', 'Sonstiges'];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'customerId') {
      const selected = customers.find((c) => c.id === Number(e.target.value));
      setForm((prev) => ({ ...prev, email: selected?.email || '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.customerId || !form.grund || !form.notiz) {
      toast.error('Bitte alle Pflichtfelder ausfüllen!');
      return;
    }
    const customer = customers.find((c) => c.id === Number(form.customerId));
    const newContact = {
      id: Date.now(),
      name: customer.name,
      email: customer.email,
      grund: form.grund,
      notiz: form.notiz,
    };
    setContacts([...contacts, newContact]);
    toast.success('✅ Kontakt gespeichert!');
    setForm({ customerId: '', email: '', grund: '', notiz: '' });
  };

  const filteredContacts = contacts.filter((c) => 
    (filterGrund ? c.grund === filterGrund : true) &&
    (searchQuery
      ? c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.grund.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.notiz.toLowerCase().includes(searchQuery.toLowerCase())
      : true)
  );

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Kundenkontakte', 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['Name', 'Email', 'Grund', 'Notiz']],
      body: filteredContacts.map((c) => [c.name, c.email, c.grund, c.notiz]),
    });
    doc.save('kontakte.pdf');
    toast.success('📄 PDF exportiert!');
  };

  const exportCSV = () => {
    const header = ['Name', 'Email', 'Grund', 'Notiz'];
    const rows = filteredContacts.map((c) => [c.name, c.email, c.grund, c.notiz]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [header, ...rows].map((row) => row.map((val) => `"${val}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'kontakte.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('📄 CSV exportiert!');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">💬 CRM – Kundenkontakte verwalten</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block font-semibold">Kunde auswählen*</label>
          <select
            name="customerId"
            value={form.customerId}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Bitte wählen...</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold">E-Mail</label>
          <input
            type="email"
            name="email"
            value={form.email}
            disabled
            className="w-full border p-2 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block font-semibold">Grund des Kontakts*</label>
          <select
            name="grund"
            value={form.grund}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Bitte wählen...</option>
            {kontaktGruende.map((grund, idx) => (
              <option key={idx} value={grund}>{grund}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold">Notiz*</label>
          <textarea
            name="notiz"
            value={form.notiz}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Kontakt speichern
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-8 mb-4">🔍 Filter & Suche</h2>
      <div className="flex gap-4 mb-4">
        <select value={filterGrund} onChange={(e) => setFilterGrund(e.target.value)} className="border p-2 rounded">
          <option value="">Grund filtern...</option>
          {kontaktGruende.map((g, i) => <option key={i} value={g}>{g}</option>)}
        </select>

        <input
          type="text"
          placeholder="Suche (Name, Email, Grund, Notiz)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="flex gap-4 mb-4">
        <button onClick={exportPDF} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">PDF exportieren</button>
        <button onClick={exportCSV} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">CSV exportieren</button>
      </div>

      <h2 className="text-xl font-semibold mb-4">📇 Kontakte</h2>
      <ul className="space-y-2">
        {filteredContacts.map((c) => (
          <li key={c.id} className="border p-2 rounded">
            <p><strong>Name:</strong> {c.name}</p>
            <p><strong>Email:</strong> {c.email}</p>
            <p><strong>Grund:</strong> {c.grund}</p>
            <p><strong>Notiz:</strong> {c.notiz}</p>
          </li>
        ))}
        {filteredContacts.length === 0 && <p className="text-gray-500">Keine Kontakte gefunden.</p>}
      </ul>
    </div>
  );
}
