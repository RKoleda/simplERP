import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import {
  getNotesByCustomer,
  addNote,
  deleteNote,
  updateNote
} from '../controllers/customerNoteController.js';

const router = express.Router();

router.get('/:customerId', verifyToken, getNotesByCustomer);
router.post('/:customerId', verifyToken, addNote);
router.put('/:noteId', verifyToken, updateNote);
router.delete('/:noteId', verifyToken, deleteNote);

export default router;
