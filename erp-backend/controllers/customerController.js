import { customers } from '../models/customerModel.js';
import { v4 as uuidv4 } from 'uuid'; // für einzigartige IDs
import { writeData } from '../utils/fileStorage.js';

// Kunde anlegen
export const createCustomer = (req, res) => {
  const { name, email, phone, address } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name und Email sind Pflichtfelder.' });
  }

  const newCustomer = {
    id: uuidv4(),
    name,
    email,
    phone,
    address
  };

  customers.push(newCustomer);
  res.status(201).json({ message: 'Kunde erfolgreich angelegt.', customer: newCustomer });
};

// Alle Kunden abrufen
export const getCustomers = (req, res) => {
  res.json(customers);
};

// Einzelnen Kunden abrufen
export const getCustomerById = (req, res) => {
  const { id } = req.params;
  const customer = customers.find(c => c.id === id);

  if (!customer) {
    return res.status(404).json({ message: 'Kunde nicht gefunden.' });
  }

  res.json(customer);
};

// Kunde aktualisieren
export const updateCustomer = (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;

  const customer = customers.find(c => c.id === id);

  if (!customer) {
    return res.status(404).json({ message: 'Kunde nicht gefunden.' });
  }

  customer.name = name || customer.name;
  customer.email = email || customer.email;
  customer.phone = phone || customer.phone;
  customer.address = address || customer.address;

  res.json({ message: 'Kunde aktualisiert.', customer });
};

// Kunde löschen
export const deleteCustomer = (req, res) => {
  const { id } = req.params;
  const index = customers.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Kunde nicht gefunden.' });
  }

  customers.splice(index, 1);
  res.json({ message: 'Kunde gelöscht.' });
};
