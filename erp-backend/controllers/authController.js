import { User } from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const users = []; // einfache In-Memory-Liste für registrierte User

export const register = (req, res) => {
  const { email, password } = req.body;

  // Check: E-Mail schon vorhanden?
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Benutzer existiert bereits.' });
  }

  // Neuen Benutzer anlegen
  const newUser = new User(email, password);
  users.push(newUser);

  res.status(201).json({ message: 'Benutzer erfolgreich registriert.' });
};

export const login = (req, res) => {
  const { email, password } = req.body;

  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Benutzer nicht gefunden.' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Falsches Passwort.' });
  }

  // JWT erstellen
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ message: 'Login erfolgreich.', token });
};
