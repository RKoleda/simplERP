import { v4 as uuidv4 } from 'uuid';
import { readFileSync } from 'fs';
import { writeData } from '../utils/fileStorage.js';

const notesPath = './data/customerNotes.json';

const readNotes = () => JSON.parse(readFileSync(notesPath));

export const getNotesByCustomer = (req, res) => {
  const notes = readNotes();
  const filtered = notes.filter(n => n.customerId === req.params.customerId);
  res.json(filtered);
};

export const addNote = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Text fehlt.' });

  const notes = readNotes();
  const newNote = {
    id: uuidv4(),
    customerId: req.params.customerId,
    text,
    createdAt: new Date().toISOString()
  };
  notes.push(newNote);
  await writeData(notesPath, notes);
  res.status(201).json(newNote);
};

export const updateNote = async (req, res) => {
  const notes = readNotes();
  const index = notes.findIndex(n => n.id === req.params.noteId);
  if (index === -1) return res.status(404).json({ message: 'Notiz nicht gefunden.' });

  notes[index].text = req.body.text || notes[index].text;
  await writeData(notesPath, notes);
  res.json(notes[index]);
};

export const deleteNote = async (req, res) => {
  let notes = readNotes();
  const before = notes.length;
  notes = notes.filter(n => n.id !== req.params.noteId);
  if (notes.length === before) return res.status(404).json({ message: 'Notiz nicht gefunden.' });

  await writeData(notesPath, notes);
  res.json({ message: 'Notiz gelöscht.' });
};
