import express from 'express';
import { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer } from '../controllers/customerController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Alle Routen sind geschützt (Token nötig)

// Kunde anlegen
router.post('/', verifyToken, createCustomer);

// Alle Kunden abrufen
router.get('/', verifyToken, getCustomers);

// Einzelnen Kunden abrufen
router.get('/:id', verifyToken, getCustomerById);

// Kunden aktualisieren
router.put('/:id', verifyToken, updateCustomer);

// Kunden löschen
router.delete('/:id', verifyToken, deleteCustomer);

export default router;
