import { useState } from 'react';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Vertrieb() {
  const generateMockLeads = () => {
    const dummyNames = ['Max', 'Sophie', 'Tom', 'Anna', 'Lukas', 'Lea', 'Paul', 'Mia', 'Tim', 'Julia', 'Jonas', 'Lisa', 'Felix', 'Emma', 'Noah', 'Marie', 'Ben', 'Laura', 'Elias', 'Hannah'];
    const dummyStatus = ['Neu', 'In Kontakt', 'Kein Interesse', 'Kunde geworden'];
    const dummyPrio = ['Hoch', 'Mittel', 'Niedrig'];

    const leads = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      name: dummyNames[Math.floor(Math.random() * dummyNames.length)],
      email: `kunde${i + 1}@example.com`,
      telefon: `+49 170 ${Math.floor(1000000 + Math.random() * 9000000)}`,
      status: dummyStatus[Math.floor(Math.random() * dummyStatus.length)],
      prioritaet: dummyPrio[Math.floor(Math.random() * dummyPrio.length)],
      notizen: 'Dies ist ein Test-Lead.',
      kontaktversuche: Math.floor(Math.random() * 5),
    }));

    return leads;
  };

  const [leads, setLeads] = useState(generateMockLeads());
  const [form, setForm] = useState({
    name: '',
    email: '',
    telefon: '',
    status: '',
    prioritaet: '',
    notizen: '',
  });

  const [filter, setFilter] = useState({
    status: '',
    prioritaet: '',
  });

  const statusOptions = ['Neu', 'In Kontakt', 'Kein Interesse', 'Kunde geworden'];
  const prioritaetOptions = ['Hoch', 'Mittel', 'Niedrig'];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.telefon || !form.status || !form.prioritaet) {
      toast.error('Bitte alle Pflichtfelder ausfüllen!');
      return;
    }
    const newLead = { ...form, id: Date.now(), kontaktversuche: 0 };
    setLeads([...leads, newLead]);
    toast.success('✅ Lead gespeichert!');
    setForm({ name: '', email: '', telefon: '', status: '', prioritaet: '', notizen: '' });
  };

  const handleKontaktVersuch = (id) => {
    setLeads(leads.map((lead) => (lead.id === id ? { ...lead, kontaktversuche: lead.kontaktversuche + 1 } : lead)));
    toast.info('📞 Kontaktversuch +1');
  };

  const filteredLeads = leads
    .filter((lead) => (filter.status ? lead.status === filter.status : true))
    .filter((lead) => (filter.prioritaet ? lead.prioritaet === filter.prioritaet : true))
    .sort((a, b) => {
      const prioOrder = { Hoch: 1, Mittel: 2, Niedrig: 3 };
      return prioOrder[a.prioritaet] - prioOrder[b.prioritaet];
    });

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Leads Übersicht', 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['Name', 'Email', 'Telefon', 'Status', 'Priorität', 'Kontaktversuche', 'Notizen']],
      body: filteredLeads.map((lead) => [
        lead.name,
        lead.email,
        lead.telefon,
        lead.status,
        lead.prioritaet,
        lead.kontaktversuche,
        lead.notizen || '',
      ]),
    });
    doc.save('leads.pdf');
    toast.success('📄 PDF exportiert!');
  };

  const exportCSV = () => {
    const header = ['Name', 'Email', 'Telefon', 'Status', 'Priorität', 'Kontaktversuche', 'Notizen'];
    const rows = filteredLeads.map((lead) =>
      [lead.name, lead.email, lead.telefon, lead.status, lead.prioritaet, lead.kontaktversuche, lead.notizen || '']
    );
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [header, ...rows].map((row) => row.map((val) => `"${val}"`).join(',')).join('\\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'leads.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('📄 CSV exportiert!');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📈 Vertrieb – Neue Leads erfassen</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block font-semibold">Name*</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold">E-Mail*</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold">Telefon*</label>
          <input type="text" name="telefon" value={form.telefon} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold">Status*</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="">Bitte wählen...</option>
            {statusOptions.map((s, i) => <option key={i} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-semibold">Priorität*</label>
          <select name="prioritaet" value={form.prioritaet} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="">Bitte wählen...</option>
            {prioritaetOptions.map((p, i) => <option key={i} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-semibold">Notizen</label>
          <textarea name="notizen" value={form.notizen} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Lead speichern
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-8 mb-4">🔍 Filter</h2>
      <div className="flex gap-4 mb-4">
        <select name="status" value={filter.status} onChange={handleFilterChange} className="border p-2 rounded">
          <option value="">Status filtern...</option>
          {statusOptions.map((s, i) => <option key={i} value={s}>{s}</option>)}
        </select>

        <select name="prioritaet" value={filter.prioritaet} onChange={handleFilterChange} className="border p-2 rounded">
          <option value="">Priorität filtern...</option>
          {prioritaetOptions.map((p, i) => <option key={i} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="flex gap-4 mb-4">
        <button onClick={exportPDF} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">PDF exportieren</button>
        <button onClick={exportCSV} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">CSV exportieren</button>
      </div>

      <h2 className="text-xl font-semibold mb-4">🗂️ Erfasste Leads (sortiert nach Priorität)</h2>
      <ul className="space-y-2">
        {filteredLeads.map((lead) => (
          <li key={lead.id} className="border p-2 rounded">
            <p><strong>Name:</strong> {lead.name}</p>
            <p><strong>Email:</strong> {lead.email}</p>
            <p><strong>Telefon:</strong> {lead.telefon}</p>
            <p><strong>Status:</strong> {lead.status}</p>
            <p><strong>Priorität:</strong> {lead.prioritaet}</p>
            <p><strong>Notizen:</strong> {lead.notizen || 'Keine'}</p>
            <p><strong>Kontaktversuche:</strong> {lead.kontaktversuche}</p>
            <button
              onClick={() => handleKontaktVersuch(lead.id)}
              className="mt-2 bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700"
            >
              📞 Kontaktversuch +1
            </button>
          </li>
        ))}
        {filteredLeads.length === 0 && <p className="text-gray-500">Keine Leads gefunden.</p>}
      </ul>
    </div>
  );
}
