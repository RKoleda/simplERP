import { v4 as uuidv4 } from 'uuid';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const ordersPath = path.resolve('data/orders.json');

// Alle Bestellungen lesen
export const getOrders = async (req, res) => {
  try {
    const data = await readFile(ordersPath, 'utf-8');
    const orders = JSON.parse(data);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Fehler beim Laden der Aufträge' });
  }
};

// Einzelne Bestellung nach ID
export const getOrderById = async (req, res) => {
  try {
    const data = await readFile(ordersPath, 'utf-8');
    const orders = JSON.parse(data);
    const order = orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ message: 'Auftrag nicht gefunden' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Fehler beim Laden des Auftrags' });
  }
};

// Neue Bestellung erstellen
export const createOrder = async (req, res) => {
  try {
    const { customerId, product, quantity, note, status } = req.body;

    if (!customerId || !product || !quantity) {
      return res.status(400).json({ message: 'Bitte alle Pflichtfelder ausfüllen' });
    }

    const newOrder = {
      id: uuidv4(),
      customerId,
      product,
      quantity: parseInt(quantity),
      note: note || '',
      status: status || 'offen',
      createdAt: new Date().toISOString()
    };

    const data = await readFile(ordersPath, 'utf-8');
    const orders = JSON.parse(data);

    orders.push(newOrder);
    await writeFile(ordersPath, JSON.stringify(orders, null, 2), 'utf-8');

    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Fehler beim Erstellen des Auftrags:', err);
    res.status(500).json({ message: 'Fehler beim Erstellen des Auftrags' });
  }
};

// Bestellung aktualisieren
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerId, product, quantity, note, status } = req.body;

    const data = await readFile(ordersPath, 'utf-8');
    const orders = JSON.parse(data);

    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return res.status(404).json({ message: 'Auftrag nicht gefunden' });

    orders[index] = {
      ...orders[index],
      customerId: customerId || orders[index].customerId,
      product: product || orders[index].product,
      quantity: quantity !== undefined ? parseInt(quantity) : orders[index].quantity,
      note: note !== undefined ? note : orders[index].note,
      status: status || orders[index].status,
      updatedAt: new Date().toISOString()
    };

    await writeFile(ordersPath, JSON.stringify(orders, null, 2), 'utf-8');
    res.json(orders[index]);
  } catch (err) {
    res.status(500).json({ message: 'Fehler beim Aktualisieren des Auftrags' });
  }
};

// Bestellung löschen
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await readFile(ordersPath, 'utf-8');
    const orders = JSON.parse(data);

    const newOrders = orders.filter(o => o.id !== id);
    await writeFile(ordersPath, JSON.stringify(newOrders, null, 2), 'utf-8');

    res.json({ message: 'Auftrag gelöscht' });
  } catch (err) {
    res.status(500).json({ message: 'Fehler beim Löschen des Auftrags' });
  }
};
