import { useState } from 'react';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Auftragsmanagement() {
  const fensterbauArtikel = [
    'Kunststofffenster 120x120',
    'Kunststofffenster 100x100',
    'Alu-Fenster 150x150',
    'Holzfenster 120x80',
    'Dachfenster Velux',
    'Schallschutzfenster',
    'Sicherheitsglas',
    'Fensterbank Granit',
    'Fensterbank Alu',
    'Rollladenkasten',
    'Insektenschutzgitter',
    'Doppelflügelfenster',
    'Schiebefenster',
    'Dreh-Kipp-Fenster',
    'Fenstergriff abschließbar',
    'Verglasung 3-fach',
    'Verglasung 2-fach',
    'Einbauzarge',
    'Montageschaum',
    'Bausilikon Fenster'
  ];

  const generateMockOrders = () => {
    const kunden = ['Max Müller', 'Sophie Meier', 'Tom Schneider', 'Anna Schulz'];
    return Array.from({ length: 10 }, (_, i) => {
      const positionCount = Math.floor(Math.random() * 3) + 2; // 2 bis 4 Positionen
      const positionen = Array.from({ length: positionCount }, () => ({
        name: fensterbauArtikel[Math.floor(Math.random() * fensterbauArtikel.length)],
        menge: Math.floor(Math.random() * 5) + 1,
        einzelpreis: Math.floor(Math.random() * 300) + 100,
      }));

      return {
        id: Date.now() + i,
        titel: `Auftrag #${i + 1}`,
        kunde: kunden[Math.floor(Math.random() * kunden.length)],
        positionen: positionen,
        zahlungsbedingungen: '14 Tage netto',
        notiz: 'Vielen Dank für Ihren Auftrag!',
      };
    });
  };

  const [orders, setOrders] = useState(generateMockOrders());
  const [form, setForm] = useState({
    titel: '',
    kunde: '',
    positionen: [{ name: '', menge: 1, einzelpreis: 0 }],
    zahlungsbedingungen: '',
    notiz: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePositionChange = (index, field, value) => {
    const newPositionen = [...form.positionen];
    newPositionen[index][field] = value;
    setForm({ ...form, positionen: newPositionen });
  };

  const addPosition = () => {
    setForm({ ...form, positionen: [...form.positionen, { name: '', menge: 1, einzelpreis: 0 }] });
  };

  const generatePDF = (order) => {
  const doc = new jsPDF();
  
  const logo = '/logo.png'; // dein Logo-Pfad oder Base64
  doc.addImage(logo, 'PNG', 10, 5, 60, 30); // Breite 50, Höhe 20


  doc.setFontSize(18);
  doc.text(`Rechnung: ${order.titel}`, 14, 40); // Text nach unten verschieben
  doc.setFontSize(12);
  doc.text(`Kunde: ${order.kunde}`, 14, 48);
  doc.text(`Zahlungsbedingungen: ${order.zahlungsbedingungen || 'keine'}`, 14, 56);

  autoTable(doc, {
    startY: 65,
    head: [['Artikel', 'Menge', 'Einzelpreis (€)', 'Gesamt (€)']],
    body: order.positionen.map((p) => [
      p.name,
      p.menge,
      p.einzelpreis.toFixed(2),
      (p.menge * p.einzelpreis).toFixed(2),
    ]),
  });

  const summe = order.positionen.reduce((acc, p) => acc + p.menge * p.einzelpreis, 0).toFixed(2);
  doc.text(`Gesamtsumme: ${summe} €`, 14, doc.lastAutoTable.finalY + 10);
  doc.text(order.notiz || '', 14, doc.lastAutoTable.finalY + 20);

  doc.save(`${order.titel.replaceAll(' ', '_')}.pdf`);
  toast.success('📄 PDF exportiert!');
};


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.titel || !form.kunde || form.positionen.some(p => !p.name || !p.menge || !p.einzelpreis)) {
      toast.error('Bitte alle Felder ausfüllen!');
      return;
    }
    const newOrder = { ...form, id: Date.now() };
    setOrders([...orders, newOrder]);
    toast.success('✅ Auftrag gespeichert!');
    setForm({
      titel: '',
      kunde: '',
      positionen: [{ name: '', menge: 1, einzelpreis: 0 }],
      zahlungsbedingungen: '',
      notiz: '',
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📦 Auftragsmanagement</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block font-semibold">Auftragstitel*</label>
          <input type="text" name="titel" value={form.titel} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold">Kunde*</label>
          <input type="text" name="kunde" value={form.kunde} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold">Positionen*</label>
          {form.positionen.map((p, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <select
                value={p.name}
                onChange={(e) => handlePositionChange(i, 'name', e.target.value)}
                className="border p-2 rounded w-1/2"
              >
                <option value="">Artikel wählen...</option>
                {fensterbauArtikel.map((artikel, idx) => (
                  <option key={idx} value={artikel}>{artikel}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Menge"
                value={p.menge}
                onChange={(e) => handlePositionChange(i, 'menge', Number(e.target.value))}
                className="border p-2 rounded w-1/4"
              />
              <input
                type="number"
                placeholder="Einzelpreis (€)"
                value={p.einzelpreis}
                onChange={(e) => handlePositionChange(i, 'einzelpreis', Number(e.target.value))}
                className="border p-2 rounded w-1/4"
              />
            </div>
          ))}
          <button type="button" onClick={addPosition} className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 mt-1">➕ Weitere Position</button>
        </div>

        <div>
          <label className="block font-semibold">Zahlungsbedingungen</label>
          <input type="text" name="zahlungsbedingungen" value={form.zahlungsbedingungen} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block font-semibold">Notiz</label>
          <textarea name="notiz" value={form.notiz} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>

        <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
          Auftrag speichern
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-8 mb-4">📑 Aufträge</h2>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order.id} className="border p-4 rounded shadow">
            <p><strong>{order.titel}</strong></p>
            <p>Kunde: {order.kunde}</p>
            <p>Positionen: {order.positionen.length}</p>
            <button onClick={() => generatePDF(order)} className="mt-2 bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
              📄 PDF exportieren
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
