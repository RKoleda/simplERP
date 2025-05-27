import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { v4 as uuidv4 } from 'uuid';
import { writeData } from '../utils/fileStorage.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsPath = path.join(__dirname, '../data/products.json');

const loadProducts = () => JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

export const getProducts = (req, res) => {
  try {
    const products = loadProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Fehler beim Laden der Produkte.' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, sku, description, stock, unit } = req.body;

    if (!name || !sku || !stock || !unit) {
      return res.status(400).json({ message: 'Name, SKU, Stock und Einheit sind Pflichtfelder.' });
    }

    const products = loadProducts();

    const newProduct = {
      id: uuidv4(),
      name,
      sku,
      description: description || '',
      stock: parseInt(stock),
      unit,
    };

    products.push(newProduct);
    await writeData(productsPath, products);
    res.status(201).json({ message: 'Produkt hinzugefügt', product: newProduct });
  } catch (err) {
    res.status(500).json({ message: 'Fehler beim Hinzufügen.' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sku, description, stock, unit } = req.body;

    const products = loadProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Produkt nicht gefunden.' });
    }

    const product = products[index];

    if (name !== undefined && name !== '') product.name = name;
    if (sku !== undefined && sku !== '') product.sku = sku;
    if (description !== undefined && description !== '') product.description = description;
    if (stock !== undefined && stock !== '') product.stock = parseInt(stock);
    if (unit !== undefined && unit !== '') product.unit = unit;

    await writeData(productsPath, products);
    res.json({ message: 'Produkt aktualisiert.', product });
  } catch (err) {
    res.status(500).json({ message: 'Fehler beim Aktualisieren.' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const products = loadProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Produkt nicht gefunden.' });
    }

    products.splice(index, 1);
    await writeData(productsPath, products);
    res.json({ message: 'Produkt gelöscht.' });
  } catch (err) {
    res.status(500).json({ message: 'Fehler beim Löschen.' });
  }
};

export const exportProductsPDF = async (req, res) => {
  try {
    const products = loadProducts();
    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'Keine Produkte gefunden.' });
    }

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([600, 800]);
    const { height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    let y = height - 50;

    const drawHeader = (page) => {
      page.drawText('📦 Lagerübersicht', {
        x: 50,
        y,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });
      y -= 30;
    };

    drawHeader(page);

    const lineHeight = 18;

    products.forEach((p, index) => {
      if (y < 50) {
        page = pdfDoc.addPage([600, 800]);
        y = height - 50;
        drawHeader(page);
      }

      const text = `${index + 1}. ${p.name} | SKU: ${p.sku} | Bestand: ${p.stock} ${p.unit || ''}`;
      page.drawText(text, { x: 50, y, size: 12, font });
      y -= lineHeight;
    });

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="lager.pdf"');
    res.setHeader('Content-Length', pdfBytes.length);
    res.end(Buffer.from(pdfBytes));
  } catch (err) {
    console.error('PDF-Export-Fehler:', err);
    res.status(500).json({ message: 'Fehler beim PDF-Export.' });
  }
};
