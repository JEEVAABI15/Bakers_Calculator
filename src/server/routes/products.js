import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { ProductController } from '../controllers/ProductController.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', ProductController.getAll);
router.post('/', ProductController.create);
router.put('/:id', ProductController.update);
router.delete('/:id', ProductController.remove);

export default router; 