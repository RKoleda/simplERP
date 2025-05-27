import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import AddCRMModal from '../components/AddCRMModal.jsx';
import AddCustomerModal from '../components/AddCustomerModal.jsx';
import AddOrderModal from '../components/AddOrderModal.jsx';
import AddInventoryModal from '../components/AddInventoryModal.jsx';

import CustomerDetailsModal from '../components/CustomerDetailsModal.jsx';
import OrderDetailsModal from '../components/OrderDetailsModal.jsx';
import InventoryDetailsModal from '../components/InventoryDetailsModal.jsx';
import CRMDetailsModal from '../components/CRMDetailsModal.jsx';

import AllOrdersModal from '../components/AllOrdersModal.jsx';
import AllCustomersModal from '../components/AllCustomersModal.jsx';
import AllInventoryModal from '../components/AllInventoryModal.jsx';
import AllCRMModal from '../components/AllCRMModal.jsx';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [leads, setLeads] = useState([]);

  const [showAddCRMModal, setShowAddCRMModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [showAddInventoryModal, setShowAddInventoryModal] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);

  const [showCustomerDetailsModal, setShowCustomerDetailsModal] = useState(false);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [showInventoryDetailsModal, setShowInventoryDetailsModal] = useState(false);
  const [showCRMDetailsModal, setShowCRMDetailsModal] = useState(false);

  const [showAllOrdersModal, setShowAllOrdersModal] = useState(false);
  const [showAllCustomersModal, setShowAllCustomersModal] = useState(false);
  const [showAllInventoryModal, setShowAllInventoryModal] = useState(false);
  const [showAllCRMModal, setShowAllCRMModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      try {
        const resOrders = await fetch('http://localhost:5000/api/orders', { headers: { Authorization: `Bearer ${token}` } });
        setOrders(await resOrders.json());

        const resCustomers = await fetch('http://localhost:5000/api/customers', { headers: { Authorization: `Bearer ${token}` } });
        setCustomers(await resCustomers.json());

        const resProducts = await fetch('http://localhost:5000/api/products', { headers: { Authorization: `Bearer ${token}` } });
        setProducts(await resProducts.json());

        const resLeads = await fetch('http://localhost:5000/api/crm', { headers: { Authorization: `Bearer ${token}` } });
        setLeads(await resLeads.json());
      } catch (err) {
        console.error('Fehler beim Laden des Dashboards:', err);
        toast.error('❌ Fehler beim Laden der Daten!');
      }
    };
    fetchData();
  }, []);

  const renderItems = (items, type) =>
    items.slice(0, 10).map((item) => (
      <div
        key={item.id}
        className={`border rounded p-2 text-sm flex justify-between items-center ${
          item.prio === 'hoch' ? 'bg-red-100' : item.prio === 'mittel' ? 'bg-yellow-100' : ''
        }`}
      >
        <span>{item.name || item.titel || item.betreff}</span>
        <button
          onClick={() => {
            if (type === 'Kunde') {
              setSelectedCustomer(item);
              setShowCustomerDetailsModal(true);
            } else if (type === 'Auftrag') {
              setSelectedOrder(item);
              setShowOrderDetailsModal(true);
            } else if (type === 'Artikel') {
              setSelectedProduct(item);
              setShowInventoryDetailsModal(true);
            } else if (type === 'Lead') {
              setSelectedLead(item);
              setShowCRMDetailsModal(true);
            }
          }}
          className={`text-xs ${
            type === 'Auftrag'
              ? 'bg-green-600 hover:bg-green-700'
              : type === 'Kunde'
              ? 'bg-blue-600 hover:bg-blue-700'
              : type === 'Artikel'
              ? 'bg-yellow-600 hover:bg-yellow-700'
              : 'bg-purple-600 hover:bg-purple-700'
          } text-white px-2 py-0.5 rounded`}
        >
          Details
        </button>
      </div>
    ));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-center mb-8">🚀 Dashboard – Dein ERP Cockpit</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Aufträge */}
        <div className="bg-white shadow rounded p-4 space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">📦 Aufträge ({orders.length})</h2>
            <button onClick={() => setShowAllOrdersModal(true)} className="text-sm text-blue-600 hover:underline">Alle anzeigen</button>
          </div>
          {renderItems(orders, 'Auftrag')}
          <button onClick={() => setShowAddOrderModal(true)} className="mt-2 text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 w-full">
            ➕ Neuen Auftrag
          </button>
          <AddOrderModal isOpen={showAddOrderModal} onClose={() => setShowAddOrderModal(false)} onAdd={(newOrder) => setOrders((prev) => [newOrder, ...prev])} />
          <OrderDetailsModal isOpen={showOrderDetailsModal} onClose={() => setShowOrderDetailsModal(false)} order={selectedOrder} />
          <AllOrdersModal isOpen={showAllOrdersModal} onClose={() => setShowAllOrdersModal(false)} orders={orders} />
        </div>

        {/* Kunden */}
        <div className="bg-white shadow rounded p-4 space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">📇 Kunden ({customers.length})</h2>
            <button onClick={() => setShowAllCustomersModal(true)} className="text-sm text-blue-600 hover:underline">Alle anzeigen</button>
          </div>
          {renderItems(customers, 'Kunde')}
          <button onClick={() => setShowAddCustomerModal(true)} className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 w-full">
            ➕ Neuen Kunden
          </button>
          <AddCustomerModal isOpen={showAddCustomerModal} onClose={() => setShowAddCustomerModal(false)} onAdd={(newCustomer) => setCustomers((prev) => [newCustomer, ...prev])} />
          <CustomerDetailsModal isOpen={showCustomerDetailsModal} onClose={() => setShowCustomerDetailsModal(false)} customer={selectedCustomer} />
          <AllCustomersModal isOpen={showAllCustomersModal} onClose={() => setShowAllCustomersModal(false)} customers={customers} />
        </div>

        {/* Lagerbestand */}
        <div className="bg-white shadow rounded p-4 space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">🏷️ Lager ({products.length})</h2>
            <button onClick={() => setShowAllInventoryModal(true)} className="text-sm text-blue-600 hover:underline">Alle anzeigen</button>
          </div>
          {renderItems(products, 'Artikel')}
          <button onClick={() => setShowAddInventoryModal(true)} className="mt-2 text-xs bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700 w-full">
            ➕ Neuer Artikel
          </button>
          <AddInventoryModal isOpen={showAddInventoryModal} onClose={() => setShowAddInventoryModal(false)} onAdd={(newItem) => setProducts((prev) => [newItem, ...prev])} />
          <InventoryDetailsModal isOpen={showInventoryDetailsModal} onClose={() => setShowInventoryDetailsModal(false)} item={selectedProduct} />
          <AllInventoryModal isOpen={showAllInventoryModal} onClose={() => setShowAllInventoryModal(false)} products={products} />
        </div>

        {/* Vertrieb/CRM */}
        <div className="bg-white shadow rounded p-4 space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">📞 Vertrieb/CRM ({leads.length})</h2>
            <button onClick={() => setShowAllCRMModal(true)} className="text-sm text-blue-600 hover:underline">Alle anzeigen</button>
          </div>
          {renderItems(leads, 'Lead')}
          <button onClick={() => setShowAddCRMModal(true)} className="mt-2 text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 w-full">
            ➕ Neuer Lead
          </button>
          <AddCRMModal isOpen={showAddCRMModal} onClose={() => setShowAddCRMModal(false)} onAdd={(newLead) => setLeads((prev) => [newLead, ...prev])} />
          <CRMDetailsModal isOpen={showCRMDetailsModal} onClose={() => setShowCRMDetailsModal(false)} lead={selectedLead} />
          <AllCRMModal isOpen={showAllCRMModal} onClose={() => setShowAllCRMModal(false)} leads={leads} />
        </div>
      </div>
    </div>
  );
}
