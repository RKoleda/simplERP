import fs from 'fs/promises';

// Datei lesen
export const readData = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Fehler beim Lesen von ${filePath}:`, err);
    return [];
  }
};

// Datei schreiben
export const writeData = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Fehler beim Schreiben von ${filePath}:`, err);
  }
};
