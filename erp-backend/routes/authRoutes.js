import express from 'express';
import { register, login } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/protected', verifyToken, (req, res) => {
    res.json({
      message: `Hallo ${req.user.email}, du hast Zugriff auf diese geschützte Route.`
    });
  });

export default router;
