import express from 'express';
import { getInventory, createInventoryItem } from '../controllers/inventoryController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getInventory);
router.post('/', verifyToken, createInventoryItem);

export default router;
