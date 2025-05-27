import { v4 as uuidv4 } from 'uuid';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const inventoryPath = path.resolve('data/products.json');

export const getInventory = async (req, res) => {
  try {
    const data = await readFile(inventoryPath, 'utf-8');
    const inventory = JSON.parse(data);
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: 'Fehler beim Laden des Lagerbestands' });
  }
};

export const createInventoryItem = async (req, res) => {
  try {
    const { name, quantity } = req.body;
    if (!name || !quantity) return res.status(400).json({ message: 'Name und Menge sind erforderlich' });

    const newItem = {
      id: uuidv4(),
      name,
      quantity: parseInt(quantity),
      createdAt: new Date().toISOString(),
    };

    const data = await readFile(inventoryPath, 'utf-8');
    const inventory = JSON.parse(data);
    inventory.push(newItem);

    await writeFile(inventoryPath, JSON.stringify(inventory, null, 2), 'utf-8');
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Fehler beim Speichern' });
  }
};
