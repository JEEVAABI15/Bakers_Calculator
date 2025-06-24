import express from 'express';
import { UserController } from '../controllers/UserController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);

router.get('/me', authenticateToken, UserController.getProfile);
router.put('/me', authenticateToken, UserController.updateProfile);

export default router; 