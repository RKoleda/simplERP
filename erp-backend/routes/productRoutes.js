import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { getProducts, createProduct, deleteProduct, updateProduct } from '../controllers/productController.js';
import { exportProductsPDF } from '../controllers/productController.js';

const router = express.Router();

router.get('/', verifyToken, getProducts);
router.post('/', verifyToken, createProduct);
router.put('/:id', verifyToken, updateProduct);  // NEU: Bearbeiten
router.delete('/:id', verifyToken, deleteProduct);
router.get('/export/pdf', verifyToken, exportProductsPDF);

export default router;
