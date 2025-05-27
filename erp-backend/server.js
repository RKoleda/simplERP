import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { verifyToken } from './middlewares/authMiddleware.js';
import fs from 'fs/promises';
import path from 'path';

import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import customerNoteRoutes from './routes/customerNoteRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const dataDir = path.join(process.cwd(), 'data');
const crmFile = path.join(dataDir, 'crm.json');

// API-Endpunkte
app.get('/', (req, res) => {
  res.send('ERP Backend läuft!');
});

app.use('/api/auth', authRoutes);
app.use('/api/customers', verifyToken, customerRoutes);
app.use('/api/orders', verifyToken, orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/notes', customerNoteRoutes);
app.use('/api/inventory', inventoryRoutes);

// 🔥 CRM-Routen
app.get('/api/crm', verifyToken, async (req, res) => {
  try {
    const data = await fs.readFile(crmFile, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Laden der CRM-Daten' });
  }
});

app.post('/api/crm', verifyToken, async (req, res) => {
  try {
    const data = await fs.readFile(crmFile, 'utf-8');
    const crm = JSON.parse(data);
    const newEntry = { id: Date.now(), ...req.body };
    crm.push(newEntry);
    await fs.writeFile(crmFile, JSON.stringify(crm, null, 2));
    res.json(newEntry);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Speichern' });
  }
});

// Dashboard-Route (optional)
app.get('/api/dashboard', verifyToken, async (req, res) => {
  try {
    const customers = JSON.parse(await fs.readFile(path.join(dataDir, 'customers.json'), 'utf-8'));
    const orders = JSON.parse(await fs.readFile(path.join(dataDir, 'orders.json'), 'utf-8'));
    res.json({
      email: req.user.email,
      kunden: customers.length,
      auftraege: orders.length,
    });
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Laden des Dashboards' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server läuft auf Port ${PORT}`));
